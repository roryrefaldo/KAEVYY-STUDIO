/**
 * KAEVY STUDIO - Central Queue Manager
 * Phase 10.4 Enterprise Scalability
 */

import { QueueName, QueueJob, JobOptions } from './queueTypes.js';
import { QueueFactory } from './queueFactory.js';
import { queueMetricsTracker } from './queueMetrics.js';
import { deadLetterQueueManager } from './deadLetterQueue.js';
import { logger } from '../utils/logger.js';

export class QueueManager {
  /**
   * Dispatches a job to the specified named queue.
   */
  public async enqueue<T = any>(
    queueName: QueueName,
    data: T,
    options?: JobOptions
  ): Promise<QueueJob<T>> {
    const queue = QueueFactory.getQueue(queueName);
    const job = await queue.enqueue(data, options);
    return job;
  }

  /**
   * Enqueues an email dispatch job
   */
  public async enqueueEmail(to: string, subject: string, template: string, payload: Record<string, any>, options?: JobOptions) {
    return this.enqueue(QueueName.EMAIL_QUEUE, { to, subject, template, payload }, options);
  }

  /**
   * Enqueues a notification job
   */
  public async enqueueNotification(userId: string, title: string, message: string, channel: 'PUSH' | 'IN_APP' | 'SOCKET' = 'IN_APP', metadata?: Record<string, any>, options?: JobOptions) {
    return this.enqueue(QueueName.NOTIFICATION_QUEUE, { userId, title, message, channel, metadata }, options);
  }

  /**
   * Enqueues an escrow processing job
   */
  public async enqueueEscrowRelease(orderNumber: string, milestoneId: string, amount: number, options?: JobOptions) {
    return this.enqueue(QueueName.ESCROW_QUEUE, { orderNumber, milestoneId, amount }, options);
  }

  /**
   * Enqueues a webhook processing job
   */
  public async enqueueWebhook(provider: string, eventType: string, payload: Record<string, any>, signature?: string, options?: JobOptions) {
    return this.enqueue(QueueName.WEBHOOK_QUEUE, { provider, eventType, payload, signature, receivedAt: new Date().toISOString() }, options);
  }

  /**
   * Enqueues an asset upload pipeline job
   */
  public async enqueueAssetProcessing(assetId: string, filePath: string, originalName: string, mimeType: string, options?: JobOptions) {
    return this.enqueue(QueueName.UPLOAD_QUEUE, { assetId, filePath, originalName, mimeType }, options);
  }

  /**
   * Enqueues a virus scan job
   */
  public async enqueueVirusScan(assetId: string, filePath: string, options?: JobOptions) {
    return this.enqueue(QueueName.ASSET_SCAN_QUEUE, { assetId, filePath }, options);
  }

  /**
   * Enqueues a thumbnail generation job
   */
  public async enqueueThumbnailGeneration(assetId: string, filePath: string, options?: JobOptions) {
    return this.enqueue(QueueName.THUMBNAIL_QUEUE, { assetId, filePath }, options);
  }

  /**
   * Enqueues an audit log recording job
   */
  public async enqueueAuditLog(userId: string | undefined, action: string, resource: string, payload: Record<string, any>, ip?: string, options?: JobOptions) {
    return this.enqueue(QueueName.AUDIT_QUEUE, { userId, action, resource, payload, ip, timestamp: new Date().toISOString() }, options);
  }

  /**
   * Retrieves queue telemetry & performance stats
   */
  public getMetrics() {
    return queueMetricsTracker.getAllMetrics();
  }

  /**
   * Exposes Dead Letter Queue management
   */
  public getDLQManager() {
    return deadLetterQueueManager;
  }
}

export const queueManager = new QueueManager();
