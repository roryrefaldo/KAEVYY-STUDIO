/**
 * KAEVY STUDIO - Queue System Types & Definitions
 * Phase 10.4 Enterprise Scalability
 */

export enum QueueName {
  EMAIL_QUEUE = 'EMAIL_QUEUE',
  NOTIFICATION_QUEUE = 'NOTIFICATION_QUEUE',
  ESCROW_QUEUE = 'ESCROW_QUEUE',
  PAYMENT_QUEUE = 'PAYMENT_QUEUE',
  UPLOAD_QUEUE = 'UPLOAD_QUEUE',
  THUMBNAIL_QUEUE = 'THUMBNAIL_QUEUE',
  ASSET_SCAN_QUEUE = 'ASSET_SCAN_QUEUE',
  AUDIT_QUEUE = 'AUDIT_QUEUE',
  WEBHOOK_QUEUE = 'WEBHOOK_QUEUE',
}

export interface JobOptions {
  priority?: number; // 1 (highest) - 10 (lowest)
  delayMs?: number;
  attempts?: number; // Default: 3
  backoffMs?: number; // Default: 1000ms exponential
  metadata?: Record<string, any>;
}

export interface QueueJob<T = any> {
  id: string;
  queueName: QueueName;
  data: T;
  options: JobOptions;
  attemptsMade: number;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  failedAt?: string;
  errorReason?: string;
}

export interface DeadLetterJob extends QueueJob {
  failedAttempts: number;
  finalError: string;
  stackTrace?: string;
}
