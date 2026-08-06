import { ServiceDTO, DeveloperDTO } from '../../types/api';

export function mapServiceDTO(raw: any): ServiceDTO {
  if (!raw) return raw;
  return {
    id: raw.id,
    developerProfileId: raw.developerProfileId || raw.developer_profile_id || '',
    categoryId: raw.categoryId || raw.category_id || null,
    title: raw.title || '',
    slug: raw.slug || '',
    description: raw.description || '',
    pricingType: raw.pricingType || raw.pricing_type || 'FIXED',
    basePrice: raw.basePrice ?? raw.base_price ?? 0,
    baseCurrency: raw.baseCurrency || raw.base_currency || 'IDR',
    minimumPrice: raw.minimumPrice ?? raw.minimum_price ?? null,
    maximumPrice: raw.maximumPrice ?? raw.maximum_price ?? null,
    estimatedDeliveryDays: raw.estimatedDeliveryDays ?? raw.estimated_delivery_days ?? 1,
    status: raw.status || 'ACTIVE',
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    categoryName: raw.categoryName || raw.category_name,
    categorySlug: raw.categorySlug || raw.category_slug,
    developerDisplayName: raw.developerDisplayName || raw.developer_display_name,
    developerTier: raw.developerTier || raw.developer_tier,
    developerAvatarUrl: raw.developerAvatarUrl || raw.developer_avatar_url,
    rating: raw.rating ?? 5.0,
    completedCount: raw.completedCount ?? raw.completed_count ?? 0,
    activeQueueCount: raw.activeQueueCount ?? raw.active_queue_count ?? 0,
    maxQueueCapacity: raw.maxQueueCapacity ?? raw.max_queue_capacity ?? 3,
    features: raw.features || [],
  };
}

export function mapDeveloperDTO(raw: any): DeveloperDTO {
  if (!raw) return raw;
  return {
    id: raw.id,
    userId: raw.userId || raw.user_id || '',
    bio: raw.bio || '',
    specialization: raw.specialization || '',
    skills: raw.skills || [],
    verificationStatus: raw.verificationStatus || raw.verification_status || 'PENDING',
    developerTier: raw.developerTier || raw.developer_tier || 'VERIFIED',
    activeProjectCapacity: raw.activeProjectCapacity ?? raw.active_project_capacity ?? 3,
    userDisplayName: raw.userDisplayName || raw.user_display_name || '',
    userEmail: raw.userEmail || raw.user_email,
    userAvatarUrl: raw.userAvatarUrl || raw.user_avatar_url,
    rating: raw.rating ?? 5.0,
    completedOrders: raw.completedOrders ?? raw.completed_orders ?? 0,
    activeQueueCount: raw.activeQueueCount ?? raw.active_queue_count ?? 0,
    maxQueueCapacity: raw.maxQueueCapacity ?? raw.max_queue_capacity ?? 3,
    portfolioItems: raw.portfolioItems || raw.portfolio_items || [],
    capacity: raw.capacity,
    services: raw.services ? raw.services.map(mapServiceDTO) : undefined,
  };
}

export function mapOrderDTO(raw: any): any {
  if (!raw) return raw;
  return {
    id: raw.id,
    orderNumber: raw.orderNumber || raw.order_number,
    serviceId: raw.serviceId || raw.service_id,
    serviceTitle: raw.serviceTitle || raw.service_title,
    clientId: raw.clientId || raw.client_id,
    clientName: raw.clientName || raw.client_name,
    clientAvatar: raw.clientAvatar || raw.client_avatar,
    developerId: raw.developerId || raw.developer_id,
    developerName: raw.developerName || raw.developer_name,
    developerAvatar: raw.developerAvatar || raw.developer_avatar,
    amount: raw.amount,
    currency: raw.currency || 'USD',
    orderStatus: raw.orderStatus || raw.status || raw.order_status,
    progressPercentage: raw.progressPercentage ?? raw.progress_percentage ?? 0,
    deadline: raw.deadline,
    checkpoints: raw.checkpoints || [],
    deliverableFile: raw.deliverableFile || raw.deliverable_file,
    createdAt: raw.createdAt || raw.created_at,
  };
}
