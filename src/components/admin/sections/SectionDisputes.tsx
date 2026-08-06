import React, { useState } from 'react';
import {
  Gavel,
  Clock,
  CheckCircle2,
  FileText,
  Percent,
  Send,
  ShieldAlert,
  Download,
  AlertCircle,
} from 'lucide-react';
import { AdminDisputeItem } from '../../../types/adminControl';
import { SensitiveActionPayload } from '../AdminJustificationModal';

interface SectionDisputesProps {
  disputes: AdminDisputeItem[];
  onTriggerAction: (payload: SensitiveActionPayload) => void;
  formatPrice: (amount: number) => string;
}

export const SectionDisputes: React.FC<SectionDisputesProps> = ({
  disputes,
  onTriggerAction,
  formatPrice,
}) => {
  const [selectedDispute, setSelectedDispute] = useState<AdminDisputeItem | null>(
    disputes[0] || null
  );

  const [clientPercent, setClientPercent] = useState<number>(50);

  const handleApplyRuling = () => {
    if (!selectedDispute) return;
    const devPercent = 100 - clientPercent;
    const clientAmount = (selectedDispute.amountInEscrow * clientPercent) / 100;
    const devAmount = (selectedDispute.amountInEscrow * devPercent) / 100;

    onTriggerAction({
      title: `Submit Ruling for Dispute ${selectedDispute.disputeNumber}`,
      impactSummary: `Enforces ruling split: ${clientPercent}% to Client (${formatPrice(
        clientAmount
      )}) and ${devPercent}% to Developer (${formatPrice(devAmount)}).`,
      actionType: 'DISPUTE_RULING',
      targetId: selectedDispute.id,
      targetName: selectedDispute.disputeNumber,
      onConfirm: (reason) => {
        selectedDispute.status = 'RESOLVED';
        selectedDispute.clientSplitPercent = clientPercent;
        selectedDispute.developerSplitPercent = devPercent;
        selectedDispute.resolutionNotes = reason;
        selectedDispute.timeline.push({
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: 'SuperAdmin',
          action: `Resolved with ${clientPercent}% Client / ${devPercent}% Dev split.`,
          details: reason,
        });
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Gavel className="w-5 h-5 text-rose-400" />
            SECTION 7 — Dispute Arbitration Center & Resolution Wizard
          </h2>
          <p className="text-xs text-slate-400">
            Arbitrate open buyer/seller order conflicts, review evidence files, audit benchmark logs, and execute split payment rulings.
          </p>
        </div>
      </div>

      {/* Main Grid: Queue on Left, Detail & Resolution Wizard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dispute Queue */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Active Disputes Queue ({disputes.length})
          </h3>
          {disputes.map((dsp) => (
            <div
              key={dsp.id}
              onClick={() => {
                setSelectedDispute(dsp);
                setClientPercent(dsp.clientSplitPercent ?? 50);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedDispute?.id === dsp.id
                  ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-600/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400">{dsp.disputeNumber}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    dsp.status === 'OPEN'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                      : dsp.status === 'UNDER_REVIEW'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {dsp.status}
                </span>
              </div>

              <div className="text-xs font-bold text-white truncate">{dsp.serviceTitle}</div>
              <p className="text-[11px] text-slate-400">
                {dsp.clientName} vs {dsp.developerName}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
                <span className="text-slate-400">Escrow:</span>
                <span className="text-emerald-400 font-bold">{formatPrice(dsp.amountInEscrow)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Evidence Viewer, Timeline & Resolution Wizard */}
        {selectedDispute ? (
          <div className="lg:col-span-7 space-y-6">
            {/* Dispute Summary Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-400">{selectedDispute.disputeNumber}</span>
                  <h3 className="text-base font-bold text-white">{selectedDispute.serviceTitle}</h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Escrow Vault</span>
                  <div className="text-lg font-black text-emerald-400">{formatPrice(selectedDispute.amountInEscrow)}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Dispute Statement</span>
                <p className="text-xs text-slate-200 leading-relaxed">"{selectedDispute.reason}"</p>
              </div>

              {/* Evidence Files */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Submitted Evidence Files</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDispute.evidenceFiles.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-bold text-white truncate">{f.fileName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">By {f.uploadedBy} • {f.uploadedAt}</div>
                      </div>
                      <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispute Timeline */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Audit Trail & Timeline</span>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar font-mono text-[11px]">
                  {selectedDispute.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <span className="text-slate-500 shrink-0">[{item.timestamp}]</span>
                      <strong className="text-purple-400 shrink-0">{item.actor}:</strong>
                      <span>{item.action} {item.details && `- ${item.details}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Split Payment Calculator & Resolution Wizard */}
            {selectedDispute.status !== 'RESOLVED' && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-purple-800/60 space-y-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-purple-400" />
                  Split Payment Calculator & Resolution Wizard
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-cyan-400">Client Refund: {clientPercent}% ({formatPrice((selectedDispute.amountInEscrow * clientPercent) / 100)})</span>
                    <span className="text-purple-400">Dev Release: {100 - clientPercent}% ({formatPrice((selectedDispute.amountInEscrow * (100 - clientPercent)) / 100)})</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={clientPercent}
                    onChange={(e) => setClientPercent(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setClientPercent(100)}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white"
                    >
                      100% Client Refund
                    </button>
                    <button
                      onClick={() => setClientPercent(50)}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white"
                    >
                      50 / 50 Split
                    </button>
                    <button
                      onClick={() => setClientPercent(0)}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white"
                    >
                      100% Dev Release
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleApplyRuling}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Execute Binding Admin Ruling</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center text-slate-500 font-mono text-xs">
            Select a dispute from the queue to view evidence and arbitrate.
          </div>
        )}
      </div>
    </div>
  );
};
