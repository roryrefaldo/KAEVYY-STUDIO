import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  UserCheck,
  Users,
  ShoppingBag,
  ShieldAlert,
  Gavel,
  FileCheck2,
  Terminal,
  Bell,
  SlidersHorizontal,
  Activity,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { AdminTab } from '../../types/adminControl';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCommandPalette: () => void;
  badgeCounts: {
    pendingDevs: number;
    openDisputes: number;
    pendingAssets: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  onOpenCommandPalette,
  badgeCounts,
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; category: string }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, category: 'ANALYTICS' },
    { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp, category: 'ANALYTICS' },
    { id: 'developers', label: 'Developer Management', icon: UserCheck, badge: badgeCounts.pendingDevs, category: 'MANAGEMENT' },
    { id: 'clients', label: 'Client Management', icon: Users, category: 'MANAGEMENT' },
    { id: 'orders', label: 'Orders Monitor', icon: ShoppingBag, category: 'OPERATIONS' },
    { id: 'escrow', label: 'Escrow Control', icon: ShieldAlert, category: 'OPERATIONS' },
    { id: 'disputes', label: 'Dispute Resolution', icon: Gavel, badge: badgeCounts.openDisputes, category: 'OPERATIONS' },
    { id: 'assets', label: 'Asset Moderation', icon: FileCheck2, badge: badgeCounts.pendingAssets, category: 'OPERATIONS' },
    { id: 'audit', label: 'Audit Center', icon: Terminal, category: 'SYSTEM' },
    { id: 'notifications', label: 'Notification Center', icon: Bell, category: 'SYSTEM' },
    { id: 'settings', label: 'Platform Settings', icon: SlidersHorizontal, category: 'SYSTEM' },
    { id: 'health', label: 'System Health', icon: Activity, category: 'SYSTEM' },
  ];

  const categories = ['ANALYTICS', 'MANAGEMENT', 'OPERATIONS', 'SYSTEM'];

  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header & Command Palette Button */}
      <div className="p-3 border-b border-slate-800 flex flex-col gap-2">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/50 transition-all text-xs ${
            collapsed ? 'justify-center p-2' : ''
          }`}
          title="Command Palette (Ctrl + K)"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-purple-400" />
            {!collapsed && <span className="font-medium">Quick Jump...</span>}
          </div>
          {!collapsed && (
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
        {categories.map((cat) => {
          const catItems = menuItems.filter((item) => item.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              {!collapsed && (
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {cat}
                </span>
              )}
              {catItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isActive ? 'bg-purple-950 text-white border border-purple-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin v1.0 Production</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
