import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { verifyAccessToken } from '../utils/auth.utils.js';
import { authRepository } from '../repositories/auth.repository.js';
import { AuthRequiredError, ForbiddenError } from '../errors/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';
import { db } from '../../db/index.js';
import { userRoles, roles, clientProfiles, developerProfiles } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { isStaticOrDevAsset } from './requestLogger.js';

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (isStaticOrDevAsset(req.path)) {
    return next();
  }

  try {
    let token: string | undefined = undefined;

    // 1. Try Bearer header or x-user-id
    const authHeader = req.headers.authorization || (req.headers['x-user-id'] as string);
    if (authHeader) {
      token = authHeader.replace(/^Bearer\s+/i, '').trim();
    }

    // 2. Try HTTP-only cookies
    if (!token && req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return next();
    }

    // 3. First check if token is valid JWT
    const jwtPayload = verifyAccessToken(token);
    let userId = jwtPayload?.userId;

    // 4. Fallback for legacy format "kaevy_token_<userId>" or direct UUID
    if (!userId) {
      if (token.startsWith('kaevy_token_')) {
        userId = token.replace('kaevy_token_', '');
      } else {
        userId = token;
      }
    }

    if (!userId) {
      return next();
    }

    // Lookup user
    const user = await authRepository.findUserById(userId);
    if (!user || user.status !== 'ACTIVE') {
      return next();
    }

    let roleCodes: ('CLIENT' | 'DEVELOPER' | 'ADMIN')[] = [];
    let clientProfileId: string | null = null;
    let developerProfileId: string | null = null;
    let developerTier: 'VERIFIED' | 'ELITE' | null = null;

    await safeDbExecute(
      async () => {
        const userRoleRows = await db
          .select({ code: roles.code })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(eq(userRoles.userId, user.id));

        roleCodes = userRoleRows.map((r) => r.code as 'CLIENT' | 'DEVELOPER' | 'ADMIN');

        const clientRows = await db
          .select({ id: clientProfiles.id })
          .from(clientProfiles)
          .where(eq(clientProfiles.userId, user.id))
          .limit(1);
        clientProfileId = clientRows.length > 0 ? clientRows[0].id : null;

        const devRows = await db
          .select({ id: developerProfiles.id, tier: developerProfiles.developerTier })
          .from(developerProfiles)
          .where(eq(developerProfiles.userId, user.id))
          .limit(1);
        developerProfileId = devRows.length > 0 ? devRows[0].id : null;
        developerTier = devRows.length > 0 ? (devRows[0].tier as 'VERIFIED' | 'ELITE') : null;
      },
      async () => {
        const uRoles = mockData.userRoles.filter((ur) => ur.userId === user.id);
        roleCodes = uRoles
          .map((ur) => {
            const r = mockData.roles.find((role) => role.id === ur.roleId);
            return r?.code as 'CLIENT' | 'DEVELOPER' | 'ADMIN';
          })
          .filter(Boolean);

        const clientProfile = mockData.clientProfiles.find((cp) => cp.userId === user.id);
        const devProfile = mockData.developerProfiles.find((dp) => dp.userId === user.id);

        clientProfileId = clientProfile ? clientProfile.id : null;
        developerProfileId = devProfile ? devProfile.id : null;
        developerTier = devProfile ? (devProfile.developerTier as 'VERIFIED' | 'ELITE') : null;
      }
    );

    req.user = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: roleCodes.length > 0 ? roleCodes : ['CLIENT'],
      clientProfileId,
      developerProfileId,
      developerTier,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    next();
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new AuthRequiredError();
  }
  next();
}

export function requireRole(...allowedRoles: ('CLIENT' | 'DEVELOPER' | 'ADMIN')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthRequiredError();
    }

    const hasRole = allowedRoles.some((role) => req.user!.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenError(`Akses ditolak. Diperlukan peran: ${allowedRoles.join(' atau ')}.`);
    }

    next();
  };
}
