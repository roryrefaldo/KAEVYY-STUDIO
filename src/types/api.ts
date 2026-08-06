export interface ServiceDTO {
  id: string;
  developerProfileId: string;
  categoryId: string | null;
  title: string;
  slug: string;
  description: string;
  pricingType: 'FIXED' | 'STARTING_FROM' | 'CUSTOM_QUOTE';
  basePrice: string | number;
  baseCurrency: 'IDR' | 'USD' | string;
  minimumPrice?: string | number | null;
  maximumPrice?: string | number | null;
  estimatedDeliveryDays: number;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | string;
  createdAt: string;
  categoryName?: string;
  categorySlug?: string;
  developerDisplayName?: string;
  developerTier?: 'VERIFIED' | 'ELITE' | string;
  developerAvatarUrl?: string | null;
  rating?: number;
  completedCount?: number;
  activeQueueCount?: number;
  maxQueueCapacity?: number;
  features?: string[];
}

export interface DeveloperDTO {
  id: string;
  userId: string;
  bio: string;
  specialization: string;
  skills: string[];
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | string;
  developerTier: 'VERIFIED' | 'ELITE' | string;
  activeProjectCapacity: number;
  userDisplayName: string;
  userEmail?: string;
  userAvatarUrl?: string | null;
  rating?: number;
  completedOrders?: number;
  activeQueueCount?: number;
  maxQueueCapacity?: number;
  portfolioItems?: Array<{
    title: string;
    image: string;
    tag: string;
  }>;
  capacity?: {
    developerProfileId: string;
    developerTier: string;
    activeCount: number;
    maxCapacity: number;
    availableCapacity: number;
    isFull: boolean;
  };
  services?: ServiceDTO[];
}

export interface ApiPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ApiPaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  developerId?: string;
  status?: string;
  rating?: number;
  availability?: string;
}

export interface DeveloperQueryParams {
  page?: number;
  limit?: number;
  specialization?: string;
  tier?: string;
  search?: string;
  availability?: string;
}
