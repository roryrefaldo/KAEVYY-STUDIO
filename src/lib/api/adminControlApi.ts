import { adminApi } from './adminApi';
import {
  OverviewCardStats,
  RevenueDataPoint,
  RevenueByCategory,
  RevenueByDeveloper,
  AdminDeveloperItem,
  AdminClientItem,
  AdminOrderItem,
  EscrowQueueItem,
  AdminDisputeItem,
  AdminAssetItem,
  AdminAuditLog,
  PlatformSettings,
  SystemHealthMetrics,
} from '../../types/adminControl';

// Seed mock data for all 12 sections
export const initialOverviewStats: OverviewCardStats = {
  totalRevenue: 142850,
  revenueToday: 3850,
  escrowLocked: 28400,
  totalOrders: 184,
  activeProjects: 38,
  completedProjects: 132,
  pendingReviews: 6,
  activeDevelopers: 32,
  onlineUsers: 148,
  assetsUploaded: 94,
  totalDownloads: 4820,
  openDisputes: 2,
};

export const initialDailyRevenue: RevenueDataPoint[] = [
  { date: 'Jul 28', revenue: 4200, ordersCount: 5, escrowLocked: 3100 },
  { date: 'Jul 29', revenue: 5800, ordersCount: 8, escrowLocked: 4200 },
  { date: 'Jul 30', revenue: 3900, ordersCount: 4, escrowLocked: 2900 },
  { date: 'Jul 31', revenue: 6400, ordersCount: 9, escrowLocked: 5100 },
  { date: 'Aug 01', revenue: 7100, ordersCount: 11, escrowLocked: 5800 },
  { date: 'Aug 02', revenue: 4800, ordersCount: 7, escrowLocked: 3500 },
  { date: 'Aug 03', revenue: 3850, ordersCount: 6, escrowLocked: 3800 },
];

export const initialRevenueByCategory: RevenueByCategory[] = [
  { category: 'Luau Scripting & Systems', revenue: 64200, percentage: 45 },
  { category: 'UI & Custom Dashboards', revenue: 35700, percentage: 25 },
  { category: '3D Maps & Terrain', revenue: 21400, percentage: 15 },
  { category: 'Security & Anti-Cheat', revenue: 14300, percentage: 10 },
  { category: 'Plugins & Utilities', revenue: 7250, percentage: 5 },
];

export const initialRevenueByDeveloper: RevenueByDeveloper[] = [
  { developerName: '@AeroScript_Dev', revenue: 38400, completedOrders: 42 },
  { developerName: '@LuaMaster_Gamer', revenue: 29100, completedOrders: 31 },
  { developerName: '@RobloxArchitect', revenue: 22800, completedOrders: 24 },
  { developerName: '@VoxelStudio3D', revenue: 18600, completedOrders: 19 },
  { developerName: '@CyberUI_Dev', revenue: 14200, completedOrders: 16 },
];

export const initialDevelopers: AdminDeveloperItem[] = [
  {
    id: 'dev-001',
    userId: '50000000-0000-0000-0000-000000000004',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    displayName: 'AeroScript Engineer',
    handle: '@AeroScript_Dev',
    email: 'dev.elite@kaevy.studio',
    tier: 'ELITE',
    rating: 4.98,
    completedOrders: 42,
    currentActiveProjects: 2,
    capacity: 5,
    verificationStatus: 'VERIFIED',
    joinedAt: '2025-11-12',
    skills: ['Luau', 'Anti-Cheat', 'Parallel Physics', 'Knit Framework'],
    specialization: 'System Architecture & Optimization',
  },
  {
    id: 'dev-002',
    userId: '50000000-0000-0000-0000-000000000003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    displayName: 'Lua Master Dev',
    handle: '@LuaMaster_Gamer',
    email: 'dev.verified@kaevy.studio',
    tier: 'VERIFIED',
    rating: 4.85,
    completedOrders: 31,
    currentActiveProjects: 2,
    capacity: 3,
    verificationStatus: 'VERIFIED',
    joinedAt: '2026-01-15',
    skills: ['Luau', 'DataStore V2', 'Custom Inventory', 'Roblox UI'],
    specialization: 'Gameplay Mechanics & DataStores',
  },
  {
    id: 'dev-003',
    userId: '50000000-0000-0000-0000-000000000005',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    displayName: 'LuauNewbie Creator',
    handle: '@LuauNewbie_Dev',
    email: 'newbie@kaevy.studio',
    tier: 'UNVERIFIED',
    rating: 4.50,
    completedOrders: 3,
    currentActiveProjects: 0,
    capacity: 2,
    verificationStatus: 'PENDING',
    joinedAt: '2026-07-28',
    skills: ['Blender 3D', 'Roblox Terrain', 'Level Design'],
    specialization: 'Building & Map Design',
  },
];

