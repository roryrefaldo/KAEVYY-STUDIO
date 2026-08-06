import React, { useState, useEffect } from 'react';
import { WorkspaceMode } from '../layouts/Header';
import { useLanguage } from '../i18n/LanguageContext';
import { adminControlApi } from '../lib/api/adminControlApi';
import {
  AdminTab,
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
} from '../types/adminControl';

import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { CommandPaletteModal } from '../components/admin/CommandPaletteModal';
import {
  AdminJustificationModal,
  SensitiveActionPayload,
} from '../components/admin/AdminJustificationModal';
import { AdminToast, ToastMessage } from '../components/admin/AdminToast';

import { SectionOverview } from '../components/admin/sections/SectionOverview';
import { SectionRevenue } from '../components/admin/sections/SectionRevenue';
import { SectionDevelopers } from '../components/admin/sections/SectionDevelopers';
import { SectionClients } from '../components/admin/sections/SectionClients';
import { SectionOrders } from '../components/admin/sections/SectionOrders';
import { SectionEscrow } from '../components/admin/sections/SectionEscrow';
import { SectionDisputes } from '../components/admin/sections/SectionDisputes';
import { SectionAssets } from '../components/admin/sections/SectionAssets';
import { SectionAudit } from '../components/admin/sections/SectionAudit';
import { SectionNotifications } from '../components/admin/sections/SectionNotifications';
import { SectionSettings } from '../components/admin/sections/SectionSettings';
import { SectionSystemHealth } from '../components/admin/sections/SectionSystemHealth';

