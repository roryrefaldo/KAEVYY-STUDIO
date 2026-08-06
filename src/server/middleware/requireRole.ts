import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AuthRequiredError, ForbiddenError } from '../errors/index.js';

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
