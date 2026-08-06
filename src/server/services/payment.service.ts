import { db } from '../../db/index.js';
import {
  orders,
  orderItems,
  payments,
  paymentTransactions,
  escrowRecords,
  projects,
  orderEvents,
  warranties
} from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { NotFoundError, ForbiddenError, InvalidStateTransitionError } from '../errors/index.js';
import { generatePaymentReference } from '../../db/utils.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function createPaymentForOrder(orderNumber: string, methodCategory: string, user: any) {
  const allowedCategories = ['QRIS', 'VIRTUAL_ACCOUNT', 'E_WALLET', 'PAYPAL'] as const;
  const paymentMethodCategory = allowedCategories.includes(methodCategory as any)
    ? (methodCategory as 'QRIS' | 'VIRTUAL_ACCOUNT' | 'E_WALLET' | 'PAYPAL')
    : 'QRIS';

  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      if (items.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Item pesanan tidak ditemukan.');

      const grossAmount = items[0].unitPriceSnapshot;
      const paymentRef = generatePaymentReference();

      return await db.transaction(async (tx) => {
        const [payment] = await tx
          .insert(payments)
          .values({
            orderId: order.id,
            paymentMethodCategory,
            amount: grossAmount,
            currency: order.currencySnapshot,
            status: 'PENDING',
          })
          .returning();

        return { payment };
      });
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const item = mockData.orderItems.find((i) => i.orderId === order.id);
      if (!item) throw new NotFoundError('ORDER_NOT_FOUND', 'Item pesanan tidak ditemukan.');

      const paymentRef = generatePaymentReference();
      const payment: any = {
        id: `f0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        orderId: order.id,
        paymentReference: paymentRef,
        paymentMethodCategory,
        amount: item.snapshotPrice || item.unitPriceSnapshot,
        currency: item.snapshotCurrency || order.currencySnapshot,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockData.payments.push(payment);
      return { payment };
    }
  );
}

export async function markPaymentPaid(paymentId: string, providerTransactionId?: string, actorUserId?: string) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const paymentRows = await tx.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
        if (paymentRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pembayaran tidak ditemukan.');

        const pay = paymentRows[0];
        if (pay.status === 'PAID') return pay;

        const [updatedPay] = await tx
          .update(payments)
          .set({
            status: 'PAID',
            updatedAt: new Date(),
          })
          .where(eq(payments.id, pay.id))
          .returning();

        const orderRows = await tx.select().from(orders).where(eq(orders.id, pay.orderId)).limit(1);
        if (orderRows.length > 0) {
          const ord = orderRows[0];
          await tx
            .update(orders)
            .set({ status: 'DEVELOPER_ASSIGNED', updatedAt: new Date() })
            .where(eq(orders.id, ord.id));

          await tx
            .update(projects)
            .set({ status: 'IN_PROGRESS', updatedAt: new Date() })
            .where(eq(projects.orderId, ord.id));

          const gross = parseFloat(pay.amount.toString());
          const feePct = parseFloat((ord.platformFeeRateSnapshot || '0.1000').toString());
          const feeAmount = gross * feePct;
          const netDev = gross - feeAmount;

          await tx.insert(escrowRecords).values({
            orderId: ord.id,
            paymentId: pay.id,
            grossAmount: gross.toString(),
            platformFeeAmount: feeAmount.toString(),
            netDeveloperAmount: netDev.toString(),
            currency: pay.currency,
            status: 'HELD',
          });

          await tx.insert(orderEvents).values({
            orderId: ord.id,
            actorUserId: actorUserId || null,
            eventType: 'PAYMENT_CONFIRMED',
            metadataJson: { message: 'Pembayaran berhasil dikonfirmasi. Dana dikunci di Escrow.' },
          });
        }

        return updatedPay;
      });
    },
    async () => {
      const pay = mockData.payments.find((p) => p.id === paymentId);
      if (!pay) throw new NotFoundError('ORDER_NOT_FOUND', 'Pembayaran tidak ditemukan.');

      pay.status = 'PAID';
      pay.providerTransactionId = providerTransactionId || `prov_${Date.now()}`;
      pay.paidAt = new Date();
      pay.updatedAt = new Date();

      const ord = mockData.orders.find((o) => o.id === pay.orderId);
      if (ord) {
        ord.status = 'DEVELOPER_ASSIGNED';
        ord.updatedAt = new Date();

        const proj = mockData.projects.find((pr) => pr.orderId === ord.id);
        if (proj) {
          proj.status = 'IN_PROGRESS';
          proj.updatedAt = new Date();
        }

        const gross = parseFloat(pay.amount.toString());
        const rawFee = ord.platformFeeRateSnapshot || ord.snapshotPlatformFeePercentage || '0.1000';
        const feePct = parseFloat(rawFee.toString());
        const feeAmount = gross * feePct;
        const netDev = gross - feeAmount;

        const escrow = {
          id: `11000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
          orderId: ord.id,
          paymentId: pay.id,
          grossAmount: gross.toString(),
          platformFeeAmount: feeAmount.toString(),
          netDeveloperAmount: netDev.toString(),
          currency: pay.currency,
          status: 'HELD',
          heldAt: new Date(),
          createdAt: new Date(),
        };
        mockData.escrowRecords.push(escrow);

        mockData.orderEvents.push({
          id: `e0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
          orderId: ord.id,
          actorUserId: actorUserId || null,
          fromStatus: 'WAITING_PAYMENT',
          toStatus: 'DEVELOPER_ASSIGNED',
          eventReason: 'Pembayaran berhasil dikonfirmasi. Dana dikunci di Escrow.',
          createdAt: new Date(),
        });
      }

      return pay;
    }
  );
}

export async function getEscrowForOrder(orderNumber: string, user: any) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const escrow = await db.select().from(escrowRecords).where(eq(escrowRecords.orderId, orderRows[0].id)).limit(1);
      if (escrow.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Escrow record tidak ditemukan.');

      return escrow[0];
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const escrow = mockData.escrowRecords.find((e) => e.orderId === order.id);
      if (!escrow) throw new NotFoundError('ORDER_NOT_FOUND', 'Escrow record tidak ditemukan.');

      return escrow;
    }
  );
}

export async function releaseEscrowByAdmin(escrowId: string, adminUserId: string, justificationReason: string) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const escrowRows = await tx.select().from(escrowRecords).where(eq(escrowRecords.id, escrowId)).limit(1);
        if (escrowRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Escrow tidak ditemukan.');

        const escrow = escrowRows[0];
        if (escrow.status !== 'HELD') {
          throw new InvalidStateTransitionError('Escrow hanya dapat dirilis dari status HELD.');
        }

        const now = new Date();
        const warrantyEnd = new Date();
        warrantyEnd.setDate(warrantyEnd.getDate() + 30);

        const [updated] = await tx
          .update(escrowRecords)
          .set({
            status: 'RELEASED',
            releasedAt: now,
          })
          .where(eq(escrowRecords.id, escrow.id))
          .returning();

        const orderRows = await tx.select().from(orders).where(eq(orders.id, escrow.orderId)).limit(1);
        if (orderRows.length > 0) {
          const ord = orderRows[0];
          await tx
            .update(orders)
            .set({ status: 'COMPLETED', updatedAt: now })
            .where(eq(orders.id, ord.id));

          const projRows = await tx.select().from(projects).where(eq(projects.orderId, ord.id)).limit(1);
          if (projRows.length > 0) {
            const proj = projRows[0];
            await tx
              .update(projects)
              .set({ status: 'COMPLETED', completedAt: now, updatedAt: now })
              .where(eq(projects.id, proj.id));

            await tx.insert(warranties).values({
              orderId: ord.id,
              projectId: proj.id,
              startAt: now,
              endAt: warrantyEnd,
              status: 'ACTIVE',
            });
          }

          await tx.insert(orderEvents).values({
            orderId: ord.id,
            actorUserId: adminUserId,
            eventType: 'ESCROW_RELEASED',
            metadataJson: { message: `Escrow dirilis oleh Admin: ${justificationReason}` },
          });
        }

        return updated;
      });
    },
    async () => {
      const escrow = mockData.escrowRecords.find((e) => e.id === escrowId);
      if (!escrow) throw new NotFoundError('ORDER_NOT_FOUND', 'Escrow tidak ditemukan.');
      if (escrow.status !== 'HELD') throw new InvalidStateTransitionError('Escrow hanya dapat dirilis dari status HELD.');

      const now = new Date();
      escrow.status = 'RELEASED';
      escrow.releasedAt = now;

      const ord = mockData.orders.find((o) => o.id === escrow.orderId);
      if (ord) {
        ord.status = 'COMPLETED';
        ord.updatedAt = now;

        const proj = mockData.projects.find((pr) => pr.orderId === ord.id);
        if (proj) {
          proj.status = 'COMPLETED';
          proj.completedAt = now;
          proj.updatedAt = now;
        }

        const warrantyEnd = new Date();
        warrantyEnd.setDate(warrantyEnd.getDate() + 30);
        mockData.warranties.push({
          id: `12000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
          orderId: ord.id,
          projectId: proj ? proj.id : `proj_${Date.now()}`,
          startAt: now,
          endAt: warrantyEnd,
          status: 'ACTIVE',
          createdAt: now,
        });

        mockData.orderEvents.push({
          id: `e0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
          orderId: ord.id,
          actorUserId: adminUserId,
          fromStatus: 'IN_PROGRESS',
          toStatus: 'COMPLETED',
          eventReason: `Escrow dirilis oleh Admin: ${justificationReason}`,
          createdAt: now,
        });
      }

      return escrow;
    }
  );
}

export async function refundEscrowByAdmin(escrowId: string, adminUserId: string, justificationReason: string) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const escrowRows = await tx.select().from(escrowRecords).where(eq(escrowRecords.id, escrowId)).limit(1);
        if (escrowRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Escrow tidak ditemukan.');

        const escrow = escrowRows[0];
        if (escrow.status !== 'HELD') {
          throw new InvalidStateTransitionError('Escrow hanya dapat direfund dari status HELD.');
        }

        const now = new Date();
        const [updated] = await tx
          .update(escrowRecords)
          .set({
            status: 'REFUNDED',
            refundedAt: now,
          })
          .where(eq(escrowRecords.id, escrow.id))
          .returning();

        const orderRows = await tx.select().from(orders).where(eq(orders.id, escrow.orderId)).limit(1);
        if (orderRows.length > 0) {
          const ord = orderRows[0];
          await tx
            .update(orders)
            .set({ status: 'REFUNDED', updatedAt: now })
            .where(eq(orders.id, ord.id));

          await tx.insert(orderEvents).values({
            orderId: ord.id,
            actorUserId: adminUserId,
            eventType: 'ESCROW_REFUNDED',
            metadataJson: { message: `Escrow direfund oleh Admin: ${justificationReason}` },
          });
        }

        return updated;
      });
    },
    async () => {
      const escrow = mockData.escrowRecords.find((e) => e.id === escrowId);
      if (!escrow) throw new NotFoundError('ORDER_NOT_FOUND', 'Escrow tidak ditemukan.');
      if (escrow.status !== 'HELD') throw new InvalidStateTransitionError('Escrow hanya dapat direfund dari status HELD.');

      const now = new Date();
      escrow.status = 'REFUNDED';
      escrow.refundedAt = now;

      const ord = mockData.orders.find((o) => o.id === escrow.orderId);
      if (ord) {
        ord.status = 'REFUNDED';
        ord.updatedAt = now;

        mockData.orderEvents.push({
          id: `e0000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
          orderId: ord.id,
          actorUserId: adminUserId,
          fromStatus: 'IN_PROGRESS',
          toStatus: 'REFUNDED',
          eventReason: `Escrow direfund oleh Admin: ${justificationReason}`,
          createdAt: now,
        });
      }

      return escrow;
    }
  );
}
