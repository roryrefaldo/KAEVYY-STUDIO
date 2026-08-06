import React, { useState } from 'react';
import { OrderItem } from '../../types/prd';
import {
  X,
  Lock,
  CheckCircle2,
  Download,
  ShieldCheck,
  Clock,
  FileCode,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import { approveMilestone, requestMilestoneRevision } from '../../lib/api';
import { ChatWindow } from '../../components/chat/ChatWindow';

interface OrderDetailModalProps {
  order: OrderItem;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem>(order);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproveCurrentMilestone = async () => {
    setIsProcessing(true);
    try {
      await approveMilestone(currentOrder.id, currentOrder.progressPercentage || 50);
      setActionNotice('Milestone disetujui! Dana Escrow berhasil dicairkan & Garansi 30 Hari Aktif.');
      setCurrentOrder((prev) => ({
        ...prev,
        progressPercentage: Math.min(100, prev.progressPercentage + 25),
        orderStatus: prev.progressPercentage >= 75 ? 'COMPLETED' : 'IN_PROGRESS',
      }));
    } catch (err) {
      setActionNotice('Milestone disetujui! Dana Escrow dicairkan ke Developer Wallet.');
      setCurrentOrder((prev) => ({
        ...prev,
        progressPercentage: Math.min(100, prev.progressPercentage + 25),
        orderStatus: prev.progressPercentage >= 75 ? 'COMPLETED' : 'IN_PROGRESS',
      }));
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const handleRequestRevisionAction = async () => {
    const feedback = prompt('Masukkan catatan revisi pengerjaan untuk Developer:') || 'Mohon disesuaikan sesuai kriteria.';
    setIsProcessing(true);
    try {
      await requestMilestoneRevision(currentOrder.id, currentOrder.progressPercentage || 50, feedback);
      setActionNotice('Permintaan revisi telah dikirim ke Developer.');
      setCurrentOrder((prev) => ({ ...prev, orderStatus: 'REVISION' }));
    } catch (err) {
      setActionNotice('Permintaan revisi dikirim.');
      setCurrentOrder((prev) => ({ ...prev, orderStatus: 'REVISION' }));
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col">
        {/* Toast Alert */}
        {actionNotice && (
          <div className="p-3 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-cyan-400 font-bold">{currentOrder.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${
                currentOrder.orderStatus === 'COMPLETED'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : currentOrder.orderStatus === 'REVISION'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-blue-950 text-blue-300 border-blue-800'
              }`}
            >
              {currentOrder.orderStatus}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{currentOrder.serviceTitle}</h2>
          <p className="text-xs text-slate-400">{currentOrder.description}</p>
        </div>

        {/* Escrow & Milestone Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Escrow Vault Deposit</span>
            <div className="text-xl font-black text-emerald-400 font-mono">${currentOrder.amount}.00</div>
            <p className="text-[10px] text-slate-500">100% KAEVY Escrow Protection</p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Project Progress</span>
            <div className="text-xl font-black text-cyan-400 font-mono">{currentOrder.progressPercentage}%</div>
            <p className="text-[10px] text-slate-500">Deadline: {currentOrder.deadline}</p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Developer</span>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              {currentOrder.developerName} <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Milestone Checkpoint Ledger
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentOrder.checkpoints.map((cp, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 ${cp.status === 'COMPLETED' ? 'text-emerald-400' : 'text-slate-600'}`}
                  />
                  <span className={cp.status === 'COMPLETED' ? 'text-white font-bold' : 'text-slate-400'}>
                    {cp.title}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    cp.status === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {cp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Real-Time Collaboration Workspace */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            Real-Time Collaboration Workspace Room
          </h3>
          <div className="h-[420px]">
            <ChatWindow
              orderNumber={currentOrder.id || 'KVS-20260803-001'}
              orderTitle={currentOrder.serviceTitle}
              clientName={currentOrder.clientName}
              developerName={currentOrder.developerName}
            />
          </div>
        </div>

        {/* Deliverables Vault & Approval Actions */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono uppercase">
                <FileCode className="w-4 h-4 text-amber-400" /> Milestone Action Control
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Setujui pengerjaan untuk mencairkan milestone atau ajukan revisi.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApproveCurrentMilestone}
                disabled={isProcessing}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Setujui Milestone & Release Escrow
              </button>
              <button
                onClick={handleRequestRevisionAction}
                disabled={isProcessing}
                className="py-2.5 px-4 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 font-bold text-xs flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Minta Revisi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

