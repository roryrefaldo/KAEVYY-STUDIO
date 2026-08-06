/**
 * KAEVY STUDIO - Worker Registry & Lifecycle Manager
 * Phase 10.4 Enterprise Scalability
 */

import { emailWorker } from './EmailWorker.js';
import { notificationWorker } from './NotificationWorker.js';
import { escrowWorker } from './EscrowWorker.js';
import { webhookWorker } from './WebhookWorker.js';
import { assetProcessingWorker } from './AssetProcessingWorker.js';
import { virusScanWorker } from './VirusScanWorker.js';
import { thumbnailWorker } from './ThumbnailWorker.js';
import { auditWorker } from './AuditWorker.js';
import { logger } from '../utils/logger.js';

export class WorkerRegistry {
  private static workers = [
    emailWorker,
    notificationWorker,
    escrowWorker,
    webhookWorker,
    assetProcessingWorker,
    virusScanWorker,
    thumbnailWorker,
    auditWorker,
  ];

  public static initializeAllWorkers(): void {
    logger.info('[WorkerRegistry] Bootstrapping background queue workers...');
    for (const worker of this.workers) {
      try {
        worker.start();
      } catch (err: any) {
        logger.error(`[WorkerRegistry] Failed to start worker: ${err?.message}`);
      }
    }
  }

  public static stopAllWorkers(): void {
    logger.info('[WorkerRegistry] Stopping all background queue workers...');
    for (const worker of this.workers) {
      try {
        worker.stop();
      } catch (err: any) {
        logger.error(`[WorkerRegistry] Error stopping worker: ${err?.message}`);
      }
    }
  }

  public static getActiveWorkerCount(): number {
    return this.workers.filter((w) => w.isActive()).length;
  }
}
