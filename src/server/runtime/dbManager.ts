/**
 * KAEVY STUDIO - PostgreSQL / Cloud SQL Connection Manager
 * Phase 10.2 Runtime Hardening
 */

import { pool } from '../../db/index.js';
import { logger } from '../utils/logger.js';

export class DbManager {
  public async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy'; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
      const client = await pool.connect();
      try {
        await client.query('SELECT 1');
        return {
          status: 'healthy',
          latencyMs: Date.now() - start,
        };
      } finally {
        client.release();
      }
    } catch (err: any) {
      logger.error('Database connection health check failed', err);
      return {
        status: 'unhealthy',
        latencyMs: Date.now() - start,
        error: err?.message || 'Database connection error',
      };
    }
  }

  public getPoolStats() {
    return {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    };
  }

  public async disconnect(): Promise<void> {
    try {
      await pool.end();
      logger.info('Database connection pool ended gracefully');
    } catch (err: any) {
      logger.error('Error ending database connection pool', err);
    }
  }
}

export const dbManager = new DbManager();