interface AdminConsoleProps {
  onNavigate: (mode: WorkspaceMode) => void;
  onOpenOrderModal: (order: any) => void;
  onOpenAssetDetail: (assetId: string) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  onNavigate,
  onOpenOrderModal,
  onOpenAssetDetail,
}) => {
  const { formatPrice } = useLanguage();

  // Navigation & Layout State
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Data Loading & Sync States
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Domain Data State
  const [overviewStats, setOverviewStats] = useState<OverviewCardStats>({
    totalRevenue: 142850,
    revenueToday: 3450,
    escrowLocked: 28400,
    totalOrders: 184,
    activeProjects: 38,
    completedProjects: 142,
    pendingReviews: 8,
    activeDevelopers: 18,
    onlineUsers: 42,
    assetsUploaded: 24,
    totalDownloads: 1280,
    openDisputes: 2,
  });

  const [revenueDaily, setRevenueDaily] = useState<RevenueDataPoint[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<RevenueByCategory[]>([]);
  const [revenueByDeveloper, setRevenueByDeveloper] = useState<RevenueByDeveloper[]>([]);
  const [developers, setDevelopers] = useState<AdminDeveloperItem[]>([]);
  const [clients, setClients] = useState<AdminClientItem[]>([]);
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [escrowQueue, setEscrowQueue] = useState<EscrowQueueItem[]>([]);
  const [disputes, setDisputes] = useState<AdminDisputeItem[]>([]);
  const [assets, setAssets] = useState<AdminAssetItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>({
    platformFeePercent: 10,
    usdToIdrRate: 16000,
    maintenanceMode: false,
    autoReleaseEscrowDays: 5,
    stripeEnabled: true,
    midtransEnabled: true,
    manualBankTransferEnabled: true,
    allowNewRegistrations: true,
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics>({
    apiLatencyMs: 24,
    databaseStatus: 'Healthy',
    activeDbConnections: 12,
    socketConnectionsCount: 42,
    memoryUsagePercent: 38,
    cpuLoadPercent: 14,
    cacheHitRatePercent: 98.4,
    uptimeSeconds: 1428000,
    activeCollaborationRooms: 18,
  });

  // Modal & Toast States
  const [pendingAction, setPendingAction] = useState<SensitiveActionPayload | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all initial dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        revRes,
        devsRes,
        clientsRes,
        ordersRes,
        escrowRes,
        disputesRes,
        assetsRes,
        auditRes,
        healthRes,
      ] = await Promise.all([
        adminControlApi.fetchDashboardOverview(),
        adminControlApi.fetchRevenueAnalytics(),
        adminControlApi.fetchDevelopersList(),
        adminControlApi.fetchClientsList(),
        adminControlApi.fetchOrdersList(),
        adminControlApi.fetchEscrowQueue(),
        adminControlApi.fetchDisputesList(),
        adminControlApi.fetchAssetsList(),
        adminControlApi.fetchAuditLogs(),
        adminControlApi.fetchSystemHealth(),
      ]);

      setOverviewStats(statsRes);
      setRevenueDaily(revRes.daily);
      setRevenueByCategory(revRes.byCategory);
      setRevenueByDeveloper(revRes.byDeveloper);
      setDevelopers(devsRes);
      setClients(clientsRes);
      setOrders(ordersRes);
      setEscrowQueue(escrowRes);
      setDisputes(disputesRes);
      setAssets(assetsRes);
      setAuditLogs(auditRes);
      setSystemHealth(healthRes);
    } catch (err: any) {
      addToast('error', 'API Sync Warning', 'Using fallback operational metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handleManualSync = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    addToast('success', 'Data Synchronized', 'Latest operational metrics fetched from backend API.');
  };

  // Badges calculation
  const pendingDevsCount = developers.filter((d) => d.verificationStatus === 'PENDING').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'OPEN').length;
  const pendingAssetsCount = assets.filter((a) => a.moderationStatus === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <AdminHeader
        onRefreshData={handleManualSync}
        isRefreshing={isRefreshing}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        unreadNotificationsCount={openDisputesCount + pendingDevsCount}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          badgeCounts={{
            pendingDevs: pendingDevsCount,
            openDisputes: openDisputesCount,
            pendingAssets: pendingAssetsCount,
          }}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === 'overview' && (
              <SectionOverview
                stats={overviewStats}
                loading={loading}
                onNavigateTab={setActiveTab}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === 'revenue' && (
              <SectionRevenue
                dailyData={revenueDaily}
                byCategory={revenueByCategory}
                byDeveloper={revenueByDeveloper}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === 'developers' && (
              <SectionDevelopers
                developers={developers}
                onTriggerAction={(payload) => setPendingAction(payload)}
                onRefreshData={loadDashboardData}
              />
            )}

            {activeTab === 'clients' && (
              <SectionClients
                clients={clients}
                onTriggerAction={(payload) => setPendingAction(payload)}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === 'orders' && (
              <SectionOrders
                orders={orders}
                onTriggerAction={(payload) => setPendingAction(payload)}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === 'escrow' && (
              <SectionEscrow
                queue={escrowQueue}
                onTriggerAction={(payload) => setPendingAction(payload)}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === 'disputes' && (
              <SectionDisputes
                disputes={disputes}
                onTriggerAction={(payload) => setPendingAction(payload)}
                formatPrice={formatPrice}
              />
            )}

            {activeTab === 'assets' && (
              <SectionAssets
                assets={assets}
                onTriggerAction={(payload) => setPendingAction(payload)}
                onOpenAssetDetail={onOpenAssetDetail}
              />
            )}

            {activeTab === 'audit' && <SectionAudit logs={auditLogs} />}

            {activeTab === 'notifications' && (
              <SectionNotifications
                onTriggerAction={(payload) => setPendingAction(payload)}
              />
            )}

            {activeTab === 'settings' && (
              <SectionSettings
                settings={settings}
                onTriggerAction={(payload) => setPendingAction(payload)}
              />
            )}

            {activeTab === 'health' && (
              <SectionSystemHealth
                health={systemHealth}
                onRefreshHealth={loadDashboardData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Command Palette Modal (Ctrl + K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
      />

      {/* Sensitive Action Justification Modal */}
      <AdminJustificationModal
        payload={pendingAction}
        onClose={() => setPendingAction(null)}
      />

      {/* Toast Feedback Overlay */}
      <AdminToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
