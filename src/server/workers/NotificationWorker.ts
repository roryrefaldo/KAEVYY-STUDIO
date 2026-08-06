/**
 * KAEVY STUDIO - Notification Background Worker
 * Phase 10.4 Enterprise Scalability
 */

import { BaseWorker } from './baseWorker.js';
import { QueueName, QueueJob } from '../queue/queueTypes.js';
import { emitNotificationToUser } from '../socket/notificationGateway.js';
import { logger } from '../utils/logger.js';

export interface NotificationJobPayload {
  userId: string;
  title: string;
  message: string;
  channel: 'PUSH' | 'IN_APP' | 'SOCKET';
  metadata?: Record<string, any>;
}

export class NotificationWorker extends BaseWorker<NotificationJobPayload> {
  constructor() {
    super(QueueName.NOTIFICATION_QUEUE, 'NotificationWorker');
  }

  protected async processJob(job: QueueJob<NotificationJobPayload>): Promise<any> {
    const { userId, title, message, channel, metadata } = job.data;
    logger.info(`[NotificationWorker] Dispatching notification to user ${userId} via ${channel}`, { title });

    // Send via socket notification gateway if applicable
    try {
      emitNotificationToUser(userId, {
        id: `notif_${Date.now()}`,
        userId,
        title,
        message,
        type: metadata?.type || 'SYSTEM',
        readAt: null,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      logger.debug(`[NotificationWorker] Socket gateway dispatch notice: ${err?.message}`);
    }

    return { sent: true, userId, channel, timestamp: new Date().toISOString() };
  }
}

export const notificationWorker = new NotificationWorker();
