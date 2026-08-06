import { db } from '../../db/index.js';
import {
  orders,
  orderItems,
  projects,
  projectMilestones,
  orderEvents,
  services,
  developerProfiles,
  platformFeeSettings,
  clientProfiles
} from '../../db/schema/index.js';
import { eq, and, count, desc } from 'drizzle-orm';
import { NotFoundError, ForbiddenError, CapacityExceededError } from '../errors/index.js';
import { generateOrderNumber, getDeveloperMaxCapacity } from '../../db/utils.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';
import { createNotification } from './notification.service.js';

export async function createOrder(
  userId: string,
  clientProfileId: string,
  data: {
    serviceId: string;
    customScopeDescription?: string;
    customAgreedPrice?: number;
    customAgreedCurrency?: string;
  }
) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const serviceList = await tx.select().from(services).where(eq(services.id, data.serviceId)).limit(1);
        if (serviceList.length === 0) {
          throw new NotFoundError('SERVICE_NOT_FOUND', 'Jasa / Layanan yang dipilih tidak ditemukan.');
        }

        const s = serviceList[0];
        const devId = s.developerProfileId;

        const devProfile = await tx.select().from(developerProfiles).where(eq(developerProfiles.id, devId)).limit(1);
        if (devProfile.length === 0) {
          throw new NotFoundError('USER_NOT_FOUND', 'Developer penanggung jawab tidak ditemukan.');
        }

        const devTier = devProfile[0].developerTier as 'VERIFIED' | 'ELITE';
        const maxCapacity = getDeveloperMaxCapacity(devTier);

        const activeOrders = await tx
          .select({ count: count() })
          .from(orders)
          .where(and(eq(orders.developerProfileId, devId), eq(orders.status, 'IN_PROGRESS')));

        const activeCount = Number(activeOrders[0]?.count || 0);
        if (activeCount >= maxCapacity) {
          throw new CapacityExceededError(
            `Developer ${devTier} saat ini sudah mencapai kapasitas maksimum (${activeCount}/${maxCapacity} proyek aktif).`
          );
        }

        const [feeSetting] = await tx
          .select()
          .from(platformFeeSettings)
          .orderBy(desc(platformFeeSettings.effectiveFrom))
          .limit(1);

        const platformFeePercentage = feeSetting ? feeSetting.feePercentage : '0.1000';

        const orderNumber = generateOrderNumber();
        const basePrice = data.customAgreedPrice ? data.customAgreedPrice.toString() : s.basePrice;
        const baseCurrency = data.customAgreedCurrency ? data.customAgreedCurrency.toUpperCase() : s.baseCurrency;
        const feeAmount = (parseFloat(basePrice) * parseFloat(platformFeePercentage)).toFixed(2);

        const targetDeliveryDate = new Date();
        targetDeliveryDate.setDate(targetDeliveryDate.getDate() + s.estimatedDeliveryDays);

        const [order] = await tx
          .insert(orders)
          .values({
            orderNumber,
            clientProfileId,
            developerProfileId: devId,
            serviceId: s.id,
            status: 'PENDING_REVIEW',
            titleSnapshot: s.title,
            descriptionSnapshot: s.description,
            budgetAmountSnapshot: basePrice,
            currencySnapshot: baseCurrency,
            exchangeRateSnapshot: '1.000000',
            platformFeeRateSnapshot: platformFeePercentage,
            platformFeeAmountSnapshot: feeAmount,
            deadlineDays: s.estimatedDeliveryDays,
            targetDeliveryDate,
          })
          .returning();

        const [orderItem] = await tx
          .insert(orderItems)
          .values({
            orderId: order.id,
            serviceId: s.id,
            title: s.title,
            unitPriceSnapshot: basePrice,
            quantity: 1,
            scopeDescription: data.customScopeDescription || null,
          })
          .returning();

        const [project] = await tx
          .insert(projects)
          .values({
            orderId: order.id,
            developerProfileId: devId,
            clientProfileId,
            status: 'NOT_STARTED',
            progressPercentage: 0,
          })
          .returning();

        const defaultMilestones = [
          { percentage: 25, title: 'DP & Setup Arsitektur Modul' },
          { percentage: 50, title: 'Fitur Utama & Integrasi' },
          { percentage: 75, title: 'Testing & Refactor Script' },
          { percentage: 100, title: 'Final Handover & Dokumentasi' },
        ];

        for (const m of defaultMilestones) {
          await tx.insert(projectMilestones).values({
            projectId: project.id,
            percentage: m.percentage,
            title: m.title,
            status: 'PENDING',
          });
        }

        await tx.insert(orderEvents).values({
          orderId: order.id,
          actorUserId: userId,
          eventType: 'ORDER_CREATED',
          metadataJson: { message: 'Pesanan baru dibuat oleh client' },
        });

        // Trigger notification to Developer
        await createNotification(
          devProfile[0].userId,
          'ORDER_RECEIVED',
          'Pesanan Baru Diterima',
          `Anda menerima pesanan baru (${orderNumber}). Silakan periksa inbox pesanan Anda.`
        );

        return { order, orderItem, project };
      });
    },
    async () => {
      const s = mockData.services.find((serv) => serv.id === data.serviceId);
      if (!s) throw new NotFoundError('SERVICE_NOT_FOUND', 'Jasa / Layanan yang dipilih tidak ditemukan.');

      const devId = s.developerProfileId;
      const devProfile = mockData.developerProfiles.find((d) => d.id === devId);
      if (!devProfile) throw new NotFoundError('USER_NOT_FOUND', 'Developer penanggung jawab tidak ditemukan.');

      const devTier = devProfile.developerTier as 'VERIFIED' | 'ELITE';
      const maxCapacity = getDeveloperMaxCapacity(devTier);

      const activeCount = mockData.orders.filter(
        (o) => o.developerProfileId === devId && o.status === 'IN_PROGRESS'
      ).length;

      if (activeCount >= maxCapacity) {
        throw new CapacityExceededError(
          `Developer ${devTier} saat ini sudah mencapai kapasitas maksimum (${activeCount}/${maxCapacity} proyek aktif).`
        );
      }

      const orderNumber = generateOrderNumber();
      const basePrice = data.customAgreedPrice ? data.customAgreedPrice.toString() : s.basePrice;
      const baseCurrency = data.customAgreedCurrency ? data.customAgreedCurrency.toUpperCase() : s.baseCurrency;

      const orderId = `a0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`;
      const targetDeliveryDate = new Date();
      targetDeliveryDate.setDate(targetDeliveryDate.getDate() + s.estimatedDeliveryDays);

      const order: any = {
        id: orderId,
        orderNumber,
        clientProfileId,
        developerProfileId: devId,
        serviceId: s.id,
        status: 'PENDING_REVIEW',
        titleSnapshot: s.title,
        descriptionSnapshot: s.description,
        budgetAmountSnapshot: basePrice,
        currencySnapshot: baseCurrency,
        exchangeRateSnapshot: '1.000000',
        platformFeeRateSnapshot: '0.1000',
        platformFeeAmountSnapshot: (parseFloat(basePrice) * 0.1).toFixed(2),
        deadlineDays: s.estimatedDeliveryDays,
        targetDeliveryDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockData.orders.push(order);

      const orderItem: any = {
        id: `b0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        orderId: order.id,
        serviceId: s.id,
        title: s.title,
        unitPriceSnapshot: basePrice,
        quantity: 1,
        scopeDescription: data.customScopeDescription || null,
      };
      mockData.orderItems.push(orderItem);

      const projectId = `c0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`;
      const project: any = {
        id: projectId,
        orderId: order.id,
        developerProfileId: devId,
        clientProfileId,
        progressPercentage: 0,
        status: 'NOT_STARTED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockData.projects.push(project);

      const defaultMilestones = [
        { percentage: 25, title: 'DP & Setup Arsitektur Modul' },
        { percentage: 50, title: 'Fitur Utama & Integrasi' },
        { percentage: 75, title: 'Testing & Refactor Script' },
        { percentage: 100, title: 'Final Handover & Dokumentasi' },
      ];

      for (const m of defaultMilestones) {
        mockData.projectMilestones.push({
          id: `d0000000-0000-0000-000${m.percentage}-${Date.now().toString().slice(-12)}`,
          projectId: project.id,
          percentage: m.percentage,
          title: m.title,
          status: 'PENDING',
        });
      }

      mockData.orderEvents.push({
        id: `e0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        orderId: order.id,
        actorUserId: userId,
        fromStatus: null,
        toStatus: 'PENDING_REVIEW',
        eventReason: 'Pesanan baru dibuat oleh client',
        createdAt: new Date(),
      });

      // Send notification to developer in mock
      await createNotification(
        devProfile.userId,
        'ORDER_RECEIVED',
        'Pesanan Baru Diterima',
        `Anda menerima pesanan baru (${orderNumber}). Silakan periksa inbox pesanan Anda.`
      );

      return { order, orderItem, project };
    }
  );
}

