import { AuthService, JwtPayload } from '../services/authService';
import { getPermissionsForUser, hasRole } from '../services/roleService';
import { User, UserRole } from '../../types/auth';

/**
 * Authentication & Role Middleware Helpers for Client and API requests.
 */
export interface AuthGuardOptions {
  requiredRole?: UserRole;
  allowUnauthenticated?: boolean;
}

export function validateToken(token: string): JwtPayload | null {
  if (!token) return null;
  return AuthService.parseToken(token);
}

export function verifyUserPermissions(user: User | null, options: AuthGuardOptions = {}) {
  const { requiredRole, allowUnauthenticated = false } = options;

  if (!user) {
    return {
      allowed: allowUnauthenticated,
      reason: allowUnauthenticated ? null : 'AUTHENTICATION_REQUIRED',
    };
  }

  if (user.status === 'SUSPENDED') {
    return {
      allowed: false,
      reason: 'ACCOUNT_SUSPENDED',
    };
  }

  if (requiredRole && !hasRole(user, requiredRole)) {
    return {
      allowed: false,
      reason: 'INSUFFICIENT_PERMISSIONS',
    };
  }

  return {
    allowed: true,
    reason: null,
    permissions: getPermissionsForUser(user),
  };
}
