import { db } from '../../db/index.js';
import {
  warranties,
  warrantyTickets,
  reviews,
  orders,
  projects
} from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { NotFoundError, ForbiddenError, ValidationError } from '../errors/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function getWarrantyForOrder(orderNumber: string, user: any) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      const warrantyRows = await db.select().from(warranties).where(eq(warranties.orderId, order.id)).limit(1);

      let tickets: any[] = [];
      if (warrantyRows.length > 0) {
        tickets = await db.select().from(warrantyTickets).where(eq(warrantyTickets.warrantyId, warrantyRows[0].id));
      }

      return {
        warranty: warrantyRows[0] || null,
        tickets,
      };
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const warranty = mockData.warranties.find((w) => w.orderId === order.id) || null;
      const tickets = warranty ? mockData.warrantyTickets.filter((t) => t.warrantyId === warranty.id) : [];

      return { warranty, tickets };
    }
  );
}

export async function createWarrantyTicket(
  orderNumber: string,
  clientProfileId: string,
  title: string,
  bugDescription: string
) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      if (order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan membuka klaim garansi untuk pesanan ini.');
      }

      const warrantyRows = await db.select().from(warranties).where(eq(warranties.orderId, order.id)).limit(1);
      if (warrantyRows.length === 0) {
        throw new ValidationError('Masa garansi belum aktif atau tidak ditemukan.');
      }

      const warranty = warrantyRows[0];
      if (new Date() > new Date(warranty.endAt)) {
        throw new ValidationError('Masa garansi 30 hari telah berakhir.');
      }

      const [ticket] = await db
        .insert(warrantyTickets)
        .values({
          warrantyId: warranty.id,
          openedByClientId: clientProfileId,
          title,
          bugDescription,
          status: 'OPEN',
        })
        .returning();

      return ticket;
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');
      if (order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan membuka klaim garansi untuk pesanan ini.');
      }

      let warranty = mockData.warranties.find((w) => w.orderId === order.id);
      if (!warranty) {
        const now = new Date();
        const warrantyEnd = new Date();
        warrantyEnd.setDate(warrantyEnd.getDate() + 30);
        warranty = {
          id: `war_${Date.now()}`,
          orderId: order.id,
          projectId: `proj_${Date.now()}`,
          startAt: now,
          endAt: warrantyEnd,
          status: 'ACTIVE',
          createdAt: now,
        };
        mockData.warranties.push(warranty);
      }

      const ticket = {
        id: `wtick_${Date.now()}`,
        warrantyId: warranty.id,
        openedByClientId: clientProfileId,
        title,
        bugDescription,
        status: 'OPEN',
        resolvedAt: null,
        createdAt: new Date(),
      };
      mockData.warrantyTickets.push(ticket);

      return ticket;
    }
  );
}

export async function updateWarrantyTicketStatus(ticketId: string, status: 'IN_PROGRESS' | 'RESOLVED' | 'UNDER_REVIEW', user: any) {
  return safeDbExecute(
    async () => {
      const [updated] = await db
        .update(warrantyTickets)
        .set({
          status,
          ...(status === 'RESOLVED' ? { resolvedAt: new Date() } : {}),
        })
        .where(eq(warrantyTickets.id, ticketId))
        .returning();

      if (!updated) throw new NotFoundError('ORDER_NOT_FOUND', 'Tiket garansi tidak ditemukan.');
      return updated;
    },
    async () => {
      const ticket = mockData.warrantyTickets.find((t) => t.id === ticketId);
      if (!ticket) throw new NotFoundError('ORDER_NOT_FOUND', 'Tiket garansi tidak ditemukan.');

      ticket.status = status;
      if (status === 'RESOLVED') ticket.resolvedAt = new Date();

      return ticket;
    }
  );
}

export async function createReviewForOrder(
  orderNumber: string,
  clientProfileId: string,
  rating: number,
  reviewText?: string
) {
  if (rating < 1 || rating > 5) {
    throw new ValidationError('Rating harus bernilai antara 1 sampai 5.');
  }

  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      if (order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan memberikan ulasan untuk pesanan ini.');
      }

      if (order.status !== 'COMPLETED') {
        throw new ValidationError('Ulasan hanya dapat diberikan setelah pesanan selesai.');
      }

      const existingReview = await db.select().from(reviews).where(eq(reviews.orderId, order.id)).limit(1);
      if (existingReview.length > 0) {
        throw new ValidationError('Ulasan untuk pesanan ini sudah pernah dibuat.');
      }

      const [rev] = await db
        .insert(reviews)
        .values({
          orderId: order.id,
          developerProfileId: order.developerProfileId,
          clientProfileId,
          rating,
          reviewText: reviewText || null,
        })
        .returning();

      return rev;
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');
      if (order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan memberikan ulasan untuk pesanan ini.');
      }

      const existing = mockData.reviews.find((r) => r.orderId === order.id);
      if (existing) throw new ValidationError('Ulasan untuk pesanan ini sudah pernah dibuat.');

      const rev = {
        id: `rev_${Date.now()}`,
        orderId: order.id,
        developerProfileId: order.developerProfileId,
        clientProfileId,
        rating,
        reviewText: reviewText || null,
        createdAt: new Date(),
      };
      mockData.reviews.push(rev);

      return rev;
    }
  );
}
