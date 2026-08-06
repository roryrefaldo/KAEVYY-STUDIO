import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, CheckCheck, RefreshCw, Layers, ShieldCheck, DollarSign } from 'lucide-react';

export const OrderNotificationsView: React.FC = () => {
  const { notifications, unreadCount, loading, markRead, markAllRead, refreshNotifications } =
    useNotifications();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Notifikasi Aktivitas Order Workspace</h3>
              <p className="text-xs text-slate-400">{unreadCount} Notifikasi Belum Dibaca</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Tandai Semua Dibaca
              </button>
            )}
            <button
              onClick={refreshNotifications}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-mono">
            Belum ada notifikasi aktivitas order.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                  n.read
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-70'
                    : 'bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
                  {n.type === 'MILESTONE_SUBMITTED' ? (
                    <Layers className="w-4 h-4 text-amber-400" />
                  ) : n.type === 'ESCROW_RELEASED' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{n.title}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{n.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
