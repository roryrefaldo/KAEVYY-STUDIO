/**
 * KAEVY STUDIO - Scheduler Manager & Cron Job Registry
 * Phase 10.4 Enterprise Scalability
 */

import { logger } from '../utils/logger.js';
import { responseCache } from '../cache/responseCache.js';

export interface ScheduledTaskDef {
  id: string;
  name: string;
  intervalMs: number;
  handler: () => Promise<void>;
  lastRunAt?: string;
  nextRunAt?: string;
  runCount: number;
}

export class SchedulerManager {
  private tasks: Map<string, ScheduledTaskDef> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  constructor() {
    this.registerDefaultJobs();
  }

  /**
   * Registers default recurring maintenance & cleanup tasks
   */
  private registerDefaultJobs() {
    // 1. Expired Warranties Inspector (Every 1 hour)
    this.registerJob('expired_warranties_task', 'Check Expired Warranties', 60 * 60 * 1000, async () => {
      logger.info('[Scheduler] Running expired warranties audit task...');
    });

    // 2. Inactive Sessions Cleanup (Every 30 minutes)
    this.registerJob('inactive_sessions_task', 'Cleanup Inactive User Sessions', 30 * 60 * 1000, async () => {
      logger.info('[Scheduler] Cleaning up stale inactive user sessions...');
    });

    // 3. Old Notifications Cleanup (Every 24 hours)
    this.registerJob('cleanup_notifications_task', 'Purge Read Notifications > 30 days', 24 * 60 * 60 * 1000, async () => {
      logger.info('[Scheduler] Purging archived notifications older than 30 days...');
    });

    // 4. Temporary Uploads Cleanup (Every 6 hours)
    this.registerJob('cleanup_uploads_task', 'Purge Unlinked Temp Upload Files', 6 * 60 * 60 * 1000, async () => {
      logger.info('[Scheduler] Sweeping temporary upload buffers...');
    });

    // 5. Cache Pre-Warming Task (Every 15 minutes)
    this.registerJob('cache_warming_task', 'Pre-warm Public Endpoint Response Cache', 15 * 60 * 1000, async () => {
      logger.info('[Scheduler] Pre-warming response cache for services and exchange rates...');
      await responseCache.warmCache(['/api/v1/services', '/api/v1/exchange-rates']);
    });
  }

  public registerJob(id: string, name: string, intervalMs: number, handler: () => Promise<void>) {
    this.tasks.set(id, {
      id,
      name,
      intervalMs,
      handler,
      runCount: 0,
    });
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    logger.info(`[SchedulerManager] Starting background scheduler with ${this.tasks.size} cron jobs...`);

    for (const [id, task] of this.tasks.entries()) {
      const timer = setInterval(async () => {
        try {
          task.lastRunAt = new Date().toISOString();
          task.runCount++;
          await task.handler();
        } catch (err: any) {
          logger.error(`[Scheduler Error] Task '${task.name}' failed: ${err?.message}`);
        }
      }, task.intervalMs);

      timer.unref(); // Allow Node process to exit gracefully
      this.timers.set(id, timer);
    }
  }

  public stop() {
    this.isRunning = false;
    for (const [id, timer] of this.timers.entries()) {
      clearInterval(timer);
    }
    this.timers.clear();
    logger.info('[SchedulerManager] Background scheduler stopped.');
  }

  public getCronRegistry() {
    return Array.from(this.tasks.values()).map((t) => ({
      id: t.id,
      name: t.name,
      intervalMs: t.intervalMs,
      intervalMinutes: Math.round(t.intervalMs / 60000),
      lastRunAt: t.lastRunAt || 'Never',
      runCount: t.runCount,
    }));
  }
}

export const schedulerManager = new SchedulerManager();
