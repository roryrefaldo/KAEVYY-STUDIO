import React from 'react';
import { useClientWorkspace } from '../../hooks/useClientWorkspace';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { ShoppingBag, Clock, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface ClientWorkspaceViewProps {
  onOpenOrderModal?: (order: any) => void;
  onOpenCheckout?: (title: string, priceUSD: number) => void;
}

export const ClientWorkspaceView: React.FC<ClientWorkspaceViewProps> = ({
  onOpenOrderModal,
  onOpenCheckout,
}) => {
  const { language, formatPrice } = useLanguage();
  const { orders, loading, summary, refreshOrders } = useClientWorkspace();

  return (
    <div className="space-y-6">
      {/* Client Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">
            {language === 'id' ? 'Pesanan Aktif' : 'Active Orders'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">{summary.activeOrdersCount}</span>
            <ShoppingBag className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">
            {language === 'id' ? 'Total Investasi Proyek' : 'Total Spent'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-400">
              {formatPrice(summary.totalSpentUSD)}
            </span>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">
            {language === 'id' ? 'Persetujuan Milestone' : 'Pending Approvals'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-400">{summary.pendingApprovalsCount}</span>
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">
            {language === 'id' ? 'Garansi Kode Aktif' : 'Active Warranties'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-cyan-400">{summary.activeWarrantyCount}</span>
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Orders List Table / Cards */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base">
            {language === 'id' ? 'Daftar Pesanan & Proyek Aktif Saya' : 'My Orders & Active Projects'}
          </h3>
          <button
            onClick={refreshOrders}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-mono">
            {language === 'id' ? 'Belum ada pesanan aktif.' : 'No active client orders found.'}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord, idx) => (
              <div
                key={ord.orderNumber || idx}
                onClick={() => onOpenOrderModal && onOpenOrderModal(ord)}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-400 text-xs">#{ord.orderNumber || `KS-2026-880${idx + 1}`}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold font-mono">
                      {ord.status || 'IN_PROGRESS'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{ord.serviceTitle || ord.title || 'Roblox Luau Custom Scripting System'}</h4>
                  <p className="text-xs text-slate-400">Developer: {ord.developerName || 'Ahmad Developer Studio'}</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {formatPrice(ord.agreedPriceUSD || 250)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
