/**
 * KAEVY STUDIO - Dead Letter Queue (DLQ) Registry & Admin Engine
 * Phase 10.4 Enterprise Scalability
 */

import { DeadLetterJob, QueueName } from './queueTypes.js';
import { queueMetricsTracker } from './queueMetrics.js';
import { logger } from '../utils/logger.js';

export class DeadLetterQueueManager {
  private dlqStorage: Map<string, DeadLetterJob> = new Map();
  private maxStoredDLQJobs = 500;

  public pushToDLQ(job: DeadLetterJob) {
    this.dlqStorage.set(job.id, job);
    queueMetricsTracker.recordDeadLetter(job.queueName);

    logger.error(`[DLQ Manager] Job ${job.id} registered in DLQ buffer`, {
      queue: job.queueName,
      failedAttempts: job.failedAttempts,
      reason: job.finalError,
    });

    // Enforce memory limit for DLQ buffer
    if (this.dlqStorage.size > this.maxStoredDLQJobs) {
      const oldestKey = this.dlqStorage.keys().next().value;
      if (oldestKey) {
        this.dlqStorage.delete(oldestKey);
      }
    }
  }

  public getDLQJobs(queueName?: QueueName, limit = 50, page = 1): { jobs: DeadLetterJob[]; total: number } {
    let all = Array.from(this.dlqStorage.values());
    if (queueName) {
      all = all.filter((j) => j.queueName === queueName);
    }
    const total = all.length;
    const startIndex = (page - 1) * limit;
    const jobs = all.slice(startIndex, startIndex + limit);

    return { jobs, total };
  }

  public getDLQJobById(jobId: string): DeadLetterJob | undefined {
    return this.dlqStorage.get(jobId);
  }

  public removeDLQJob(jobId: string): boolean {
    return this.dlqStorage.delete(jobId);
  }

  public clearDLQ(queueName?: QueueName): number {
    if (!queueName) {
      const count = this.dlqStorage.size;
      this.dlqStorage.clear();
      return count;
    }

    let cleared = 0;
    for (const [id, job] of this.dlqStorage.entries()) {
      if (job.queueName === queueName) {
        this.dlqStorage.delete(id);
        cleared++;
      }
    }
    return cleared;
  }
}

export const deadLetterQueueManager = new DeadLetterQueueManager();
