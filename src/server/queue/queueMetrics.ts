/**
 * KAEVY STUDIO - Queue Telemetry & Performance Metrics
 * Phase 10.4 Enterprise Scalability
 */

import { QueueName } from './queueTypes.js';

export interface QueueStatDTO {
  queueName: QueueName;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  waitingJobs: number;
  delayedJobs: number;
  deadLetterCount: number;
  avgLatencyMs: number;
}

export class QueueMetricsTracker {
  private activeCount: Map<QueueName, number> = new Map();
  private completedCount: Map<QueueName, number> = new Map();
  private failedCount: Map<QueueName, number> = new Map();
  private waitingCount: Map<QueueName, number> = new Map();
  private delayedCount: Map<QueueName, number> = new Map();
  private totalProcessingTimeMs: Map<QueueName, number> = new Map();
  private deadLetterCount: Map<QueueName, number> = new Map();

  constructor() {
    Object.values(QueueName).forEach((qName) => {
      this.activeCount.set(qName as QueueName, 0);
      this.completedCount.set(qName as QueueName, 0);
      this.failedCount.set(qName as QueueName, 0);
      this.waitingCount.set(qName as QueueName, 0);
      this.delayedCount.set(qName as QueueName, 0);
      this.totalProcessingTimeMs.set(qName as QueueName, 0);
      this.deadLetterCount.set(qName as QueueName, 0);
    });
  }

  public recordEnqueued(queueName: QueueName, isDelayed = false) {
    if (isDelayed) {
      this.delayedCount.set(queueName, (this.delayedCount.get(queueName) || 0) + 1);
    } else {
      this.waitingCount.set(queueName, (this.waitingCount.get(queueName) || 0) + 1);
    }
  }

  public recordProcessingStarted(queueName: QueueName) {
    const waiting = Math.max(0, (this.waitingCount.get(queueName) || 0) - 1);
    this.waitingCount.set(queueName, waiting);
    this.activeCount.set(queueName, (this.activeCount.get(queueName) || 0) + 1);
  }

  public recordCompleted(queueName: QueueName, durationMs: number) {
    const active = Math.max(0, (this.activeCount.get(queueName) || 0) - 1);
    this.activeCount.set(queueName, active);
    this.completedCount.set(queueName, (this.completedCount.get(queueName) || 0) + 1);
    this.totalProcessingTimeMs.set(queueName, (this.totalProcessingTimeMs.get(queueName) || 0) + durationMs);
  }

  public recordFailed(queueName: QueueName) {
    const active = Math.max(0, (this.activeCount.get(queueName) || 0) - 1);
    this.activeCount.set(queueName, active);
    this.failedCount.set(queueName, (this.failedCount.get(queueName) || 0) + 1);
  }

  public recordDeadLetter(queueName: QueueName) {
    this.deadLetterCount.set(queueName, (this.deadLetterCount.get(queueName) || 0) + 1);
  }

  public getQueueStats(queueName: QueueName): QueueStatDTO {
    const completed = this.completedCount.get(queueName) || 0;
    const totalDuration = this.totalProcessingTimeMs.get(queueName) || 0;
    const avgLatency = completed > 0 ? Math.round(totalDuration / completed) : 0;

    return {
      queueName,
      activeJobs: this.activeCount.get(queueName) || 0,
      completedJobs: completed,
      failedJobs: this.failedCount.get(queueName) || 0,
      waitingJobs: this.waitingCount.get(queueName) || 0,
      delayedJobs: this.delayedCount.get(queueName) || 0,
      deadLetterCount: this.deadLetterCount.get(queueName) || 0,
      avgLatencyMs: avgLatency,
    };
  }

  public getAllMetrics() {
    const stats: QueueStatDTO[] = [];
    let grandTotalActive = 0;
    let grandTotalCompleted = 0;
    let grandTotalFailed = 0;
    let grandTotalWaiting = 0;
    let grandTotalDelayed = 0;
    let grandTotalDLQ = 0;

    Object.values(QueueName).forEach((qName) => {
      const qStat = this.getQueueStats(qName as QueueName);
      stats.push(qStat);
      grandTotalActive += qStat.activeJobs;
      grandTotalCompleted += qStat.completedJobs;
      grandTotalFailed += qStat.failedJobs;
      grandTotalWaiting += qStat.waitingJobs;
      grandTotalDelayed += qStat.delayedJobs;
      grandTotalDLQ += qStat.deadLetterCount;
    });

    return {
      queues: stats,
      summary: {
        totalActiveJobs: grandTotalActive,
        totalCompletedJobs: grandTotalCompleted,
        totalFailedJobs: grandTotalFailed,
        totalWaitingJobs: grandTotalWaiting,
        totalDelayedJobs: grandTotalDelayed,
        totalDeadLetterJobs: grandTotalDLQ,
        processingRatePerMin: Math.round((grandTotalCompleted / Math.max(1, process.uptime())) * 60),
      },
    };
  }
}

export const queueMetricsTracker = new QueueMetricsTracker();
