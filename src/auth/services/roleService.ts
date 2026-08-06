import { User, AuthPermissions, UserRole, UserStatus } from '../../types/auth';

/**
 * Role handling and RBAC permission evaluation utilities.
 */
export function getPermissionsForUser(user: User | null): AuthPermissions {
  if (!user) {
    return {
      canViewClientPortal: false,
      canViewDevWorkspace: false,
      canViewAdminConsole: false,
      canCreateOrder: false,
      canManageOwnOrders: false,
      canManageServices: false,
      canModerateAssets: false,
      canManageUsers: false,
      canResolveDisputes: false,
      canAccessFinancials: false,
    };
  }

  if (user.status === 'SUSPENDED') {
    return {
      canViewClientPortal: false,
      canViewDevWorkspace: false,
      canViewAdminConsole: false,
      canCreateOrder: false,
      canManageOwnOrders: false,
      canManageServices: false,
      canModerateAssets: false,
      canManageUsers: false,
      canResolveDisputes: false,
      canAccessFinancials: false,
    };
  }

  if (user.role === 'ADMIN') {
    return {
      canViewClientPortal: true,
      canViewDevWorkspace: true,
      canViewAdminConsole: true,
      canCreateOrder: true,
      canManageOwnOrders: true,
      canManageServices: true,
      canModerateAssets: true,
      canManageUsers: true,
      canResolveDisputes: true,
      canAccessFinancials: true,
    };
  }

  if (user.role === 'DEVELOPER') {
    const isDevVerified =
      user.status === 'VERIFIED' ||
      user.status === 'ELITE' ||
      user.developerProfile?.verificationStatus === 'VERIFIED';

    return {
      canViewClientPortal: true,
      canViewDevWorkspace: isDevVerified,
      canViewAdminConsole: false,
      canCreateOrder: true,
      canManageOwnOrders: true,
      canManageServices: isDevVerified,
      canModerateAssets: false,
      canManageUsers: false,
      canResolveDisputes: false,
      canAccessFinancials: false,
    };
  }

  // Default CLIENT role
  return {
    canViewClientPortal: true,
    canViewDevWorkspace: false,
    canViewAdminConsole: false,
    canCreateOrder: true,
    canManageOwnOrders: true,
    canManageServices: false,
    canModerateAssets: false,
    canManageUsers: false,
    canResolveDisputes: false,
    canAccessFinancials: false,
  };
}

export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return user.role === requiredRole;
}

export function isUserActive(user: User | null): boolean {
  if (!user) return false;
  return user.status !== 'SUSPENDED' && user.status !== 'REJECTED';
}
