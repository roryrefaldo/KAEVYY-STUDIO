export type WorkspaceRole = 'CLIENT' | 'DEVELOPER';

export type OrderWorkspaceStatus = 
  | 'PENDING_PAYMENT'
  | 'PAYMENT_VERIFIED'
  | 'DEVELOPER_REVIEW'
  | 'IN_PROGRESS'
  | 'MILESTONE_SUBMITTED'
  | 'REVISION_REQUESTED'
  | 'COMPLETED'
  | 'IN_WARRANTY'
  | 'CANCELLED'
  | 'DISPUTED';

export type MilestoneStage = 25 | 50 | 100;

export interface OrderMilestoneItem {
  id: string;
  orderNumber: string;
  stage: MilestoneStage;
  title: string;
  percentage: number;
  amountUSD: number;
  amountIDR: number;
  status: 'LOCKED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUESTED';
  deliverableNotes?: string;
  deliverableUrl?: string;
  revisionNotes?: string;
  submittedAt?: string;
  approvedAt?: string;
}

export interface EscrowVaultRecord {
  id: string;
  orderNumber: string;
  totalAmountUSD: number;
  totalAmountIDR: number;
  releasedAmountUSD: number;
  releasedAmountIDR: number;
  heldAmountUSD: number;
  heldAmountIDR: number;
  status: 'HELD_IN_ESCROW' | 'PARTIALLY_RELEASED' | 'FULLY_RELEASED' | 'REFUNDED';
  lastUpdated: string;
}

export interface WarrantyClaimRecord {
  id: string;
  orderNumber: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'CLAIM_SUBMITTED' | 'UNDER_REVIEW' | 'FIX_IN_PROGRESS' | 'RESOLVED' | 'EXPIRED';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  reportedIssuesCount: number;
}

export interface OrderWorkspaceNotification {
  id: string;
  orderNumber: string;
  type: 'ORDER_UPDATE' | 'MILESTONE_SUBMITTED' | 'ESCROW_RELEASED' | 'PAYMENT_RECEIVED' | 'WARRANTY_ALERT' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ClientWorkspaceSummary {
  activeOrdersCount: number;
  totalSpentUSD: number;
  pendingApprovalsCount: number;
  activeWarrantyCount: number;
}

export interface DeveloperWorkspaceSummary {
  activeProjectsCount: number;
  totalEarningsUSD: number;
  pendingMilestonesCount: number;
  queueCapacityUsed: number;
  maxQueueCapacity: number;
}
