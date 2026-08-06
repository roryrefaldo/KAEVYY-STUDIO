import { db } from '../../db/index.js';
import {
  disputes,
  disputeEvidence,
  orders,
  orderEvents,
  escrowRecords
} from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { NotFoundError, ForbiddenError, InvalidStateTransitionError } from '../errors/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function openDisputeForOrder(orderNumber: string, user: any, reason: string) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      const existingDispute = await db.select().from(disputes).where(eq(disputes.orderId, order.id)).limit(1);
      if (existingDispute.length > 0) {
        throw new InvalidStateTransitionError('Dispute sudah pernah dibuka untuk pesanan ini.');
      }

      return await db.transaction(async (tx) => {
        const [dispute] = await tx
          .insert(disputes)
          .values({
            orderId: order.id,
            openedByUserId: user.id,
            reason,
            status: 'OPEN',
          })
          .returning();

        await tx
          .update(orders)
          .set({ status: 'DISPUTE', updatedAt: new Date() })
          .where(eq(orders.id, order.id));

        await tx.insert(orderEvents).values({
          orderId: order.id,
          actorUserId: user.id,
          eventType: 'DISPUTE_OPENED',
          metadataJson: {
            fromStatus: order.status,
            toStatus: 'DISPUTE',
            eventReason: `Sengketa / Dispute dibuka oleh pengguna. Alasan: ${reason}`,
          },
        });

        return dispute;
      });
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const existing = mockData.disputes.find((d) => d.orderId === order.id);
      if (existing) throw new InvalidStateTransitionError('Dispute sudah pernah dibuka untuk pesanan ini.');

      const dispute: any = {
        id: `disp_${Date.now()}`,
        orderId: order.id,
        openedByUserId: user.id,
        clientProfileId: (order as any).clientProfileId || '',
        developerProfileId: (order as any).developerProfileId || '',
        reason,
        status: 'OPEN' as const,
        resolutionType: null,
        refundAmount: '0.00',
        developerReleaseAmount: '0.00',
        resolvedByAdminUserId: null,
        resolvedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockData.disputes.push(dispute);

      order.status = 'DISPUTE';
      order.updatedAt = new Date();

      mockData.orderEvents.push({
        id: `evt_${Date.now()}`,
        orderId: order.id,
        actorUserId: user.id,
        fromStatus: 'IN_PROGRESS',
        toStatus: 'DISPUTED',
        eventReason: `Sengketa / Dispute dibuka oleh pengguna. Alasan: ${reason}`,
        createdAt: new Date(),
      });

      return dispute;
    }
  );
}

export async function getDisputeForOrder(orderNumber: string, user: any) {
  return safeDbExecute(
    async () => {
      const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const disputeRows = await db.select().from(disputes).where(eq(disputes.orderId, orderRows[0].id)).limit(1);
      if (disputeRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Dispute tidak ditemukan.');

      const dispute = disputeRows[0];
      const evidence = await db.select().from(disputeEvidence).where(eq(disputeEvidence.disputeId, dispute.id));

      return { dispute, evidence };
    },
    async () => {
      const order = mockData.orders.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const dispute = mockData.disputes.find((d) => d.orderId === order.id);
      if (!dispute) throw new NotFoundError('ORDER_NOT_FOUND', 'Dispute tidak ditemukan.');

      const evidence = mockData.disputeEvidence.filter((e) => e.disputeId === dispute.id);
      return { dispute, evidence };
    }
  );
}

export async function submitDisputeEvidence(
  disputeId: string,
  submitterUserId: string,
  statement: string,
  fileStorageKey?: string
) {
  return safeDbExecute(
    async () => {
      const disputeRows = await db.select().from(disputes).where(eq(disputes.id, disputeId)).limit(1);
      if (disputeRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Dispute tidak ditemukan.');

      const [evidence] = await db
        .insert(disputeEvidence)
        .values({
          disputeId,
          submittedByUserId: submitterUserId,
          statement,
          fileStorageKey: fileStorageKey || null,
        })
        .returning();

      return evidence;
    },
    async () => {
      const dispute = mockData.disputes.find((d) => d.id === disputeId);
      if (!dispute) throw new NotFoundError('ORDER_NOT_FOUND', 'Dispute tidak ditemukan.');

      const evidence = {
        id: `evid_${Date.now()}`,
        disputeId,
        submittedByUserId: submitterUserId,
        statement,
        fileStorageKey: fileStorageKey || null,
        createdAt: new Date(),
      };
      mockData.disputeEvidence.push(evidence as any);

      return evidence;
    }
  );
}

export async function resolveDisputeByAdmin(
  disputeId: string,
  adminUserId: string,
  resolutionType: 'FULL_REFUND' | 'FULL_DEVELOPER_RELEASE' | 'PARTIAL_SPLIT',
  refundAmount?: number,
  developerReleaseAmount?: number,
  justificationReason?: string
) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const disputeRows = await tx.select().from(disputes).where(eq(disputes.id, disputeId)).limit(1);
        if (disputeRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Dispute tidak ditemukan.');

        const dispute = disputeRows[0];
        const [updatedDispute] = await tx
          .update(disputes)
          .set({
            status: 'RESOLVED',
            resolutionType,
            resolvedAt: new Date(),
          })
          .where(eq(disputes.id, dispute.id))
          .returning();

        const orderRows = await tx.select().from(orders).where(eq(orders.id, dispute.orderId)).limit(1);
        if (orderRows.length > 0) {
          const ord = orderRows[0];
          const targetStatus = resolutionType === 'FULL_REFUND' ? 'REFUNDED' : 'COMPLETED';

          await tx
            .update(orders)
            .set({ status: targetStatus, updatedAt: new Date() })
            .where(eq(orders.id, ord.id));

          await tx.insert(orderEvents).values({
            orderId: ord.id,
            actorUserId: adminUserId,
            eventType: 'DISPUTE_RESOLVED',
            metadataJson: {
              fromStatus: 'DISPUTED',
              toStatus: targetStatus,
              resolutionType,
              eventReason: `Dispute diselesaikan Admin (${resolutionType}): ${justificationReason || ''}`,
            },
          });
        }

        return updatedDispute;
      });
    },
    async () => {
      const dispute = mockData.disputes.find((d) => d.id === disputeId);
      if (!dispute) throw new NotFoundError('ORDER_NOT_FOUND', 'Dispute tidak ditemukan.');

      dispute.status = 'RESOLVED';
      dispute.resolutionType = resolutionType;
      dispute.resolutionNotes = justificationReason || null;
      dispute.resolvedAt = new Date();
      dispute.updatedAt = new Date();

      const ord = mockData.orders.find((o) => o.id === dispute.orderId);
      if (ord) {
        ord.status = resolutionType === 'FULL_REFUND' ? 'REFUNDED' : 'COMPLETED';
        ord.updatedAt = new Date();

        mockData.orderEvents.push({
          id: `evt_${Date.now()}`,
          orderId: ord.id,
          actorUserId: adminUserId,
          fromStatus: 'DISPUTED',
          toStatus: ord.status,
          eventReason: `Dispute diselesaikan Admin (${resolutionType}): ${justificationReason || ''}`,
          createdAt: new Date(),
        });
      }

      return dispute;
    }
  );
}
