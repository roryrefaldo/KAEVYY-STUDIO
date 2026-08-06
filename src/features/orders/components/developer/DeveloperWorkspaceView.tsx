import React from 'react';
import { useDeveloperWorkspace } from '../../hooks/useDeveloperWorkspace';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { Code2, DollarSign, Layers, CheckCircle2, AlertCircle, RefreshCw, Check, X } from 'lucide-react';

interface DeveloperWorkspaceViewProps {
  onOpenOrderModal?: (order: any) => void;
  onOpenUploadAsset?: () => void;
}

export const DeveloperWorkspaceView: React.FC<DeveloperWorkspaceViewProps> = ({
  onOpenOrderModal,
  onOpenUploadAsset,
}) => {
  const { language, formatPrice } = useLanguage();
  const {
    developerOrders,
    loading,
    actionStatus,
    summary,
    handleAcceptOrder,
    handleRejectOrder,
    refreshDeveloperOrders,
  } = useDeveloperWorkspace();

  return (
    <div className="space-y-6">
      {actionStatus && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionStatus}</span>
        </div>
      )}

      {/* Developer Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">
            {language === 'id' ? 'Proyek Aktif Kerjaan' : 'Active Projects'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">{summary.activeProjectsCount}</span>
            <Code2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">
            {language === 'id' ? 'Pendapatan Bersih Dev' : 'Net Earnings'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-400">
              {formatPrice(summary.totalEarningsUSD)}
            </span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">
            {language === 'id' ? 'Milestone Menunggu' : 'Pending Deliverables'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-400">{summary.pendingMilestonesCount}</span>
            <Layers className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-mono text-slate-400 block uppercase">
            {language === 'id' ? 'Kapasitas Queue Antrean' : 'Queue Capacity'}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-cyan-400">
              {summary.queueCapacityUsed} / {summary.maxQueueCapacity} Slot
            </span>
            <AlertCircle className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Developer Orders Workspace Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base">
            {language === 'id' ? 'Antrean Pesanan Masuk & Pengerjaan Proyek' : 'Incoming Order Queue & Project Work'}
          </h3>
          <button
            onClick={refreshDeveloperOrders}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {developerOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-mono">
            {language === 'id' ? 'Belum ada proyek dalam antrean.' : 'No orders in developer queue.'}
          </div>
        ) : (
          <div className="space-y-3">
            {developerOrders.map((ord, idx) => (
              <div
                key={ord.orderNumber || idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div
                  onClick={() => onOpenOrderModal && onOpenOrderModal(ord)}
                  className="space-y-1 cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400 text-xs">#{ord.orderNumber || `KS-2026-880${idx + 1}`}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold font-mono">
                      {ord.status || 'DEVELOPER_REVIEW'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{ord.serviceTitle || ord.title || 'Roblox Luau Custom Scripting System'}</h4>
                  <p className="text-xs text-slate-400">Klien: {ord.clientName || 'Budi Client Roblox'}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {formatPrice(ord.agreedPriceUSD || 250)}
                  </span>

                  {(ord.status === 'DEVELOPER_REVIEW' || ord.status === 'PENDING_PAYMENT' || !ord.status) && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptOrder(ord.orderNumber)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Terima
                      </button>
                      <button
                        onClick={() => handleRejectOrder(ord.orderNumber)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