export async function acceptOrder(orderNumber: string, developerUserId: string, developerProfileId: string) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const [order] = await tx.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
        if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');
        if (order.developerProfileId !== developerProfileId) {
          throw new ForbiddenError('Anda tidak berhak memproses pesanan ini.');
        }

        const [updatedOrder] = await tx
          .update(orders)
          .set({ status: 'IN_PROGRESS', updatedAt: new Date() })
          .where(eq(orders.id, order.id))
          .returning();

        const [project] = await tx
          .select()
          .from(projects)
          .where(eq(projects.orderId, order.id))
          .limit(1);

        if (project) {
          await tx
            .update(projects)
            .set({ status: 'IN_PROGRESS', startedAt: new Date(), updatedAt: new Date() })
            .where(eq(projects.id, project.id));
        }

        await tx.insert(orderEvents).values({
          orderId: order.id,
          actorUserId: developerUserId,
          eventType: 'ORDER_ACCEPTED',
          metadataJson: { message: 'Pesanan diterima oleh developer' },
        });

        // Send notification to Client
        const [client] = await tx.select().from(clientProfiles).where(eq(clientProfiles.id, order.clientProfileId!)).limit(1);
        if (client) {
          await createNotification(
            client.userId,
            'ORDER_ACCEPTED',
            'Pesanan Diterima Developer',
            `Pesanan (${orderNumber}) telah diterima oleh Developer. Proyek telah resmi dimulai!`
          );
        }

        return updatedOrder;
      });
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');
      if (order.developerProfileId !== developerProfileId) {
        throw new ForbiddenError('Anda tidak berhak memproses pesanan ini.');
      }

      order.status = 'IN_PROGRESS';
      order.updatedAt = new Date();

      const project = mockData.projects.find((p) => p.orderId === order.id);
      if (project) {
        project.status = 'IN_PROGRESS';
        project.startedAt = new Date();
        project.updatedAt = new Date();
      }

      mockData.orderEvents.push({
        id: `e0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        orderId: order.id,
        actorUserId: developerUserId,
        fromStatus: 'PENDING_REVIEW',
        toStatus: 'IN_PROGRESS',
        eventReason: 'Pesanan diterima oleh developer',
        createdAt: new Date(),
      });

      const client = mockData.clientProfiles.find((c) => c.id === order.clientProfileId);
      if (client) {
        await createNotification(
          client.userId,
          'ORDER_ACCEPTED',
          'Pesanan Diterima Developer',
          `Pesanan (${orderNumber}) telah diterima oleh Developer. Proyek telah resmi dimulai!`
        );
      }

      return order;
    }
  );
}

export async function rejectOrder(orderNumber: string, developerUserId: string, developerProfileId: string, reason?: string) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const [order] = await tx.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
        if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');
        if (order.developerProfileId !== developerProfileId) {
          throw new ForbiddenError('Anda tidak berhak memproses pesanan ini.');
        }

        const [updatedOrder] = await tx
          .update(orders)
          .set({ status: 'CANCELLED', updatedAt: new Date() })
          .where(eq(orders.id, order.id))
          .returning();

        await tx.insert(orderEvents).values({
          orderId: order.id,
          actorUserId: developerUserId,
          eventType: 'ORDER_REJECTED',
          metadataJson: { message: reason || 'Pesanan ditolak oleh developer' },
        });

        // Send notification to Client
        const [client] = await tx.select().from(clientProfiles).where(eq(clientProfiles.id, order.clientProfileId!)).limit(1);
        if (client) {
          await createNotification(
            client.userId,
            'ORDER_REJECTED',
            'Pesanan Ditolak Developer',
            `Pesanan (${orderNumber}) ditolak oleh Developer${reason ? ': ' + reason : '.'}`
          );
        }

        return updatedOrder;
      });
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');
      if (order.developerProfileId !== developerProfileId) {
        throw new ForbiddenError('Anda tidak berhak memproses pesanan ini.');
      }

      order.status = 'CANCELLED';
      order.updatedAt = new Date();

      mockData.orderEvents.push({
        id: `e0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        orderId: order.id,
        actorUserId: developerUserId,
        fromStatus: 'PENDING_REVIEW',
        toStatus: 'CANCELLED',
        eventReason: reason || 'Pesanan ditolak oleh developer',
        createdAt: new Date(),
      });

      const client = mockData.clientProfiles.find((c) => c.id === order.clientProfileId);
      if (client) {
        await createNotification(
          client.userId,
          'ORDER_REJECTED',
          'Pesanan Ditolak Developer',
          `Pesanan (${orderNumber}) ditolak oleh Developer${reason ? ': ' + reason : '.'}`
        );
      }

      return order;
    }
  );
}


