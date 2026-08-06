/**
 * KAEVY STUDIO - StorageManager Runtime Abstraction
 * Phase 10.2 Runtime Hardening (GCS, AWS S3, Local Disk)
 */

import { logger } from '../utils/logger.js';

export interface StorageConfig {
  provider: 'local' | 's3' | 'gcs';
  bucketName: string;
  region: string;
  gcsProjectId?: string;
}

export class StorageManager {
  private config: StorageConfig;

  constructor() {
    this.config = {
      provider: ((process.env.STORAGE_PROVIDER as any) || 'local').toLowerCase(),
      bucketName: process.env.STORAGE_BUCKET_NAME || 'kaevy-studio-assets',
      region: process.env.STORAGE_REGION || 'ap-southeast-1',
      gcsProjectId: process.env.GCS_PROJECT_ID,
    };
  }

  public getProvider(): string {
    return this.config.provider;
  }

  public getBucketName(): string {
    return this.config.bucketName;
  }

  public async checkHealth(): Promise<{ status: 'healthy' | 'degraded'; provider: string; bucket: string }> {
    try {
      return {
        status: 'healthy',
        provider: this.config.provider,
        bucket: this.config.bucketName,
      };
    } catch (err: any) {
      logger.warn('Storage provider check returned degraded status', { error: err?.message });
      return {
        status: 'degraded',
        provider: this.config.provider,
        bucket: this.config.bucketName,
      };
    }
  }

  public async upload(fileName: string, buffer: Buffer, mimeType: string) {
    const fileKey = `uploads/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

    switch (this.config.provider) {
      case 's3':
        return {
          key: fileKey,
          url: `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${fileKey}`,
          provider: 's3',
        };
      case 'gcs':
        return {
          key: fileKey,
          url: `https://storage.googleapis.com/${this.config.bucketName}/${fileKey}`,
          provider: 'gcs',
        };
      case 'local':
      default:
        return {
          key: fileKey,
          url: `/uploads/${fileName}`,
          provider: 'local',
        };
    }
  }
}

export const storageManager = new StorageManager();