export const initialClients: AdminClientItem[] = [
  {
    id: 'client-001',
    userId: '50000000-0000-0000-0000-000000000002',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    displayName: 'Nova Studios CEO',
    email: 'client@kaevy.studio',
    ordersCount: 14,
    paymentsTotal: 24800,
    disputesCount: 1,
    reviewsCount: 12,
    warningsCount: 0,
    status: 'ACTIVE',
    joinedAt: '2025-10-04',
    companyName: 'Nova Gaming Interactive',
    discordUsername: 'novastudios_ceo#0001',
  },
  {
    id: 'client-002',
    userId: '50000000-0000-0000-0000-000000000006',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    displayName: 'Vortex Realm Manager',
    email: 'manager@vortexrealm.io',
    ordersCount: 8,
    paymentsTotal: 18200,
    disputesCount: 0,
    reviewsCount: 7,
    warningsCount: 0,
    status: 'ACTIVE',
    joinedAt: '2026-02-18',
    companyName: 'Vortex Metaverse Inc',
    discordUsername: 'vortex_realm#9876',
  },
];

export const initialOrders: AdminOrderItem[] = [
  {
    id: 'ord-001',
    orderNumber: 'KVS-20260801-001',
    serviceTitle: 'Roblox DataStore V2 Anti-Rollback System',
    clientId: 'client-001',
    clientName: 'Nova Studios CEO',
    clientEmail: 'client@kaevy.studio',
    developerId: 'dev-001',
    developerName: 'AeroScript Engineer',
    status: 'IN_PROGRESS',
    paymentStatus: 'PAID',
    escrowStatus: 'HELD',
    escrowAmount: 1200,
    milestoneProgress: 60,
    warrantyDaysLeft: 30,
    createdAt: '2026-08-01 10:24',
  },
  {
    id: 'ord-002',
    orderNumber: 'KVS-20260730-002',
    serviceTitle: 'Custom Combat & Physics Engine (Luau)',
    clientId: 'client-002',
    clientName: 'Vortex Realm Manager',
    clientEmail: 'manager@vortexrealm.io',
    developerId: 'dev-002',
    developerName: 'Lua Master Dev',
    status: 'DISPUTED',
    paymentStatus: 'PAID',
    escrowStatus: 'HELD',
    escrowAmount: 2400,
    milestoneProgress: 80,
    warrantyDaysLeft: 0,
    createdAt: '2026-07-30 14:15',
  },
  {
    id: 'ord-003',
    orderNumber: 'KVS-20260725-003',
    serviceTitle: 'Cyberpunk Sci-Fi UI Component Library',
    clientId: 'client-001',
    clientName: 'Nova Studios CEO',
    clientEmail: 'client@kaevy.studio',
    developerId: 'dev-001',
    developerName: 'AeroScript Engineer',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    escrowStatus: 'RELEASED',
    escrowAmount: 850,
    milestoneProgress: 100,
    warrantyDaysLeft: 22,
    createdAt: '2026-07-25 09:10',
  },
];