export async function listOrders(params: {
  page: number;
  limit: number;
  offset: number;
  clientProfileId?: string;
  developerProfileId?: string;
  status?: string;
  isAdmin?: boolean;
}) {
  return safeDbExecute(
    async () => {
      let conditions: any[] = [];
      if (params.clientProfileId) conditions.push(eq(orders.clientProfileId, params.clientProfileId));
      if (params.developerProfileId) conditions.push(eq(orders.developerProfileId, params.developerProfileId));
      if (params.status) conditions.push(eq(orders.status, params.status as any));

      const rows = await db
        .select()
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(orders.createdAt))
        .limit(params.limit)
        .offset(params.offset);

      const [totalRow] = await db
        .select({ count: count() })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = Number(totalRow?.count || 0);

      return {
        data: rows,
        meta: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit) || 1,
        },
      };
    },
    async () => {
      let filtered = [...mockData.orders];
      if (params.clientProfileId) filtered = filtered.filter((o) => o.clientProfileId === params.clientProfileId);
      if (params.developerProfileId) filtered = filtered.filter((o) => o.developerProfileId === params.developerProfileId);
      if (params.status) filtered = filtered.filter((o) => o.status === params.status);

      const total = filtered.length;
      const sliced = filtered.slice(params.offset, params.offset + params.limit);

      return {
        data: sliced,
        meta: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit) || 1,
        },
      };
    }
  );
}

