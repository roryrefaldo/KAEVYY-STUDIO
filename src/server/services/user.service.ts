import { db } from '../../db/index.js';
import { users, userPreferences, clientProfiles, developerProfiles } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../errors/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function getUserById(userId: string) {
  return safeDbExecute(
    async () => {
      const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (userRows.length === 0) {
        throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');
      }

      const user = userRows[0];
      const clientProfile = await db.select().from(clientProfiles).where(eq(clientProfiles.userId, user.id)).limit(1);
      const developerProfile = await db.select().from(developerProfiles).where(eq(developerProfiles.userId, user.id)).limit(1);
      const preferences = await db.select().from(userPreferences).where(eq(userPreferences.userId, user.id)).limit(1);

      return {
        ...user,
        clientProfile: clientProfile[0] || null,
        developerProfile: developerProfile[0] || null,
        preferences: preferences[0] || null,
      };
    },
    async () => {
      const user = mockData.users.find((u) => u.id === userId);
      if (!user) throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');

      const clientProfile = mockData.clientProfiles.find((cp) => cp.userId === user.id) || null;
      const developerProfile = mockData.developerProfiles.find((dp) => dp.userId === user.id) || null;
      const preferences = mockData.userPreferences.find((up) => up.userId === user.id) || null;

      return {
        ...user,
        clientProfile,
        developerProfile,
        preferences,
      };
    }
  );
}

export async function updateUserProfile(userId: string, data: { displayName?: string; avatarUrl?: string }) {
  return safeDbExecute(
    async () => {
      const [updated] = await db
        .update(users)
        .set({
          ...(data.displayName ? { displayName: data.displayName } : {}),
          ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updated) {
        throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');
      }
      return updated;
    },
    async () => {
      const user = mockData.users.find((u) => u.id === userId);
      if (!user) throw new NotFoundError('USER_NOT_FOUND', 'Pengguna tidak ditemukan.');

      if (data.displayName) user.displayName = data.displayName;
      if (data.avatarUrl) user.avatarUrl = data.avatarUrl;
      user.updatedAt = new Date();

      return user;
    }
  );
}

export async function getUserPreferences(userId: string) {
  return safeDbExecute(
    async () => {
      const prefs = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
      if (prefs.length === 0) {
        return { userId, displayCurrency: 'IDR', language: 'id', timezone: 'Asia/Jakarta' };
      }
      return prefs[0];
    },
    async () => {
      const pref = mockData.userPreferences.find((p) => p.userId === userId);
      return pref || { userId, displayCurrency: 'IDR', language: 'id', timezone: 'Asia/Jakarta' };
    }
  );
}

export async function updateUserPreferences(
  userId: string,
  data: { preferredCurrency?: string; preferredLanguage?: string; themeMode?: 'LIGHT' | 'DARK' | 'SYSTEM' }
) {
  return safeDbExecute(
    async () => {
      const existing = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);

      if (existing.length === 0) {
        const [created] = await db
          .insert(userPreferences)
          .values({
            userId,
            displayCurrency: data.preferredCurrency?.toUpperCase() || 'IDR',
            language: data.preferredLanguage || 'id',
            timezone: 'Asia/Jakarta',
          })
          .returning();
        return created;
      }

      const [updated] = await db
        .update(userPreferences)
        .set({
          ...(data.preferredCurrency ? { displayCurrency: data.preferredCurrency.toUpperCase() } : {}),
          ...(data.preferredLanguage ? { language: data.preferredLanguage } : {}),
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId))
        .returning();

      return updated;
    },
    async () => {
      let pref = mockData.userPreferences.find((p) => p.userId === userId);
      if (!pref) {
        pref = {
          userId,
          displayCurrency: data.preferredCurrency?.toUpperCase() || 'IDR',
          language: data.preferredLanguage || 'id',
          timezone: 'Asia/Jakarta',
          updatedAt: new Date(),
        };
        mockData.userPreferences.push(pref);
      } else {
        if (data.preferredCurrency) pref.displayCurrency = data.preferredCurrency.toUpperCase();
        if (data.preferredLanguage) pref.language = data.preferredLanguage;
        pref.updatedAt = new Date();
      }
      return pref;
    }
  );
}
