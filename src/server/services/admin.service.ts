import { db } from '../../db/index.js';
import {
  users,
  orders,
  developerProfiles,
  developerVerificationSubmissions,
  auditLogs,
  escrowRecords
} from '../../db/schema/index.js';
import { eq, count, desc } from 'drizzle-orm';
import { NotFoundError } from '../errors/index.js';
import { getDeveloperMaxCapacity } from '../../db/utils.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function getAdminDashboardStats() {
  return safeDbExecute(
    async () => {
      const [uCount] = await db.select({ count: count() }).from(users);
      const [dCount] = await db.select({ count: count() }).from(developerProfiles);
      const [oCount] = await db.select({ count: count() }).from(orders);
      const [pendingVerifCount] = await db
        .select({ count: count() })
        .from(developerVerificationSubmissions)
        .where(eq(developerVerificationSubmissions.status, 'PENDING'));

      return {
        totalUsers: Number(uCount?.count || 0),
        totalDevelopers: Number(dCount?.count || 0),
        totalOrders: Number(oCount?.count || 0),
        pendingVerifications: Number(pendingVerifCount?.count || 0),
      };
    },
    async () => {
      return {
        totalUsers: mockData.users.length,
        totalDevelopers: mockData.developerProfiles.length,
        totalOrders: mockData.orders.length,
        pendingVerifications: mockData.developerVerificationSubmissions.filter(
          (s) => s.submissionStatus === 'PENDING'
        ).length,
      };
    }
  );
}

export async function listAuditLogs(params: { page: number; limit: number; offset: number }) {
  return safeDbExecute(
    async () => {
      const rows = await db
        .select()
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(params.limit)
        .offset(params.offset);

      const [totalRow] = await db.select({ count: count() }).from(auditLogs);
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
      const total = mockData.auditLogs.length;
      const sliced = mockData.auditLogs.slice(params.offset, params.offset + params.limit);
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

export async function approveDeveloperVerification(
  submissionId: string,
  adminUserId: string,
  tier: 'VERIFIED' | 'ELITE' = 'VERIFIED',
  notes?: string
) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const subRows = await tx
          .select()
          .from(developerVerificationSubmissions)
          .where(eq(developerVerificationSubmissions.id, submissionId))
          .limit(1);

        if (subRows.length === 0) throw new NotFoundError('USER_NOT_FOUND', 'Pengajuan verifikasi tidak ditemukan.');

        const sub = subRows[0];
        const maxCapacity = getDeveloperMaxCapacity(tier);

        const [updatedSub] = await tx
          .update(developerVerificationSubmissions)
          .set({
            status: 'VERIFIED',
            reviewedByUserId: adminUserId,
            reviewedAt: new Date(),
            submissionNotes: notes || sub.submissionNotes,
          })
          .where(eq(developerVerificationSubmissions.id, sub.id))
          .returning();

        await tx
          .update(developerProfiles)
          .set({
            verificationStatus: 'VERIFIED',
            developerTier: tier,
            activeProjectCapacity: maxCapacity,
            updatedAt: new Date(),
          })
          .where(eq(developerProfiles.id, sub.developerProfileId));

        return updatedSub;
      });
    },
    async () => {
      const sub = mockData.developerVerificationSubmissions.find((s) => s.id === submissionId);
      if (!sub) throw new NotFoundError('USER_NOT_FOUND', 'Pengajuan verifikasi tidak ditemukan.');

      (sub as any).status = 'VERIFIED';
      (sub as any).reviewedByUserId = adminUserId;
      sub.reviewedAt = new Date();
      if (notes) (sub as any).submissionNotes = notes;

      const dev = mockData.developerProfiles.find((d) => d.id === sub.developerProfileId);
      if (dev) {
        dev.verificationStatus = 'VERIFIED';
        dev.developerTier = tier;
        dev.activeProjectCapacity = getDeveloperMaxCapacity(tier);
      }

      return sub;
    }
  );
}

export async function rejectDeveloperVerification(submissionId: string, adminUserId: string, notes?: string) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const subRows = await tx
          .select()
          .from(developerVerificationSubmissions)
          .where(eq(developerVerificationSubmissions.id, submissionId))
          .limit(1);

        if (subRows.length === 0) throw new NotFoundError('USER_NOT_FOUND', 'Pengajuan verifikasi tidak ditemukan.');

        const sub = subRows[0];
        const [updatedSub] = await tx
          .update(developerVerificationSubmissions)
          .set({
            status: 'REJECTED',
            reviewedByUserId: adminUserId,
            reviewedAt: new Date(),
            rejectionReason: notes || sub.rejectionReason,
          })
          .where(eq(developerVerificationSubmissions.id, sub.id))
          .returning();

        await tx
          .update(developerProfiles)
          .set({
            verificationStatus: 'REJECTED',
            updatedAt: new Date(),
          })
          .where(eq(developerProfiles.id, sub.developerProfileId));

        return updatedSub;
      });
    },
    async () => {
      const sub = mockData.developerVerificationSubmissions.find((s) => s.id === submissionId);
      if (!sub) throw new NotFoundError('USER_NOT_FOUND', 'Pengajuan verifikasi tidak ditemukan.');

      (sub as any).status = 'REJECTED';
      (sub as any).reviewedByUserId = adminUserId;
      sub.reviewedAt = new Date();
      if (notes) (sub as any).rejectionReason = notes;

      const dev = mockData.developerProfiles.find((d) => d.id === sub.developerProfileId);
      if (dev) {
        dev.verificationStatus = 'REJECTED';
      }

      return sub;
    }
  );
}

export async function suspendUser(userId: string, adminUserId: string, reason?: string) {
  return safeDbExecute(
    async () => {
      const [updated] = await db
        .update(users)
        .set({ status: 'SUSPENDED', updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();

      if (!updated) throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');
      return updated;
    },
    async () => {
      const user = mockData.users.find((u) => u.id === userId);
      if (!user) throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');
      user.status = 'SUSPENDED';
      user.updatedAt = new Date();
      return user;
    }
  );
}

export async function activateUser(userId: string, adminUserId: string, reason?: string) {
  return safeDbExecute(
    async () => {
      const [updated] = await db
        .update(users)
        .set({ status: 'ACTIVE', updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();

      if (!updated) throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');
      return updated;
    },
    async () => {
      const user = mockData.users.find((u) => u.id === userId);
      if (!user) throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');
      user.status = 'ACTIVE';
      user.updatedAt = new Date();
      return user;
    }
  );
}
