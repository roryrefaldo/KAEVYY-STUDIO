/**
 * KAEVY STUDIO - Asset Upload Pipeline Worker
 * Phase 10.4 Enterprise Scalability
 */

import { BaseWorker } from './baseWorker.js';
import { QueueName, QueueJob } from '../queue/queueTypes.js';
import { queueManager } from '../queue/queueManager.js';
import { logger } from '../utils/logger.js';

export interface AssetProcessingPayload {
  assetId: string;
  filePath: string;
  originalName: string;
  mimeType: string;
}

export class AssetProcessingWorker extends BaseWorker<AssetProcessingPayload> {
  constructor() {
    super(QueueName.UPLOAD_QUEUE, 'AssetProcessingWorker');
  }

  protected async processJob(job: QueueJob<AssetProcessingPayload>): Promise<any> {
    const { assetId, filePath, originalName } = job.data;
    logger.info(`[AssetProcessingWorker] Initializing async pipeline for asset ${assetId} (${originalName})`);

    // Chain to Virus Scan & Thumbnail Generation queues
    await queueManager.enqueueVirusScan(assetId, filePath);
    await queueManager.enqueueThumbnailGeneration(assetId, filePath);

    return { pipelineInitiated: true, assetId, filePath };
  }
}

export const assetProcessingWorker = new AssetProcessingWorker();
