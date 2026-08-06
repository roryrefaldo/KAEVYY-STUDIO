import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ShieldAlert,
  ShoppingBag,
  FolderGit2,
  CheckCircle2,
  Clock,
  UserCheck,
  Globe,
  Package,
  Download,
  Gavel,
} from 'lucide-react';
import { OverviewCardStats } from '../../../types/adminControl';

interface SectionOverviewProps {
  stats: OverviewCardStats;
  loading: boolean;
  onNavigateTab: (tab: any) => void;
  formatPrice: (amount: number) => string;
}

export const SectionOverview: React.FC<SectionOverviewProps> = ({
  stats,
  loading,
  onNavigateTab,
  formatPrice,
}) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      subtext: 'Cumulative Platform Commission',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-800/60',
      tab: 'revenue',
    },
    {
      title: 'Revenue Today',
      value: formatPrice(stats.revenueToday),
      subtext: '+12.4% vs yesterday',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-800/60',
      tab: 'revenue',
    },
    {
      title: 'Escrow Locked',
      value: formatPrice(stats.escrowLocked),
      subtext: `Vaulted in active orders`,
      icon: ShieldAlert,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800/60',
      tab: 'escrow',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      subtext: 'All-time placed orders',
      icon: ShoppingBag,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40 border-cyan-800/60',
      tab: 'orders',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects.toLocaleString(),
      subtext: 'In milestone development',
      icon: FolderGit2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/40 border-blue-800/60',
      tab: 'orders',
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects.toLocaleString(),
      subtext: 'Verified & delivered',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-slate-900 border-slate-800',
      tab: 'orders',
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews.toLocaleString(),
      subtext: 'Milestones awaiting client audit',
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-slate-900 border-slate-800',
      tab: 'orders',
    },
    {
      title: 'Active Developers',
      value: `${stats.activeDevelopers} Devs`,
      subtext: 'Verified talent pool',
      icon: UserCheck,
      color: 'text-purple-400',
      bgColor: 'bg-slate-900 border-slate-800',
      tab: 'developers',
    },
    {
      title: 'Online Users',
      value: `${stats.onlineUsers} Live`,
      subtext: 'Active sockets connected',
      icon: Globe,
      color: 'text-emerald-400',
      bgColor: 'bg-slate-900 border-slate-800',
      tab: 'health',
    },
    {
      title: 'Assets Uploaded',
      value: stats.assetsUploaded.toLocaleString(),
      subtext: 'Share Asset marketplace items',
      icon: Package,
      color: 'text-cyan-400',
      bgColor: 'bg-slate-900 border-slate-800',
      tab: 'assets',
    },
    {
      title: 'Total Downloads',
      value: stats.totalDownloads.toLocaleString(),
      subtext: 'Asset community downloads',
      icon: Download,
      color: 'text-blue-400',
      bgColor: 'bg-slate-900 border-slate-800',
      tab: 'assets',
    },
    {
      title: 'Open Disputes',
      value: `${stats.openDisputes} Open`,
      subtext: 'Requiring admin arbitration',
      icon: Gavel,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/40 border-rose-800/60',
      tab: 'disputes',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Title Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            SECTION 1 — Executive Dashboard Overview
          </h2>
          <p className="text-xs text-slate-400">
            Real-time platform financial operational pulse, active developer queues, escrow vault balances, and dispute status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-full text-xs font-mono font-bold">
            LIVE BACKEND API
          </span>
        </div>
      </div>

      {/* 12 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer group ${card.bgColor}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:border-purple-500/50 transition-colors">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {loading ? (
                  <div className="h-7 w-28 bg-slate-800 animate-pulse rounded-lg" />
                ) : (
                  <div className={`text-2xl font-black font-mono tracking-tight text-white`}>
                    {card.value}
                  </div>
                )}
                <p className="text-[11px] text-slate-400 font-medium">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
