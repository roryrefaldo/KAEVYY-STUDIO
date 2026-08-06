/**
 * KAEVY STUDIO - Abstract Base Worker Class
 * Phase 10.4 Enterprise Scalability
 */

import { QueueName, QueueJob } from '../queue/queueTypes.js';
import { QueueFactory } from '../queue/queueFactory.js';
import { logger } from '../utils/logger.js';

export abstract class BaseWorker<T = any> {
  protected queueName: QueueName;
  protected isRunning = false;
  protected workerName: string;

  constructor(queueName: QueueName, workerName: string) {
    this.queueName = queueName;
    this.workerName = workerName;
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    logger.info(`[Worker] ${this.workerName} started listening on queue ${this.queueName}`);

    const queueAdapter = QueueFactory.getQueue(this.queueName);
    queueAdapter.process<T>(async (job: QueueJob<T>) => {
      try {
        return await this.processJob(job);
      } catch (err: any) {
        logger.error(`[Worker Error] ${this.workerName} encountered job processing error:`, {
          jobId: job.id,
          queue: this.queueName,
          error: err?.message,
        });
        throw err; // Re-throw so Queue adapter handles retries or DLQ
      }
    });
  }

  public stop(): void {
    this.isRunning = false;
    logger.info(`[Worker] ${this.workerName} stopped listening on queue ${this.queueName}`);
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Concrete job handling implementation
   */
  protected abstract processJob(job: QueueJob<T>): Promise<any>;
}
