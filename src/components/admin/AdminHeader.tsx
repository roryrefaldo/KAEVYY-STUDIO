import React from 'react';
import { ShieldCheck, RefreshCw, Command, Bell, Server } from 'lucide-react';

interface AdminHeaderProps {
  onRefreshData: () => void;
  isRefreshing: boolean;
  onOpenCommandPalette: () => void;
  unreadNotificationsCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onRefreshData,
  isRefreshing,
  onOpenCommandPalette,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 sticky top-0 z-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">KAEVY Admin Control Center</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                PRODUCTION v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Enterprise Operations, Multi-Currency Escrow & Audit Suite</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* System Health Quick Pulse */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">API: <strong className="text-emerald-400">24ms</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">DB: <strong className="text-emerald-400">OK</strong></span>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-800/80 hover:bg-purple-900/60 text-xs font-bold transition-all"
          >
            <Command className="w-3.5 h-3.5 text-purple-400" />
            <span>Cmd Palette</span>
            <kbd className="px-1 py-0.2 text-[9px] font-mono bg-purple-900 border border-purple-700 rounded text-purple-200 ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 ${
              isRefreshing ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            title="Sync Data from Backend API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          {/* Quick Notifications */}
          <button
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="System Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold font-mono flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
