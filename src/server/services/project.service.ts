import { db } from '../../db/index.js';
import {
  projects,
  projectMilestones,
  orders,
  orderEvents,
  escrowRecords,
  warranties,
  clientProfiles,
  developerProfiles
} from '../../db/schema/index.js';
import { eq, and } from 'drizzle-orm';
import { NotFoundError, ForbiddenError } from '../errors/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';
import { createNotification } from './notification.service.js';

export async function getProjectById(projectId: string, user: any) {
  return safeDbExecute(
    async () => {
      const projectRows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
      if (projectRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Proyek tidak ditemukan.');

      const project = projectRows[0];
      const milestones = await db.select().from(projectMilestones).where(eq(projectMilestones.projectId, project.id));
      const orderRows = await db.select().from(orders).where(eq(orders.id, project.orderId)).limit(1);

      return {
        ...project,
        milestones,
        order: orderRows[0] || null,
      };
    },
    async () => {
      const project = mockData.projects.find((p) => p.id === projectId);
      if (!project) throw new NotFoundError('ORDER_NOT_FOUND', 'Proyek tidak ditemukan.');

      const milestones = mockData.projectMilestones.filter((m) => m.projectId === project.id);
      const order = mockData.orders.find((o) => o.id === project.orderId) || null;

      return {
        ...project,
        milestones,
        order,
      };
    }
  );
}

export async function submitMilestone(
  projectId: string,
  percentage: number,
  developerProfileId: string,
  actorUserId: string,
  notes?: string
) {
  return safeDbExecute(
    async () => {
      const projectRows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
      if (projectRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Proyek tidak ditemukan.');

      const project = projectRows[0];
      const orderRows = await db.select().from(orders).where(eq(orders.id, project.orderId)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      if (order.developerProfileId !== developerProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan mengubah milestone proyek ini.');
      }

      const mRows = await db
        .select()
        .from(projectMilestones)
        .where(and(eq(projectMilestones.projectId, projectId), eq(projectMilestones.percentage, percentage)))
        .limit(1);

      if (mRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', `Milestone ${percentage}% tidak ditemukan.`);

      const milestone = mRows[0];
      const [updated] = await db
        .update(projectMilestones)
        .set({
          status: 'SUBMITTED',
          submittedAt: new Date(),
          description: notes || milestone.description,
        })
        .where(eq(projectMilestones.id, milestone.id))
        .returning();

      await db
        .update(projects)
        .set({ status: 'UNDER_REVIEW', updatedAt: new Date() })
        .where(eq(projects.id, project.id));

      // Notify Client
      const [client] = await db.select().from(clientProfiles).where(eq(clientProfiles.id, order.clientProfileId!)).limit(1);
      if (client) {
        await createNotification(
          client.userId,
          'MILESTONE_SUBMITTED',
          'Milestone Disubmit',
          `Developer telah mengirimkan pengerjaan Milestone ${percentage}%. Silakan periksa dan berikan persetujuan.`
        );
      }

      return updated;
    },
    async () => {
      const project = mockData.projects.find((p) => p.id === projectId);
      if (!project) throw new NotFoundError('ORDER_NOT_FOUND', 'Proyek tidak ditemukan.');

      const order = mockData.orders.find((o) => o.id === project.orderId);
      if (!order || order.developerProfileId !== developerProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan mengubah milestone proyek ini.');
      }

      const milestone = mockData.projectMilestones.find(
        (m) => m.projectId === projectId && m.percentage === percentage
      );
      if (!milestone) throw new NotFoundError('ORDER_NOT_FOUND', `Milestone ${percentage}% tidak ditemukan.`);

      milestone.status = 'SUBMITTED';
      milestone.submittedAt = new Date();
      if (notes) milestone.description = notes;

      project.status = 'UNDER_REVIEW';
      project.updatedAt = new Date();

      const client = mockData.clientProfiles.find((c) => c.id === order.clientProfileId);
      if (client) {
        await createNotification(
          client.userId,
          'MILESTONE_SUBMITTED',
          'Milestone Disubmit',
          `Developer telah mengirimkan pengerjaan Milestone ${percentage}%. Silakan periksa dan berikan persetujuan.`
        );
      }

      return milestone;
    }
  );
}

export async function approveMilestone(
  projectId: string,
  percentage: number,
  clientProfileId: string,
  actorUserId: string
) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const projectRows = await tx.select().from(projects).where(eq(projects.id, projectId)).limit(1);
        if (projectRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Proyek tidak ditemukan.');

        const project = projectRows[0];
        const orderRows = await tx.select().from(orders).where(eq(orders.id, project.orderId)).limit(1);
        if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

        const order = orderRows[0];
        if (order.clientProfileId !== clientProfileId) {
          throw new ForbiddenError('Anda tidak diizinkan menyetujui milestone proyek ini.');
        }

        const mRows = await tx
          .select()
          .from(projectMilestones)
          .where(and(eq(projectMilestones.projectId, projectId), eq(projectMilestones.percentage, percentage)))
          .limit(1);

        if (mRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', `Milestone ${percentage}% tidak ditemukan.`);

        const milestone = mRows[0];
        const [updatedMilestone] = await tx
          .update(projectMilestones)
          .set({
            status: 'APPROVED',
            approvedAt: new Date(),
          })
          .where(eq(projectMilestones.id, milestone.id))
          .returning();

        // Update progress percentage
        await tx
          .update(projects)
          .set({ progressPercentage: percentage, updatedAt: new Date() })
          .where(eq(projects.id, project.id));

        const [dev] = await tx.select().from(developerProfiles).where(eq(developerProfiles.id, order.developerProfileId!)).limit(1);

        if (percentage < 100) {
          await tx
            .update(projects)
            .set({ status: 'IN_PROGRESS' })
            .where(eq(projects.id, project.id));

          if (dev) {
            await createNotification(
              dev.userId,
              'MILESTONE_APPROVED',
              'Milestone Disetujui',
              `Client telah menyetujui pengerjaan Milestone ${percentage}%.`
            );
          }
        } else if (percentage === 100) {
          const now = new Date();
          const warrantyEnd = new Date();
          warrantyEnd.setDate(warrantyEnd.getDate() + 30);

          await tx
            .update(projects)
            .set({ status: 'COMPLETED', completedAt: now, updatedAt: now })
            .where(eq(projects.id, project.id));

          await tx
            .update(orders)
            .set({ status: 'COMPLETED', updatedAt: now })
            .where(eq(orders.id, order.id));

          await tx
            .update(escrowRecords)
            .set({ status: 'RELEASED', releasedAt: now })
            .where(eq(escrowRecords.orderId, order.id));

          await tx.insert(warranties).values({
            orderId: order.id,
            projectId: project.id,
            startAt: now,
            endAt: warrantyEnd,
            status: 'ACTIVE',
          });

          await tx.insert(orderEvents).values({
            orderId: order.id,
            actorUserId,
            eventType: 'MILESTONE_100_APPROVED',
            metadataJson: { message: 'Milestone 100% disetujui client. Proyek selesai & escrow dirilis.' },
          });

          // Notify Developer & Client
          if (dev) {
            await createNotification(
              dev.userId,
              'PROJECT_COMPLETED',
              'Proyek Selesai',
              `Proyek (${order.orderNumber}) telah selesai secara resmi! Dana escrow telah dirilis.`
            );
          }
          const [client] = await tx.select().from(clientProfiles).where(eq(clientProfiles.id, clientProfileId)).limit(1);
          if (client) {
            await createNotification(
              client.userId,
              'PROJECT_COMPLETED',
              'Proyek Selesai',
              `Proyek (${order.orderNumber}) telah selesai secara resmi! Garansi perbaikan bug 30 hari telah aktif.`
            );
          }
        }

        return updatedMilestone;
      });
    },
    async () => {
      const project = mockData.projects.find((p) => p.id === projectId);
      if (!project) throw new NotFoundError('ORDER_NOT_FOUND', 'Proyek tidak ditemukan.');

      const order = mockData.orders.find((o) => o.id === project.orderId);
      if (!order || order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan menyetujui milestone proyek ini.');
      }

      const milestone = mockData.projectMilestones.find(
        (m) => m.projectId === projectId && m.percentage === percentage
      );
      if (!milestone) throw new NotFoundError('ORDER_NOT_FOUND', `Milestone ${percentage}% tidak ditemukan.`);

      milestone.status = 'APPROVED';
      milestone.approvedAt = new Date();

      project.progressPercentage = percentage;
      project.updatedAt = new Date();

      const dev = mockData.developerProfiles.find((d) => d.id === order.developerProfileId);

      if (percentage < 100) {
        project.status = 'IN_PROGRESS';
        if (dev) {
          await createNotification(
            dev.userId,
            'MILESTONE_APPROVED',
            'Milestone Disetujui',
            `Client telah menyetujui pengerjaan Milestone ${percentage}%.`
          );
        }
      } else if (percentage === 100) {
        const now = new Date();
        const warrantyEnd = new Date();
        warrantyEnd.setDate(warrantyEnd.getDate() + 30);

        project.status = 'COMPLETED';
        project.completedAt = now;

        order.status = 'COMPLETED';
        order.updatedAt = now;

        const escrow = mockData.escrowRecords.find((e) => e.orderId === order.id);
        if (escrow) {
          escrow.status = 'RELEASED';
          escrow.releasedAt = now;
          escrow.updatedAt = now;
        }

        mockData.warranties.push({
          id: `war_${Date.now()}`,
          orderId: order.id,
          projectId: project.id,
          startAt: now,
          endAt: warrantyEnd,
          status: 'ACTIVE',
          createdAt: now,
        });

        mockData.orderEvents.push({
          id: `evt_${Date.now()}`,
          orderId: order.id,
          actorUserId,
          fromStatus: 'IN_PROGRESS',
          toStatus: 'COMPLETED',
          eventReason: 'Milestone 100% disetujui client. Proyek selesai & escrow dirilis.',
          createdAt: now,
        });

        if (dev) {
          await createNotification(
            dev.userId,
            'PROJECT_COMPLETED',
            'Proyek Selesai',
            `Proyek (${order.orderNumber}) telah selesai secara resmi! Dana escrow telah dirilis.`
          );
        }
        const client = mockData.clientProfiles.find((c) => c.id === clientProfileId);
        if (client) {
          await createNotification(
            client.userId,
            'PROJECT_COMPLETED',
            'Proyek Selesai',
            `Proyek (${order.orderNumber}) telah selesai secara resmi! Garansi perbaikan bug 30 hari telah aktif.`
          );
        }
      }

      return milestone;
    }
  );
}

export async function requestMilestoneRevision(
  projectId: string,
  percentage: number,
  clientProfileId: string,
  actorUserId: string,
  revisionNotes: string
) {
  return safeDbExecute(
    async () => {
      const projectRows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
      if (projectRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Proyek tidak ditemukan.');

      const project = projectRows[0];
      const orderRows = await db.select().from(orders).where(eq(orders.id, project.orderId)).limit(1);
      if (orderRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan.');

      const order = orderRows[0];
      if (order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan meminta revisi pada proyek ini.');
      }

      const mRows = await db
        .select()
        .from(projectMilestones)
        .where(and(eq(projectMilestones.projectId, projectId), eq(projectMilestones.percentage, percentage)))
        .limit(1);

      if (mRows.length === 0) throw new NotFoundError('ORDER_NOT_FOUND', `Milestone ${percentage}% tidak ditemukan.`);

      const milestone = mRows[0];
      const [updatedMilestone] = await db
        .update(projectMilestones)
        .set({
          status: 'REVISION_REQUESTED',
          revisionNotes,
        })
        .where(eq(projectMilestones.id, milestone.id))
        .returning();

      await db
        .update(projects)
        .set({ status: 'REVISION_REQUESTED', updatedAt: new Date() })
        .where(eq(projects.id, project.id));

      await db
        .update(orders)
        .set({ status: 'REVISION', updatedAt: new Date() })
        .where(eq(orders.id, order.id));

      // Notify Developer
      const [dev] = await db.select().from(developerProfiles).where(eq(developerProfiles.id, order.developerProfileId!)).limit(1);
      if (dev) {
        await createNotification(
          dev.userId,
          'REVISION_REQUESTED',
          'Permintaan Revisi',
          `Client meminta revisi pada Milestone ${percentage}%: ${revisionNotes}`
        );
      }

      return updatedMilestone;
    },
    async () => {
      const project = mockData.projects.find((p) => p.id === projectId);
      if (!project) throw new NotFoundError('ORDER_NOT_FOUND', 'Proyek tidak ditemukan.');

      const order = mockData.orders.find((o) => o.id === project.orderId);
      if (!order || order.clientProfileId !== clientProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan meminta revisi pada proyek ini.');
      }

      const milestone = mockData.projectMilestones.find(
        (m) => m.projectId === projectId && m.percentage === percentage
      );
      if (!milestone) throw new NotFoundError('ORDER_NOT_FOUND', `Milestone ${percentage}% tidak ditemukan.`);

      milestone.status = 'REVISION_REQUESTED';
      milestone.notes = revisionNotes;

      project.status = 'REVISION_REQUESTED';
      project.updatedAt = new Date();

      order.status = 'REVISION';
      order.updatedAt = new Date();

      const dev = mockData.developerProfiles.find((d) => d.id === order.developerProfileId);
      if (dev) {
        await createNotification(
          dev.userId,
          'REVISION_REQUESTED',
          'Permintaan Revisi',
          `Client meminta revisi pada Milestone ${percentage}%: ${revisionNotes}`
        );
      }

      return milestone;
    }
  );
}

