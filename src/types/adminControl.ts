export type AdminTab =
  | 'overview'
  | 'revenue'
  | 'developers'
  | 'clients'
  | 'orders'
  | 'escrow'
  | 'disputes'
  | 'assets'
  | 'audit'
  | 'notifications'
  | 'settings'
  | 'health';

export interface OverviewCardStats {
  totalRevenue: number;
  revenueToday: number;
  escrowLocked: number;
  totalOrders: number;
  activeProjects: number;
  completedProjects: number;
  pendingReviews: number;
  activeDevelopers: number;
  onlineUsers: number;
  assetsUploaded: number;
  totalDownloads: number;
  openDisputes: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  ordersCount: number;
  escrowLocked: number;
}

export interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
}

export interface RevenueByDeveloper {
  developerName: string;
  revenue: number;
  completedOrders: number;
}

export interface AdminDeveloperItem {
  id: string;
  userId: string;
  avatar: string;
  displayName: string;
  handle: string;
  email: string;
  tier: 'UNVERIFIED' | 'VERIFIED' | 'ELITE';
  rating: number;
  completedOrders: number;
  currentActiveProjects: number;
  capacity: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  joinedAt: string;
  skills: string[];
  specialization: string;
}

export interface AdminClientItem {
  id: string;
  userId: string;
  avatar: string;
  displayName: string;
  email: string;
  ordersCount: number;
  paymentsTotal: number;
  disputesCount: number;
  reviewsCount: number;
  warningsCount: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  joinedAt: string;
  companyName?: string;
  discordUsername?: string;
}

export interface AdminOrderItem {
  id: string;
  orderNumber: string;
  serviceTitle: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  developerId?: string;
  developerName?: string;
  status: 'PENDING_ACCEPTANCE' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  escrowStatus: 'HELD' | 'RELEASED' | 'REFUNDED';
  escrowAmount: number;
  milestoneProgress: number; // 0-100%
  warrantyDaysLeft: number;
  createdAt: string;
}

export interface EscrowQueueItem {
  id: string;
  orderNumber: string;
  clientName: string;
  developerName: string;
  amount: number;
  status: 'HELD' | 'RELEASE_PENDING' | 'REFUND_PENDING' | 'RELEASED' | 'REFUNDED';
  heldSince: string;
  milestoneTitle: string;
  proofNote?: string;
}

export interface AdminDisputeItem {
  id: string;
  disputeNumber: string;
  orderId: string;
  orderNumber: string;
  serviceTitle: string;
  clientName: string;
  developerName: string;
  amountInEscrow: number;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
  reason: string;
  createdAt: string;
  timeline: {
    timestamp: string;
    actor: string;
    action: string;
    details?: string;
  }[];
  evidenceFiles: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: string;
  }[];
  resolutionNotes?: string;
  clientSplitPercent?: number;
  developerSplitPercent?: number;
}

export interface AdminAssetItem {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  fileFormat: string;
  fileSize: string;
  category: string;
  moderationStatus: 'Pending' | 'Approved' | 'Rejected' | 'Hidden';
  virusScan: 'CLEAN' | 'SCANNING' | 'THREAT_DETECTED';
  securityScan: 'LUA_AST_PASSED' | 'SCANNING' | 'AST_FLAGGED';
  uploadedAt: string;
  downloadsCount: number;
  rejectionReason?: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'SECURITY' | 'ESCROW' | 'DISPUTE' | 'MODERATION' | 'USER_MGMT' | 'SETTINGS' | 'SYSTEM';
  details: string;
  ipAddress?: string;
}

export interface AdminNotificationConfig {
  type: 'BROADCAST' | 'MAINTENANCE' | 'DEVELOPER' | 'CLIENT';
  title: string;
  message: string;
  targetUserIds?: string[];
  scheduleTime?: string;
  isHighPriority?: boolean;
}

export interface PlatformSettings {
  platformFeePercent: number;
  usdToIdrRate: number;
  maintenanceMode: boolean;
  autoReleaseEscrowDays: number;
  stripeEnabled: boolean;
  midtransEnabled: boolean;
  manualBankTransferEnabled: boolean;
  allowNewRegistrations: boolean;
}

export type AdminPlatformSettings = PlatformSettings;

export interface SystemHealthMetrics {
  apiLatencyMs: number;
  databaseStatus: string;
  activeDbConnections: number;
  socketConnectionsCount: number;
  memoryUsagePercent: number;
  cpuLoadPercent: number;
  cacheHitRatePercent: number;
  uptimeSeconds: number;
  activeCollaborationRooms: number;
}
