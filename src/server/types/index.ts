import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  roles: ('CLIENT' | 'DEVELOPER' | 'ADMIN')[];
  clientProfileId: string | null;
  developerProfileId: string | null;
  developerTier: 'VERIFIED' | 'ELITE' | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  requestId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