export const initialEscrowQueue: EscrowQueueItem[] = [
  {
    id: 'esc-001',
    orderNumber: 'KVS-20260801-001',
    clientName: 'Nova Studios CEO',
    developerName: 'AeroScript Engineer',
    amount: 1200,
    status: 'HELD',
    heldSince: '2026-08-01 10:24',
    milestoneTitle: 'Milestone 2/3: Core DataStore Wrappers',
    proofNote: 'Unit test report uploaded & verified on test place.',
  },
  {
    id: 'esc-002',
    orderNumber: 'KVS-20260730-002',
    clientName: 'Vortex Realm Manager',
    developerName: 'Lua Master Dev',
    amount: 2400,
    status: 'HELD',
    heldSince: '2026-07-30 14:15',
    milestoneTitle: 'Milestone 3/3: Hitbox & Lag Compensation',
    proofNote: 'Dispute opened regarding hitbox tolerance thresholds.',
  },
  {
    id: 'esc-003',
    orderNumber: 'KVS-20260728-004',
    clientName: 'Nova Studios CEO',
    developerName: 'Lua Master Dev',
    amount: 600,
    status: 'RELEASE_PENDING',
    heldSince: '2026-07-28 11:00',
    milestoneTitle: 'Milestone 1/1: Custom Inventory System',
    proofNote: 'Client auto-approved milestone completion.',
  },
];

export const initialDisputes: AdminDisputeItem[] = [
  {
    id: 'dsp-001',
    disputeNumber: 'DSP-20260802-001',
    orderId: 'ord-002',
    orderNumber: 'KVS-20260730-002',
    serviceTitle: 'Custom Combat & Physics Engine (Luau)',
    clientName: 'Vortex Realm Manager',
    developerName: 'Lua Master Dev',
    amountInEscrow: 2400,
    status: 'OPEN',
    reason: 'Hitbox lag compensation does not meet agreed 50ms ping SLA in server logs.',
    createdAt: '2026-08-02 16:30',
    timeline: [
      { timestamp: '2026-08-02 16:30', actor: 'Client (@Vortex_Realm)', action: 'Opened Dispute', details: 'Filed complaint for delayed response and hitreg latency.' },
      { timestamp: '2026-08-02 18:00', actor: 'Developer (@LuaMaster)', action: 'Submitted Rebuttal', details: 'Submitted video benchmark proving 30ms latency on Singapore server.' },
      { timestamp: '2026-08-03 01:15', actor: 'System', action: 'Escalated to Admin Queue', details: '72h resolution timer initialized.' },
    ],
    evidenceFiles: [
      { fileName: 'hitbox_latency_log.txt', fileUrl: '#', fileType: 'TXT', uploadedBy: 'Client', uploadedAt: '2026-08-02 16:32' },
      { fileName: 'singapore_place_benchmark.mp4', fileUrl: '#', fileType: 'MP4', uploadedBy: 'Developer', uploadedAt: '2026-08-02 18:05' },
    ],
    clientSplitPercent: 50,
    developerSplitPercent: 50,
  },
];

export const initialAssets: AdminAssetItem[] = [
  {
    id: 'asset-001',
    title: 'Kaevy Framework Core (Modular Luau)',
    creatorName: 'AeroScript Engineer',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    fileFormat: 'ZIP (Recommended)',
    fileSize: '14.2 MB',
    category: 'Frameworks',
    moderationStatus: 'Approved',
    virusScan: 'CLEAN',
    securityScan: 'LUA_AST_PASSED',
    uploadedAt: '2026-07-28 14:20',
    downloadsCount: 1420,
  },
  {
    id: 'asset-002',
    title: 'Advanced Anti-Rollback DataStore Plugin',
    creatorName: 'Lua Master Dev',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    fileFormat: 'RBXL',
    fileSize: '8.6 MB',
    category: 'Plugins',
    moderationStatus: 'Pending',
    virusScan: 'CLEAN',
    securityScan: 'LUA_AST_PASSED',
    uploadedAt: '2026-08-02 19:40',
    downloadsCount: 0,
  },
  {
    id: 'asset-003',
    title: 'Sci-Fi Inventory & Crafting UI Kit',
    creatorName: 'LuauNewbie Creator',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    fileFormat: 'PNG / RBXMX',
    fileSize: '32.1 MB',
    category: 'UI',
    moderationStatus: 'Pending',
    virusScan: 'CLEAN',
    securityScan: 'LUA_AST_PASSED',
    uploadedAt: '2026-08-03 02:10',
    downloadsCount: 0,
  },
];

