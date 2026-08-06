import { db } from '../../db/index.js';
import {
  developerProfiles,
  users,
  orders,
  developerVerificationSubmissions,
  escrowRecords
} from '../../db/schema/index.js';
import { eq, and, inArray, count } from 'drizzle-orm';
import { NotFoundError } from '../errors/index.js';
import { getDeveloperMaxCapacity } from '../../db/utils.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function listDevelopers(params: {
  page: number;
  limit: number;
  offset: number;
  specialization?: string;
  tier?: string;
  search?: string;
}) {
  return safeDbExecute(
    async () => {
      let conditions: any[] = [];
      if (params.specialization) conditions.push(eq(developerProfiles.specialization, params.specialization));
      if (params.tier) conditions.push(eq(developerProfiles.developerTier, params.tier as any));

      const devRows = await db
        .select({
          id: developerProfiles.id,
          userId: developerProfiles.userId,
          bio: developerProfiles.bio,
          specialization: developerProfiles.specialization,
          skills: developerProfiles.skills,
          verificationStatus: developerProfiles.verificationStatus,
          developerTier: developerProfiles.developerTier,
          activeProjectCapacity: developerProfiles.activeProjectCapacity,
          userDisplayName: users.displayName,
          userEmail: users.email,
          userAvatarUrl: users.avatarUrl,
        })
        .from(developerProfiles)
        .innerJoin(users, eq(developerProfiles.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(params.limit)
        .offset(params.offset);

      const [totalCountRow] = await db
        .select({ count: count() })
        .from(developerProfiles)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = Number(totalCountRow?.count || 0);

      const mappedDevRows = devRows.map((d) => ({
        ...d,
        userAvatarUrl: d.userAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.95,
        completedOrders: 38,
        activeQueueCount: 2,
        maxQueueCapacity: d.activeProjectCapacity || 3,
        portfolioItems: [
          { title: 'DataStore V2 Engine', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', tag: 'Luau Scripting' },
          { title: 'Custom RPG HUD UI', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', tag: 'UI / UX' },
        ],
      }));

      return {
        data: mappedDevRows,
        meta: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit) || 1,
        },
      };
    },
    async () => {
      let filtered = mockData.developerProfiles.map((dev) => {
        const u = mockData.users.find((usr) => usr.id === dev.userId);
        return {
          id: dev.id,
          userId: dev.userId,
          bio: dev.bio,
          specialization: dev.specialization,
          skills: dev.skills,
          verificationStatus: dev.verificationStatus,
          developerTier: dev.developerTier,
          activeProjectCapacity: dev.activeProjectCapacity,
          userDisplayName: u?.displayName || 'Developer',
          userEmail: u?.email || '',
          userAvatarUrl: u?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          rating: 4.95,
          completedOrders: 38,
          activeQueueCount: 2,
          maxQueueCapacity: dev.activeProjectCapacity || 3,
          portfolioItems: [
            { title: 'DataStore V2 Engine', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', tag: 'Luau Scripting' },
            { title: 'Custom RPG HUD UI', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', tag: 'UI / UX' },
          ],
        };
      });

      if (params.specialization) {
        filtered = filtered.filter((d) => d.specialization === params.specialization);
      }
      if (params.tier) {
        filtered = filtered.filter((d) => d.developerTier === params.tier);
      }

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

export async function getDeveloperById(devId: string) {
  return safeDbExecute(
    async () => {
      const rows = await db
        .select({
          id: developerProfiles.id,
          userId: developerProfiles.userId,
          bio: developerProfiles.bio,
          specialization: developerProfiles.specialization,
          skills: developerProfiles.skills,
          verificationStatus: developerProfiles.verificationStatus,
          developerTier: developerProfiles.developerTier,
          activeProjectCapacity: developerProfiles.activeProjectCapacity,
          userDisplayName: users.displayName,
          userEmail: users.email,
          userAvatarUrl: users.avatarUrl,
        })
        .from(developerProfiles)
        .innerJoin(users, eq(developerProfiles.userId, users.id))
        .where(eq(developerProfiles.id, devId))
        .limit(1);

      if (rows.length === 0) {
        throw new NotFoundError('USER_NOT_FOUND', 'Developer tidak ditemukan.');
      }

      const capacityInfo = await getDeveloperCapacity(devId);
      const dev = rows[0];
      return {
        ...dev,
        userAvatarUrl: dev.userAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.98,
        completedOrders: 42,
        activeQueueCount: capacityInfo.activeCount,
        maxQueueCapacity: capacityInfo.maxCapacity,
        portfolioItems: [
          { title: 'DataStore V2 Engine', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', tag: 'Luau Scripting' },
          { title: 'Custom RPG HUD UI', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', tag: 'UI / UX' },
        ],
        capacity: capacityInfo,
      };
    },
    async () => {
      const dev = mockData.developerProfiles.find((d) => d.id === devId);
      if (!dev) {
        throw new NotFoundError('USER_NOT_FOUND', 'Developer tidak ditemukan.');
      }
      const u = mockData.users.find((usr) => usr.id === dev.userId);
      const capacityInfo = await getDeveloperCapacity(devId);
      return {
        id: dev.id,
        userId: dev.userId,
        bio: dev.bio,
        specialization: dev.specialization,
        skills: dev.skills,
        verificationStatus: dev.verificationStatus,
        developerTier: dev.developerTier,
        activeProjectCapacity: dev.activeProjectCapacity,
        userDisplayName: u?.displayName || 'Developer',
        userEmail: u?.email || '',
        userAvatarUrl: u?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.98,
        completedOrders: 42,
        activeQueueCount: capacityInfo.activeCount,
        maxQueueCapacity: capacityInfo.maxCapacity,
        portfolioItems: [
          { title: 'DataStore V2 Engine', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', tag: 'Luau Scripting' },
          { title: 'Custom RPG HUD UI', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', tag: 'UI / UX' },
        ],
        capacity: capacityInfo,
      };
    }
  );
}

export async function getDeveloperCapacity(devId: string) {
  return safeDbExecute(
    async () => {
      const dev = await db.select().from(developerProfiles).where(eq(developerProfiles.id, devId)).limit(1);
      if (dev.length === 0) {
        throw new NotFoundError('USER_NOT_FOUND', 'Developer tidak ditemukan.');
      }

      const devTier = dev[0].developerTier as 'VERIFIED' | 'ELITE';
      const maxCapacity = getDeveloperMaxCapacity(devTier);
      const activeStatuses: any[] = ['DEVELOPER_ASSIGNED', 'IN_PROGRESS', 'REVISION'];

      const [activeCountRow] = await db
        .select({ count: count() })
        .from(orders)
        .where(and(eq(orders.developerProfileId, devId), inArray(orders.status, activeStatuses)));

      const activeCount = Number(activeCountRow?.count || 0);
      const availableCapacity = Math.max(0, maxCapacity - activeCount);
      const isFull = activeCount >= maxCapacity;

      return {
        developerProfileId: devId,
        developerTier: devTier,
        activeCount,
        maxCapacity,
        availableCapacity,
        isFull,
      };
    },
    async () => {
      const dev = mockData.developerProfiles.find((d) => d.id === devId);
      if (!dev) {
        throw new NotFoundError('USER_NOT_FOUND', 'Developer tidak ditemukan.');
      }

      const devTier = dev.developerTier as 'VERIFIED' | 'ELITE';
      const maxCapacity = getDeveloperMaxCapacity(devTier);
      const activeStatuses = ['DEVELOPER_ASSIGNED', 'IN_PROGRESS', 'REVISION'];

      const activeCount = mockData.orders.filter(
        (o) => o.developerProfileId === devId && activeStatuses.includes(o.status)
      ).length;

      const availableCapacity = Math.max(0, maxCapacity - activeCount);
      const isFull = activeCount >= maxCapacity;

      return {
        developerProfileId: devId,
        developerTier: devTier,
        activeCount,
        maxCapacity,
        availableCapacity,
        isFull,
      };
    }
  );
}

export async function updateDeveloperProfile(
  devId: string,
  data: { bio?: string; specialization?: string; skills?: string[] }
) {
  return safeDbExecute(
    async () => {
      const [updated] = await db
        .update(developerProfiles)
        .set({
          ...(data.bio !== undefined ? { bio: data.bio } : {}),
          ...(data.specialization !== undefined ? { specialization: data.specialization } : {}),
          ...(data.skills !== undefined ? { skills: data.skills } : {}),
          updatedAt: new Date(),
        })
        .where(eq(developerProfiles.id, devId))
        .returning();

      if (!updated) throw new NotFoundError('USER_NOT_FOUND', 'Developer profile tidak ditemukan.');
      return updated;
    },
    async () => {
      const dev = mockData.developerProfiles.find((d) => d.id === devId);
      if (!dev) throw new NotFoundError('USER_NOT_FOUND', 'Developer profile tidak ditemukan.');
      if (data.bio !== undefined) dev.bio = data.bio;
      if (data.specialization !== undefined) dev.specialization = data.specialization;
      if (data.skills !== undefined) dev.skills = data.skills;
      return dev;
    }
  );
}

export async function submitVerification(devId: string, portfolioUrl: string, notes?: string) {
  return safeDbExecute(
    async () => {
      const dev = await db.select().from(developerProfiles).where(eq(developerProfiles.id, devId)).limit(1);
      if (dev.length === 0) throw new NotFoundError('USER_NOT_FOUND', 'Developer profile tidak ditemukan.');

      const [submission] = await db
        .insert(developerVerificationSubmissions)
        .values({
          developerProfileId: devId,
          portfolioLinks: [portfolioUrl],
          specialization: dev[0].specialization || 'Lua / Luau Scripting',
          submissionNotes: notes || null,
          status: 'PENDING',
        })
        .returning();

      await db
        .update(developerProfiles)
        .set({ verificationStatus: 'PENDING' })
        .where(eq(developerProfiles.id, devId));

      return submission;
    },
    async () => {
      const dev = mockData.developerProfiles.find((d) => d.id === devId);
      if (!dev) throw new NotFoundError('USER_NOT_FOUND', 'Developer profile tidak ditemukan.');

      const sub = {
        id: `verif_${Date.now()}`,
        developerProfileId: devId,
        portfolioLinks: [portfolioUrl],
        specialization: dev.specialization || 'Lua / Luau Scripting',
        submissionNotes: notes || null,
        status: 'PENDING' as const,
        rejectionReason: '',
        reviewedByUserId: '',
        reviewedAt: new Date(),
        createdAt: new Date(),
      };
      mockData.developerVerificationSubmissions.push(sub as any);
      dev.verificationStatus = 'PENDING';
      return sub;
    }
  );
}

export async function getVerificationStatus(devId: string) {
  return safeDbExecute(
    async () => {
      return await db
        .select()
        .from(developerVerificationSubmissions)
        .where(eq(developerVerificationSubmissions.developerProfileId, devId))
        .orderBy(developerVerificationSubmissions.createdAt);
    },
    async () => {
      return mockData.developerVerificationSubmissions.filter((s) => s.developerProfileId === devId);
    }
  );
}

export async function getDeveloperEarnings(devId: string) {
  return safeDbExecute(
    async () => {
      const releasedEscrows = await db
        .select({
          gross: escrowRecords.grossAmount,
          fee: escrowRecords.platformFeeAmount,
          net: escrowRecords.netDeveloperAmount,
          currency: escrowRecords.currency,
          releasedAt: escrowRecords.releasedAt,
        })
        .from(escrowRecords)
        .innerJoin(orders, eq(escrowRecords.orderId, orders.id))
        .where(and(eq(orders.developerProfileId, devId), eq(escrowRecords.status, 'RELEASED')));

      let totalNetIDR = 0;
      let totalNetUSD = 0;
      for (const row of releasedEscrows) {
        if (row.currency === 'USD') totalNetUSD += parseFloat(row.net.toString());
        else totalNetIDR += parseFloat(row.net.toString());
      }
      return { totalNetIDR, totalNetUSD, transactionCount: releasedEscrows.length, history: releasedEscrows };
    },
    async () => {
      const devOrders = mockData.orders.filter((o) => o.developerProfileId === devId);
      const devOrderIds = devOrders.map((o) => o.id);
      const released = mockData.escrowRecords.filter((e) => devOrderIds.includes(e.orderId) && e.status === 'RELEASED');

      let totalNetIDR = 0;
      let totalNetUSD = 0;
      for (const row of released) {
        if (row.currency === 'USD') totalNetUSD += parseFloat(row.netDeveloperAmount.toString());
        else totalNetIDR += parseFloat(row.netDeveloperAmount.toString());
      }
      return { totalNetIDR, totalNetUSD, transactionCount: released.length, history: released };
    }
  );
}
