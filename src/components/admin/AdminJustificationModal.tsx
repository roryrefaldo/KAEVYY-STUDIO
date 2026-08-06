import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface SensitiveActionPayload {
  title: string;
  impactSummary: string;
  actionType: string;
  targetId?: string;
  targetName?: string;
  onConfirm: (reason: string) => void;
}

interface AdminJustificationModalProps {
  payload: SensitiveActionPayload | null;
  onClose: () => void;
}

export const AdminJustificationModal: React.FC<AdminJustificationModalProps> = ({
  payload,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!payload) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await payload.onConfirm(reason.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{payload.title}</h3>
            <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider font-mono">
              Admin Override & Audit Trail Logging Required
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
              Target Entity
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {payload.targetName || payload.targetId || 'N/A'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{payload.impactSummary}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Reason / Audit Justification <span className="text-rose-400">*</span></span>
              <span className="text-[10px] text-slate-500 font-mono">Min 10 characters</span>
            </label>
            <textarea
              required
              minLength={10}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide explicit operational justification for this action (e.g., 'Client approved refund following SLA breach in milestone 2')."
              className="w-full h-28 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reason.trim().length < 10 || isSubmitting}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                reason.trim().length >= 10 && !isSubmitting
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging Action...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Commit Audit Log</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
