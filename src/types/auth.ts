export type UserRole = 'PUBLIC' | 'CLIENT' | 'DEVELOPER' | 'ADMIN';

export type UserStatus = 
  | 'ACTIVE' 
  | 'PENDING_VERIFICATION' 
  | 'VERIFIED' 
  | 'ELITE' 
  | 'SUSPENDED' 
  | 'REJECTED';

export interface ClientProfile {
  discord?: string;
  whatsapp?: string;
  companyName?: string;
}

export interface DeveloperProfileData {
  specialization: string;
  skills: string[];
  portfolioUrl?: string;
  bio?: string;
  activeQueueCount: number;
  maxQueueCapacity: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'ELITE' | 'REJECTED' | 'SUSPENDED';
  submittedAt?: string;
  completedOrdersCount?: number;
  rating?: number;
}

export interface AdminProfileData {
  adminRole: 'SUPER_ADMIN' | 'MODERATOR' | 'FINANCE';
  permissions: string[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  language: 'id' | 'en';
  currency: 'IDR' | 'USD';
  createdAt: string;
  clientProfile?: ClientProfile;
  developerProfile?: DeveloperProfileData;
  adminProfile?: AdminProfileData;
}

export interface AuthPermissions {
  canViewClientPortal: boolean;
  canViewDevWorkspace: boolean;
  canViewAdminConsole: boolean;
  canCreateOrder: boolean;
  canManageOwnOrders: boolean;
  canManageServices: boolean;
  canModerateAssets: boolean;
  canManageUsers: boolean;
  canResolveDisputes: boolean;
  canAccessFinancials: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface ClientRegisterData {
  displayName: string;
  email: string;
  password?: string;
  discord?: string;
  whatsapp?: string;
}

export interface DeveloperRegisterData {
  displayName: string;
  email: string;
  password?: string;
  discord: string;
  specialization: string;
  skills: string[];
  portfolioUrl?: string;
  bio?: string;
}
