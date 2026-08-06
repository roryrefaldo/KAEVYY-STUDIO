import { db } from '../../db/index.js';
import {
  users,
  roles,
  userRoles,
  refreshTokens,
  userSessions,
  oauthAccounts,
  loginHistory,
  passwordResetTokens,
  emailVerificationTokens,
  clientProfiles,
  developerProfiles,
} from '../../db/schema/index.js';
import { eq, and, gt, desc } from 'drizzle-orm';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export class AuthRepository {
  async findUserByEmail(email: string) {
    const normEmail = email.toLowerCase().trim();
    return safeDbExecute(
      async () => {
        const rows = await db.select().from(users).where(eq(users.email, normEmail)).limit(1);
        return rows[0] || null;
      },
      async () => {
        const user = mockData.users.find((u) => u.email === normEmail);
        return user || null;
      }
    );
  }

  async findUserById(id: string) {
    return safeDbExecute(
      async () => {
        const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return rows[0] || null;
      },
      async () => {
        const user = mockData.users.find((u) => u.id === id);
        return user || null;
      }
    );
  }

  async createUser(data: {
    email: string;
    displayName: string;
    passwordHash?: string;
    avatarUrl?: string;
    status?: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  }) {
    const normEmail = data.email.toLowerCase().trim();
    return safeDbExecute(
      async () => {
        const [user] = await db
          .insert(users)
          .values({
            email: normEmail,
            displayName: data.displayName,
            passwordHash: data.passwordHash || null,
            avatarUrl: data.avatarUrl || null,
            status: data.status || 'ACTIVE',
          })
          .returning();
        return user;
      },
      async () => {
        const newUser = {
          id: `50000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
          email: normEmail,
          displayName: data.displayName,
          passwordHash: data.passwordHash || null,
          avatarUrl: data.avatarUrl || null,
          status: data.status || 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null as Date | null,
        };
        mockData.users.push(newUser);
        return newUser;
      }
    );
  }

  async updateUserPassword(userId: string, passwordHash: string) {
    return safeDbExecute(
      async () => {
        await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId));
      },
      async () => {
        const user = mockData.users.find((u) => u.id === userId);
        if (user) {
          (user as any).passwordHash = passwordHash;
          user.updatedAt = new Date();
        }
      }
    );
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED') {
    return safeDbExecute(
      async () => {
        await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, userId));
      },
      async () => {
        const user = mockData.users.find((u) => u.id === userId);
        if (user) {
          user.status = status;
          user.updatedAt = new Date();
        }
      }
    );
  }

  async assignUserRole(userId: string, roleCode: 'CLIENT' | 'DEVELOPER' | 'ADMIN') {
    return safeDbExecute(
      async () => {
        let roleRows = await db.select().from(roles).where(eq(roles.code, roleCode)).limit(1);
        if (roleRows.length === 0) {
          const [newRole] = await db.insert(roles).values({ code: roleCode, name: roleCode }).returning();
          roleRows = [newRole];
        }
        await db.insert(userRoles).values({
          userId,
          roleId: roleRows[0].id,
        }).onConflictDoNothing();
      },
      async () => {
        let role = mockData.roles.find((r) => r.code === roleCode);
        if (!role) {
          role = { id: `10000000-0000-0000-0000-00000000000${mockData.roles.length + 1}`, code: roleCode, name: roleCode };
          mockData.roles.push(role);
        }
        const exists = mockData.userRoles.some((ur) => ur.userId === userId && ur.roleId === role!.id);
        if (!exists) {
          mockData.userRoles.push({ userId, roleId: role.id });
        }
      }
    );
  }

  async createSession(data: {
    userId: string;
    refreshTokenId?: string;
    userAgent?: string;
    ipAddress?: string;
    deviceType?: string;
    isRememberMe?: boolean;
    expiresAt: Date;
  }) {
    return safeDbExecute(
      async () => {
        const [session] = await db
          .insert(userSessions)
          .values({
            userId: data.userId,
            refreshTokenId: data.refreshTokenId || null,
            userAgent: data.userAgent || null,
            ipAddress: data.ipAddress || null,
            deviceType: data.deviceType || 'Desktop',
            isRememberMe: data.isRememberMe || false,
            expiresAt: data.expiresAt,
          })
          .returning();
        return session;
      },
      async () => {
        const session = {
          id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          userId: data.userId,
          refreshTokenId: data.refreshTokenId || null,
          userAgent: data.userAgent || null,
          ipAddress: data.ipAddress || null,
          deviceType: data.deviceType || 'Desktop',
          isRememberMe: data.isRememberMe || false,
          lastActiveAt: new Date(),
          expiresAt: data.expiresAt,
          createdAt: new Date(),
        };
        mockData.userSessions.push(session);
        return session;
      }
    );
  }

  async getUserSessions(userId: string) {
    return safeDbExecute(
      async () => {
        return await db
          .select()
          .from(userSessions)
          .where(and(eq(userSessions.userId, userId), gt(userSessions.expiresAt, new Date())))
          .orderBy(desc(userSessions.lastActiveAt));
      },
      async () => {
        const now = new Date();
        return mockData.userSessions
          .filter((s) => s.userId === userId && new Date(s.expiresAt) > now)
          .sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
      }
    );
  }

  async revokeSession(sessionId: string, userId: string) {
    return safeDbExecute(
      async () => {
        await db.delete(userSessions).where(and(eq(userSessions.id, sessionId), eq(userSessions.userId, userId)));
      },
      async () => {
        const idx = mockData.userSessions.findIndex((s) => s.id === sessionId && s.userId === userId);
        if (idx !== -1) {
          mockData.userSessions.splice(idx, 1);
        }
      }
    );
  }

  async revokeAllUserSessions(userId: string) {
    return safeDbExecute(
      async () => {
        await db.delete(userSessions).where(eq(userSessions.userId, userId));
        await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.userId, userId));
      },
      async () => {
        mockData.userSessions = mockData.userSessions.filter((s) => s.userId !== userId);
        mockData.refreshTokens.forEach((rt) => {
          if (rt.userId === userId) rt.isRevoked = true;
        });
      }
    );
  }

  async saveRefreshToken(data: {
    userId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: Date;
  }) {
    return safeDbExecute(
      async () => {
        const [rt] = await db
          .insert(refreshTokens)
          .values({
            userId: data.userId,
            tokenHash: data.tokenHash,
            familyId: data.familyId,
            expiresAt: data.expiresAt,
          })
          .returning();
        return rt;
      },
      async () => {
        const rt = {
          id: `rt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          userId: data.userId,
          tokenHash: data.tokenHash,
          familyId: data.familyId,
          isRevoked: false,
          expiresAt: data.expiresAt,
          createdAt: new Date(),
        };
        mockData.refreshTokens.push(rt);
        return rt;
      }
    );
  }

  async findRefreshToken(tokenHash: string) {
    return safeDbExecute(
      async () => {
        const rows = await db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash)).limit(1);
        return rows[0] || null;
      },
      async () => {
        return mockData.refreshTokens.find((rt) => rt.tokenHash === tokenHash) || null;
      }
    );
  }

  async revokeTokenFamily(familyId: string) {
    return safeDbExecute(
      async () => {
        await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.familyId, familyId));
      },
      async () => {
        mockData.refreshTokens.forEach((rt) => {
          if (rt.familyId === familyId) rt.isRevoked = true;
        });
      }
    );
  }

  async recordLoginAttempt(data: {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    status: 'SUCCESS' | 'FAILED_PASSWORD' | 'ACCOUNT_LOCKED' | 'SUSPENDED';
    failureReason?: string;
  }) {
    return safeDbExecute(
      async () => {
        await db.insert(loginHistory).values({
          userId: data.userId,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          status: data.status,
          failureReason: data.failureReason || null,
        });
      },
      async () => {
        mockData.loginHistory.push({
          id: `lh_${Date.now()}`,
          userId: data.userId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          status: data.status,
          failureReason: data.failureReason,
          createdAt: new Date(),
        });
      }
    );
  }

  async savePasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
    return safeDbExecute(
      async () => {
        const [tokenRow] = await db
          .insert(passwordResetTokens)
          .values({
            userId,
            tokenHash,
            expiresAt,
          })
          .returning();
        return tokenRow;
      },
      async () => {
        const tokenRow = {
          id: `prt_${Date.now()}`,
          userId,
          tokenHash,
          isUsed: false,
          expiresAt,
          createdAt: new Date(),
        };
        mockData.passwordResetTokens.push(tokenRow);
        return tokenRow;
      }
    );
  }

  async findPasswordResetToken(tokenHash: string) {
    return safeDbExecute(
      async () => {
        const rows = await db
          .select()
          .from(passwordResetTokens)
          .where(and(eq(passwordResetTokens.tokenHash, tokenHash), eq(passwordResetTokens.isUsed, false)))
          .limit(1);
        return rows[0] || null;
      },
      async () => {
        return mockData.passwordResetTokens.find((t) => t.tokenHash === tokenHash && !t.isUsed) || null;
      }
    );
  }

  async markPasswordResetTokenUsed(tokenId: string) {
    return safeDbExecute(
      async () => {
        await db.update(passwordResetTokens).set({ isUsed: true }).where(eq(passwordResetTokens.id, tokenId));
      },
      async () => {
        const t = mockData.passwordResetTokens.find((item) => item.id === tokenId);
        if (t) t.isUsed = true;
      }
    );
  }

  async saveEmailVerificationToken(userId: string, tokenHash: string, expiresAt: Date) {
    return safeDbExecute(
      async () => {
        const [row] = await db
          .insert(emailVerificationTokens)
          .values({ userId, tokenHash, expiresAt })
          .returning();
        return row;
      },
      async () => {
        const row = {
          id: `evt_${Date.now()}`,
          userId,
          tokenHash,
          isUsed: false,
          expiresAt,
          createdAt: new Date(),
        };
        mockData.emailVerificationTokens.push(row);
        return row;
      }
    );
  }

  async findEmailVerificationToken(tokenHash: string) {
    return safeDbExecute(
      async () => {
        const rows = await db
          .select()
          .from(emailVerificationTokens)
          .where(and(eq(emailVerificationTokens.tokenHash, tokenHash), eq(emailVerificationTokens.isUsed, false)))
          .limit(1);
        return rows[0] || null;
      },
      async () => {
        return mockData.emailVerificationTokens.find((t) => t.tokenHash === tokenHash && !t.isUsed) || null;
      }
    );
  }

  async markEmailVerificationTokenUsed(tokenId: string) {
    return safeDbExecute(
      async () => {
        await db.update(emailVerificationTokens).set({ isUsed: true }).where(eq(emailVerificationTokens.id, tokenId));
      },
      async () => {
        const t = mockData.emailVerificationTokens.find((item) => item.id === tokenId);
        if (t) t.isUsed = true;
      }
    );
  }

  async findOAuthAccount(provider: string, providerAccountId: string) {
    return safeDbExecute(
      async () => {
        const rows = await db
          .select()
          .from(oauthAccounts)
          .where(and(eq(oauthAccounts.provider, provider), eq(oauthAccounts.providerAccountId, providerAccountId)))
          .limit(1);
        return rows[0] || null;
      },
      async () => {
        return (
          mockData.oauthAccounts.find(
            (o) => o.provider === provider && o.providerAccountId === providerAccountId
          ) || null
        );
      }
    );
  }

  async linkOAuthAccount(userId: string, provider: string, providerAccountId: string, providerEmail?: string) {
    return safeDbExecute(
      async () => {
        const [acc] = await db
          .insert(oauthAccounts)
          .values({
            userId,
            provider,
            providerAccountId,
            providerEmail: providerEmail || null,
          })
          .returning();
        return acc;
      },
      async () => {
        const acc = {
          id: `oauth_${Date.now()}`,
          userId,
          provider,
          providerAccountId,
          providerEmail: providerEmail || null,
          createdAt: new Date(),
        };
        mockData.oauthAccounts.push(acc);
        return acc;
      }
    );
  }
}

export const authRepository = new AuthRepository();
