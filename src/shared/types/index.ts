export * from '../../types/api';
export * from '../../types/auth';
export * from '../../types/prd';
export * from '../../features/orders/types/orderWorkspace.types';

export interface SharedUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'CLIENT' | 'DEVELOPER' | 'ADMIN';
}

export interface SharedPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
