import { pgEnum } from 'drizzle-orm/pg-core';

// 1. Authenticated User Roles
export const userRoleEnum = pgEnum('user_role_enum', ['CLIENT', 'DEVELOPER', 'ADMIN']);

// 2. User Account Statuses
export const userStatusEnum = pgEnum('user_status_enum', ['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'REJECTED']);

// 3. Developer Verification & Tier Statuses
export const devVerificationStatusEnum = pgEnum('dev_verification_status_enum', ['PENDING', 'VERIFIED', 'ELITE', 'REJECTED', 'SUSPENDED']);
export const devTierEnum = pgEnum('dev_tier_enum', ['VERIFIED', 'ELITE']);

// 4. Service Pricing & Statuses
export const pricingTypeEnum = pgEnum('pricing_type_enum', ['FIXED', 'STARTING_FROM', 'CUSTOM_QUOTE']);
export const serviceStatusEnum = pgEnum('service_status_enum', ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED']);

// 5. Order Lifecycle Statuses
export const orderStatusEnum = pgEnum('order_status_enum', [
  'PENDING_REVIEW',
  'WAITING_PAYMENT',
  'PAID',
  'DEVELOPER_ASSIGNED',
  'IN_PROGRESS',
  'SUBMITTED',
  'REVISION',
  'COMPLETED',
  'WARRANTY',
  'DISPUTE',
  'CANCELLED',
  'REFUNDED',
]);

// 6. Project & Milestone Execution Statuses
export const projectStatusEnum = pgEnum('project_status_enum', ['NOT_STARTED', 'IN_PROGRESS', 'UNDER_REVIEW', 'REVISION_REQUESTED', 'COMPLETED']);
export const milestoneStatusEnum = pgEnum('milestone_status_enum', ['PENDING', 'SUBMITTED', 'APPROVED', 'REVISION_REQUESTED']);

// 7. Payment & Escrow Protection Statuses
export const paymentStatusEnum = pgEnum('payment_status_enum', ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED']);
export const paymentMethodEnum = pgEnum('payment_method_enum', ['QRIS', 'VIRTUAL_ACCOUNT', 'E_WALLET', 'PAYPAL']);
export const escrowStatusEnum = pgEnum('escrow_status_enum', ['HELD', 'RELEASE_PENDING', 'RELEASED', 'REFUNDED', 'DISPUTED']);

// 8. Share Asset Lifecycle & Visibility
export const assetVisibilityEnum = pgEnum('asset_visibility_enum', ['PUBLIC', 'PRIVATE', 'ADMIN_ONLY']);
export const assetStatusEnum = pgEnum('asset_status_enum', ['DRAFT', 'PENDING_SCAN', 'PENDING_MODERATION', 'APPROVED', 'REJECTED', 'HIDDEN', 'REMOVED']);
export const scanStatusEnum = pgEnum('scan_status_enum', ['PENDING', 'SCANNING', 'PASSED', 'FLAGGED', 'FAILED']);

// 9. Guarantee, Warranty & Dispute Statuses
export const warrantyStatusEnum = pgEnum('warranty_status_enum', ['ACTIVE', 'CLAIMED', 'EXPIRED']);
export const warrantyTicketStatusEnum = pgEnum('warranty_ticket_status_enum', ['OPEN', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'EXPIRED']);
export const disputeStatusEnum = pgEnum('dispute_status_enum', ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED']);
export const disputeResolutionEnum = pgEnum('dispute_resolution_enum', ['FULL_REFUND', 'FULL_DEVELOPER_RELEASE', 'PARTIAL_SPLIT']);
