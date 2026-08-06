export function serializeUser(user: any) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

export function serializeDeveloperProfile(dev: any) {
  if (!dev) return null;
  return {
    id: dev.id,
    userId: dev.userId,
    bio: dev.bio,
    specialization: dev.specialization,
    skills: dev.skills,
    verificationStatus: dev.verificationStatus,
    developerTier: dev.developerTier,
    activeProjectCapacity: dev.activeProjectCapacity,
    user: dev.user ? serializeUser(dev.user) : undefined,
  };
}

export function serializeService(service: any) {
  if (!service) return null;
  return {
    id: service.id,
    developerProfileId: service.developerProfileId,
    categoryId: service.categoryId,
    title: service.title,
    slug: service.slug,
    description: service.description,
    pricingType: service.pricingType,
    basePrice: service.basePrice,
    baseCurrency: service.baseCurrency,
    minimumPrice: service.minimumPrice,
    maximumPrice: service.maximumPrice,
    estimatedDeliveryDays: service.estimatedDeliveryDays,
    status: service.status,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    category: service.category,
    developer: service.developer ? serializeDeveloperProfile(service.developer) : undefined,
  };
}

export function serializeOrder(order: any) {
  if (!order) return null;
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    clientProfileId: order.clientProfileId,
    developerProfileId: order.developerProfileId,
    serviceId: order.serviceId,
    status: order.status,
    titleSnapshot: order.titleSnapshot,
    descriptionSnapshot: order.descriptionSnapshot,
    budgetAmountSnapshot: order.budgetAmountSnapshot,
    currencySnapshot: order.currencySnapshot,
    exchangeRateSnapshot: order.exchangeRateSnapshot,
    platformFeeRateSnapshot: order.platformFeeRateSnapshot,
    platformFeeAmountSnapshot: order.platformFeeAmountSnapshot,
    deadlineDays: order.deadlineDays,
    targetDeliveryDate: order.targetDeliveryDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items,
    project: order.project,
    escrow: order.escrow,
  };
}