export async function getOrderByNumber(orderNumber: string, user: any) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      const projectRows = await db.select().from(projects).where(eq(projects.orderId, order.id)).limit(1);

      let milestones: any[] = [];
      if (projectRows.length > 0) {
        milestones = await db.select().from(projectMilestones).where(eq(projectMilestones.projectId, projectRows[0].id));
      }

      return {
        ...order,
        items,
        project: projectRows[0] || null,
        milestones,
      };
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const items = mockData.orderItems.filter((i) => i.orderId === order.id);
      const project = mockData.projects.find((p) => p.orderId === order.id) || null;
      const milestones = project ? mockData.projectMilestones.filter((m) => m.projectId === project.id) : [];

      return {
        ...order,
        items,
        project,
        milestones,
      };
    }
  );
}

export async function cancelOrder(orderNumber: string, userId: string, clientProfileId?: string, isAdmin = false) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      if (!isAdmin && order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan membatalkan pesanan ini.');
      }

      if (order.status !== 'WAITING_PAYMENT') {
        throw new ForbiddenError('Pesanan yang sudah dibayar tidak dapat dibatalkan langsung. Silakan buka dispute.');
      }

      const [updated] = await db
        .update(orders)
        .set({ status: 'CANCELLED', updatedAt: new Date() })
        .where(eq(orders.id, order.id))
        .returning();

      await db.insert(orderEvents).values({
        orderId: order.id,
        actorUserId: userId,
        eventType: 'ORDER_CANCELLED',
        metadataJson: { message: 'Dibatalkan oleh pengguna' },
      });

      return updated;
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      if (!isAdmin && order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan membatalkan pesanan ini.');
      }

      if (order.status !== 'WAITING_PAYMENT') {
        throw new ForbiddenError('Pesanan yang sudah dibayar tidak dapat dibatalkan langsung. Silakan buka dispute.');
      }

      order.status = 'CANCELLED';
      order.updatedAt = new Date();

      mockData.orderEvents.push({
        id: `e0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        orderId: order.id,
        actorUserId: userId,
        fromStatus: 'WAITING_PAYMENT',
        toStatus: 'CANCELLED',
        eventReason: 'Dibatalkan oleh pengguna',
        createdAt: new Date(),
      });

      return order;
    }
  );
}

export async function getOrderEvents(orderNumber: string) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      return await db.select().from(orderEvents).where(eq(orderEvents.orderId, orderRows[0].id)).orderBy(orderEvents.createdAt);
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');
      return mockData.orderEvents.filter((e) => e.orderId === order.id);
    }
  );
}
