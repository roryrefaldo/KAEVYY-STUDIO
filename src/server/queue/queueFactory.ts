/**
 * KAEVY STUDIO - Central Queue Factory
 * Phase 10.4 Enterprise Scalability
 */

import { QueueName, QueueJob, JobOptions, DeadLetterJob } from './queueTypes.js';
import { queueEvents } from './queueEvents.js';
import { queueMetricsTracker } from './queueMetrics.js';
import { deadLetterQueueManager } from './deadLetterQueue.js';
import { redisManager } from '../runtime/redisManager.js';
import { logger } from '../utils/logger.js';

export interface IQueueAdapter {
  enqueue<T = any>(data: T, options?: JobOptions): Promise<QueueJob<T>>;
  process<T = any>(handler: (job: QueueJob<T>) => Promise<any>): void;
  getJob(jobId: string): Promise<QueueJob | null>;
}

export class InMemoryQueueAdapter implements IQueueAdapter {
  private queueName: QueueName;
  private jobStore: Map<string, QueueJob> = new Map();
  private pendingQueue: string[] = [];
  private handler: ((job: QueueJob) => Promise<any>) | null = null;
  private isProcessing = false;

  constructor(queueName: QueueName) {
    this.queueName = queueName;
  }

  public async enqueue<T = any>(data: T, options: JobOptions = {}): Promise<QueueJob<T>> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const job: QueueJob<T> = {
      id: jobId,
      queueName: this.queueName,
      data,
      options: {
        priority: options.priority || 5,
        delayMs: options.delayMs || 0,
        attempts: options.attempts || 3,
        backoffMs: options.backoffMs || 1000,
        metadata: options.metadata || {},
      },
      attemptsMade: 0,
      createdAt: new Date().toISOString(),
    };

    this.jobStore.set(jobId, job);
    queueMetricsTracker.recordEnqueued(this.queueName, Boolean(options.delayMs));
    queueEvents.emitJobEnqueued(job);

    if (options.delayMs && options.delayMs > 0) {
      setTimeout(() => {
        this.pendingQueue.push(jobId);
        this.triggerProcessing();
      }, options.delayMs).unref();
    } else {
      this.pendingQueue.push(jobId);
      setImmediate(() => this.triggerProcessing());
    }

    return job;
  }

  public process<T = any>(handler: (job: QueueJob<T>) => Promise<any>): void {
    this.handler = handler;
    this.triggerProcessing();
  }

  public async getJob(jobId: string): Promise<QueueJob | null> {
    return this.jobStore.get(jobId) || null;
  }

  private async triggerProcessing() {
    if (this.isProcessing || !this.handler || this.pendingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.pendingQueue.length > 0 && this.handler) {
      const jobId = this.pendingQueue.shift();
      if (!jobId) continue;

      const job = this.jobStore.get(jobId);
      if (!job) continue;

      const startTime = Date.now();
      job.processedAt = new Date().toISOString();
      job.attemptsMade++;

      queueMetricsTracker.recordProcessingStarted(this.queueName);
      queueEvents.emitJobProcessing(job);

      try {
        const result = await this.handler(job);
        const durationMs = Date.now() - startTime;
        job.completedAt = new Date().toISOString();

        queueMetricsTracker.recordCompleted(this.queueName, durationMs);
        queueEvents.emitJobCompleted(job, result);
      } catch (err: any) {
        const durationMs = Date.now() - startTime;
        const maxAttempts = job.options.attempts || 3;

        if (job.attemptsMade < maxAttempts) {
          queueMetricsTracker.recordFailed(this.queueName);
          queueEvents.emitJobFailed(job, err);

          const backoff = (job.options.backoffMs || 1000) * Math.pow(2, job.attemptsMade - 1);
          logger.warn(`[In-Memory Queue] Retrying job ${job.id} in ${backoff}ms (Attempt ${job.attemptsMade}/${maxAttempts})`);

          setTimeout(() => {
            this.pendingQueue.push(job.id);
            this.triggerProcessing();
          }, backoff).unref();
        } else {
          job.failedAt = new Date().toISOString();
          job.errorReason = err?.message || 'Unknown processing error';

          queueMetricsTracker.recordFailed(this.queueName);

          const dlqJob: DeadLetterJob = {
            ...job,
            failedAttempts: job.attemptsMade,
            finalError: err?.message || 'Exceeded maximum retry attempts',
            stackTrace: err?.stack,
          };

          deadLetterQueueManager.pushToDLQ(dlqJob);
          queueEvents.emitJobSentToDLQ(dlqJob);
        }
      }
    }

    this.isProcessing = false;
  }
}

export class QueueFactory {
  private static adapters: Map<QueueName, IQueueAdapter> = new Map();

  public static getQueue(queueName: QueueName): IQueueAdapter {
    let adapter = this.adapters.get(queueName);
    if (!adapter) {
      // Automatic fallback to in-memory adapter or Redis adapter
      adapter = new InMemoryQueueAdapter(queueName);
      this.adapters.set(queueName, adapter);

      if (!redisManager.isConnected()) {
        logger.debug(`[QueueFactory] Initialized ${queueName} with In-Memory fallback adapter`);
      }
    }
    return adapter;
  }
}
