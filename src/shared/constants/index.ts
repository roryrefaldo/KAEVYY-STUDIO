export const DEFAULT_EXCHANGE_RATE_IDR = 15500;
export const DEFAULT_CURRENCY = 'USD';

export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAYMENT_VERIFIED: 'PAYMENT_VERIFIED',
  DEVELOPER_REVIEW: 'DEVELOPER_REVIEW',
  IN_PROGRESS: 'IN_PROGRESS',
  MILESTONE_SUBMITTED: 'MILESTONE_SUBMITTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  COMPLETED: 'COMPLETED',
  IN_WARRANTY: 'IN_WARRANTY',
  CANCELLED: 'CANCELLED',
  DISPUTED: 'DISPUTED',
} as const;

export const MILESTONE_STAGES = [25, 50, 100] as const;

export const ASSET_CATEGORIES = [
  'All',
  'Roblox Studio',
  'Maps',
  'Models',
  'Scripts',
  'UI',
  'Systems',
  'Plugins',
  'Templates',
  'Tools',
  'Resources',
] as const;

export const PLATFORM_INFO = {
  name: 'KAEVY STUDIO',
  tagline: 'First-Class Roblox Developer Services & Asset Marketplace',
  warrantyDaysDefault: 30,
};
