import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  CheckCircle2,
  RotateCcw,
  DollarSign,
  ArrowRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { EscrowQueueItem } from '../../../types/adminControl';
import { SensitiveActionPayload } from '../AdminJustificationModal';

interface SectionEscrowProps {
  queue: EscrowQueueItem[];
  onTriggerAction: (payload: SensitiveActionPayload) => void;
  formatPrice: (amount: number) => string;
}

export const SectionEscrow: React.FC<SectionEscrowProps> = ({
  queue,
  onTriggerAction,
  formatPrice,
}) => {
  const [activeTab, setActiveTab] = useState<'HELD' | 'RELEASE_PENDING' | 'HISTORY'>('HELD');

  const heldFunds = queue.filter((i) => i.status === 'HELD');
  const releaseQueue = queue.filter((i) => i.status === 'RELEASE_PENDING');
  const history = queue.filter((i) => i.status === 'RELEASED' || i.status === 'REFUNDED');

  const totalHeldAmount = heldFunds.reduce((sum, item) => sum + item.amount, 0);

  const handleManualRelease = (item: EscrowQueueItem) => {
    onTriggerAction({
      title: `Manual Escrow Release Override for ${item.orderNumber}`,
      impactSummary: `Manually authorizes release of $${item.amount} from escrow vault directly to developer (${item.developerName}).`,
      actionType: 'ESCROW_MANUAL_RELEASE',
      targetId: item.id,
      targetName: item.orderNumber,
      onConfirm: (reason) => {
        item.status = 'RELEASED';
      },
    });
  };

  const handleManualRefund = (item: EscrowQueueItem) => {
    onTriggerAction({
      title: `Manual Escrow Refund Override for ${item.orderNumber}`,
      impactSummary: `Manually refunds $${item.amount} from escrow vault back to client (${item.clientName}).`,
      actionType: 'ESCROW_MANUAL_REFUND',
      targetId: item.id,
      targetName: item.orderNumber,
      onConfirm: (reason) => {
        item.status = 'REFUNDED';
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            SECTION 6 — Escrow Control Vault & Manual Disbursement
          </h2>
          <p className="text-xs text-slate-400">
            Audit held escrow funds, pending milestone release queues, refund queues, and execute admin override disbursements.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-800/80 font-mono text-right shrink-0">
          <span className="text-[10px] text-amber-300 uppercase font-bold">Total Held Vault Balance</span>
          <div className="text-xl font-black text-amber-400">{formatPrice(totalHeldAmount)}</div>
        </div>
      </div>

      {/* Queue Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'HELD', label: 'Vault Held Funds', count: heldFunds.length },
          { id: 'RELEASE_PENDING', label: 'Release Queue', count: releaseQueue.length },
          { id: 'HISTORY', label: 'Disbursement History', count: history.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-950 text-slate-300">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        {(activeTab === 'HELD' ? heldFunds : activeTab === 'RELEASE_PENDING' ? releaseQueue : history).map(
          (item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-700"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{item.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-950 text-purple-300 border border-purple-800">
                    {item.milestoneTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Client: <strong className="text-white">{item.clientName}</strong> → Dev:{' '}
                  <strong className="text-purple-300">{item.developerName}</strong>
                </p>
                {item.proofNote && (
                  <p className="text-[11px] text-slate-400 italic">"{item.proofNote}"</p>
                )}
                <div className="text-[10px] font-mono text-slate-500">Held since: {item.heldSince}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Escrow Amount</span>
                  <div className="text-lg font-black text-emerald-400">{formatPrice(item.amount)}</div>
                </div>

                {activeTab !== 'HISTORY' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleManualRelease(item)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                    >
                      Release to Dev
                    </button>
                    <button
                      onClick={() => handleManualRefund(item)}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20"
                    >
                      Refund Client
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