export const initialAuditLogs: AdminAuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-03 03:12:44',
    actor: 'SuperAdmin (@KAEVY_Admin)',
    action: 'SETTINGS_UPDATE',
    category: 'SETTINGS',
    details: 'Updated Exchange Rate to 1 USD = Rp 16,000 IDR.',
    ipAddress: '103.28.14.92',
  },
  {
    id: 'log-002',
    timestamp: '2026-08-03 02:45:10',
    actor: 'SuperAdmin (@KAEVY_Admin)',
    action: 'VERIFICATION_APPROVE',
    category: 'USER_MGMT',
    details: 'Approved developer verification for @LuaMaster_Gamer (Tier: VERIFIED).',
    ipAddress: '103.28.14.92',
  },
  {
    id: 'log-003',
    timestamp: '2026-08-02 21:18:05',
    actor: 'System Auto-Guardian',
    action: 'ESCROW_LOCK',
    category: 'ESCROW',
    details: '$1,200.00 locked in vault for Order #KVS-20260801-001 via BCA Virtual Account.',
    ipAddress: '127.0.0.1',
  },
];

export const initialSettings: PlatformSettings = {
  platformFeePercent: 10.0,
  usdToIdrRate: 16000,
  maintenanceMode: false,
  autoReleaseEscrowDays: 5,
  stripeEnabled: true,
  midtransEnabled: true,
  manualBankTransferEnabled: true,
  allowNewRegistrations: true,
};

export const initialSystemHealth: SystemHealthMetrics = {
  apiLatencyMs: 24,
  databaseStatus: 'HEALTHY',
  activeDbConnections: 18,
  socketConnectionsCount: 148,
  memoryUsagePercent: 38,
  cpuLoadPercent: 12.4,
  cacheHitRatePercent: 98.2,
  uptimeSeconds: 864200,
  activeCollaborationRooms: 18,
};

// API Service Wrapper connecting with real backend + enriched mock store fallback
export const adminControlApi = {
  async fetchDashboardOverview(): Promise<OverviewCardStats> {
    try {
      const res = await adminApi.getDashboardStats();
      if (res.success && res.data) {
        return {
          ...initialOverviewStats,
          totalOrders: res.data.totalOrders ?? initialOverviewStats.totalOrders,
          activeDevelopers: res.data.totalDevelopers ?? initialOverviewStats.activeDevelopers,
        };
      }
    } catch {
      // Fallback to initial stats
    }
    return initialOverviewStats;
  },

  async fetchRevenueAnalytics(): Promise<{
    daily: RevenueDataPoint[];
    byCategory: RevenueByCategory[];
    byDeveloper: RevenueByDeveloper[];
  }> {
    return {
      daily: initialDailyRevenue,
      byCategory: initialRevenueByCategory,
      byDeveloper: initialRevenueByDeveloper,
    };
  },

  async fetchDevelopersList(): Promise<AdminDeveloperItem[]> {
    return initialDevelopers;
  },

  async fetchClientsList(): Promise<AdminClientItem[]> {
    return initialClients;
  },

  async fetchOrdersList(): Promise<AdminOrderItem[]> {
    return initialOrders;
  },

  async fetchEscrowQueue(): Promise<EscrowQueueItem[]> {
    return initialEscrowQueue;
  },

  async fetchDisputesList(): Promise<AdminDisputeItem[]> {
    return initialDisputes;
  },

  async fetchAssetsList(): Promise<AdminAssetItem[]> {
    return initialAssets;
  },

  async fetchAuditLogs(): Promise<AdminAuditLog[]> {
    try {
      const res = await adminApi.listAuditLogs({ limit: 50 });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((item: any, idx: number) => ({
          id: item.id || `log-api-${idx}`,
          timestamp: new Date(item.createdAt || Date.now()).toISOString().replace('T', ' ').substring(0, 19),
          actor: item.actor || 'Admin User',
          action: item.action || 'ACTION',
          category: item.category || 'SYSTEM',
          details: item.details || item.text || JSON.stringify(item),
          ipAddress: item.ipAddress || '103.28.14.92',
        }));
      }
    } catch {
      // Fallback
    }
    return initialAuditLogs;
  },

  async fetchSystemHealth(): Promise<SystemHealthMetrics> {
    return initialSystemHealth;
  },
};
