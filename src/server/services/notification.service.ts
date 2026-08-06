import { db } from '../../db/index.js';
import { notifications } from '../../db/schema/index.js';
import { eq, and, desc } from 'drizzle-orm';
import { NotFoundError } from '../errors/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function getUserNotifications(userId: string) {
  return safeDbExecute(
    async () => {
      return await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt));
    },
    async () => {
      return mockData.notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  );
}

export async function markNotificationRead(notificationId: string, userId: string) {
  return safeDbExecute(
    async () => {
      const [updated] = await db
        .update(notifications)
        .set({ readAt: new Date() })
        .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
        .returning();

      if (!updated) throw new NotFoundError('ORDER_NOT_FOUND', 'Notifikasi tidak ditemukan.');
      return updated;
    },
    async () => {
      const n = mockData.notifications.find((notif) => notif.id === notificationId && notif.userId === userId);
      if (!n) throw new NotFoundError('ORDER_NOT_FOUND', 'Notifikasi tidak ditemukan.');
      (n as any).readAt = new Date();
      return n;
    }
  );
}

export async function markAllNotificationsRead(userId: string) {
  return safeDbExecute(
    async () => {
      await db.update(notifications).set({ readAt: new Date() }).where(eq(notifications.userId, userId));
      return { success: true };
    },
    async () => {
      mockData.notifications.filter((n) => n.userId === userId).forEach((n) => ((n as any).readAt = new Date()));
      return { success: true };
    }
  );
}

export async function createNotification(userId: string, type: string, title: string, message: string) {
  return safeDbExecute(
    async () => {
      const [n] = await db
        .insert(notifications)
        .values({
          userId,
          type,
          title,
          message,
        })
        .returning();
      return n;
    },
    async () => {
      const n = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        type,
        title,
        message,
        readAt: null,
        createdAt: new Date(),
      };
      mockData.notifications.push(n as any);
      return n;
    }
  );
}

