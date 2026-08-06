/**
 * KAEVY STUDIO - Centralized Health & Observability Service
 * Phase 10.3 Enterprise Observability Telemetry
 */

import { dbManager } from './dbManager.js';
import { redisManager } from './redisManager.js';
import { storageManager } from './storageManager.js';
import { metricsTracker } from '../observability/metricsTracker.js';

export class HealthService {
  public getLiveness() {
    return {
      status: 'alive',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      pid: process.pid,
    };
  }

  public async getReadiness() {
    const dbHealth = await dbManager.checkHealth();
    const redisHealth = await redisManager.ping();
    const storageHealth = await storageManager.checkHealth();
    const memUsage = process.memoryUsage();

    const isReady = dbHealth.status === 'healthy';

    return {
      status: isReady ? 'ready' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      services: {
        express: { status: 'healthy' },
        postgres: dbHealth,
        redis: redisHealth,
        storage: storageHealth,
      },
      system: {
        memory: {
          rssMb: Math.round(memUsage.rss / 1024 / 1024),
          heapTotalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
          heapUsedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
        },
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
      },
    };
  }

  public async getHealthSummary() {
    const readyState = await this.getReadiness();
    return {
      status: readyState.status,
      service: 'KAEVY STUDIO API v1',
      version: '1.0.0-RC1',
      environment: process.env.NODE_ENV || 'development',
      timestamp: readyState.timestamp,
      uptime: `${readyState.uptimeSeconds}s`,
    };
  }

  public async getMetrics() {
    const dashboardData = await metricsTracker.getDashboardData();
    return {
      metrics: dashboardData,
      timestamp: new Date().toISOString(),
    };
  }

  public getVersion() {
    return {
      application: 'KAEVY STUDIO',
      version: '1.0.0-RC1',
      buildTimestamp: '2026-08-03T10:00:00Z',
      gitCommitHash: 'rc1-prod-deployment-phase10',
      runtime: 'Node.js Enterprise Cloud Engine',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
    };
  }
}

export const healthService = new HealthService();
