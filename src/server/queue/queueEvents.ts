/**
 * KAEVY STUDIO - Queue Events Observer & Telemetry Hook
 * Phase 10.4 Enterprise Scalability
 */

import { EventEmitter } from 'events';
import { QueueJob, DeadLetterJob } from './queueTypes.js';
import { logger } from '../utils/logger.js';

export class QueueEventsEmitter extends EventEmitter {
  public emitJobEnqueued(job: QueueJob) {
    logger.debug(`[Queue Event] Job enqueued to ${job.queueName}`, { jobId: job.id });
    this.emit('job:enqueued', job);
  }

  public emitJobProcessing(job: QueueJob) {
    logger.debug(`[Queue Event] Job processing started: ${job.queueName}`, { jobId: job.id });
    this.emit('job:processing', job);
  }

  public emitJobCompleted(job: QueueJob, result?: any) {
    logger.info(`[Queue Event] Job completed successfully: ${job.queueName}`, {
      jobId: job.id,
      attempts: job.attemptsMade,
    });
    this.emit('job:completed', { job, result });
  }

  public emitJobFailed(job: QueueJob, error: Error) {
    logger.warn(`[Queue Event] Job attempt failed: ${job.queueName}`, {
      jobId: job.id,
      attemptsMade: job.attemptsMade,
      error: error.message,
    });
    this.emit('job:failed', { job, error });
  }

  public emitJobSentToDLQ(dlqJob: DeadLetterJob) {
    logger.error(`[Queue Event] Job moved to Dead Letter Queue: ${dlqJob.queueName}`, {
      jobId: dlqJob.id,
      failedAttempts: dlqJob.failedAttempts,
      reason: dlqJob.finalError,
    });
    this.emit('job:dlq', dlqJob);
  }
}

export const queueEvents = new QueueEventsEmitter();
