import React, { useState } from 'react';
import { useMilestones } from '../../hooks/useMilestones';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { Layers, CheckCircle2, Clock, Upload, Send, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface MilestonesViewProps {
  orderNumber?: string;
  role?: 'CLIENT' | 'DEVELOPER';
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  orderNumber = 'KS-2026-8801',
  role = 'CLIENT',
}) => {
  const { language, formatPrice } = useLanguage();
  const { milestones, submitting, submitMilestoneDeliverable, approveMilestoneRelease, requestRevision } =
    useMilestones();

  const [selectedMilestoneStage, setSelectedMilestoneStage] = useState<25 | 50 | 100 | null>(null);
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [revisionNotesInput, setRevisionNotesInput] = useState('');

  const handleDevSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestoneStage) return;
    await submitMilestoneDeliverable('proj-8801', selectedMilestoneStage, deliverableNotes, deliverableUrl);
    setSelectedMilestoneStage(null);
    setDeliverableNotes('');
    setDeliverableUrl('');
  };

  const handleClientApprove = async (stage: 25 | 50 | 100) => {
    if (confirm(language === 'id' ? 'Apakah Anda yakin ingin menyetujui rilis dana Escrow untuk milestone ini?' : 'Are you sure you want to approve milestone escrow release?')) {
      await approveMilestoneRelease('proj-8801', stage);
    }
  };

  const handleClientRevision = async (stage: 25 | 50 | 100) => {
    const notes = prompt(language === 'id' ? 'Masukkan catatan revisi untuk developer:' : 'Enter revision notes for developer:');
    if (notes) {
      await requestRevision('proj-8801', stage, notes);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
          <Layers className="w-4 h-4" />
          <span>Sistem Milestone Proyek & Release Escrow 3-Tahap</span>
        </div>
        <h3 className="text-xl font-bold text-white">Milestone Workflow Pesanan #{orderNumber}</h3>
        <p className="text-xs text-slate-400 max-w-2xl">
          {language === 'id'
            ? 'Pencairan dana dilakukan secara bertahap (25% DP, 50% Mid Progress, 25% Final Delivery). Dana aman tersimpan di Escrow Vault hingga Klien memberikan konfirmasi rilis.'
            : 'Payments are safely released in stages (25% DP, 50% Mid Progress, 25% Final Delivery) backed by Escrow Vault guarantee.'}
        </p>
      </div>

      {/* Milestones Cards */}
      <div className="space-y-4">
        {milestones.map((m) => {
          const isApproved = m.status === 'APPROVED';
          const isSubmitted = m.status === 'SUBMITTED';
          const isRevision = m.status === 'REVISION_REQUESTED';

          return (
            <div
              key={m.stage}
              className={`p-6 rounded-2xl bg-slate-900 border transition-all space-y-4 ${
                isApproved
                  ? 'border-emerald-800/80 bg-emerald-950/10'
                  : isSubmitted
                  ? 'border-amber-500/80 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400 border border-slate-800 text-[10px] font-mono font-bold">
                      STAGE {m.percentage}%
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isApproved
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isSubmitted
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : isRevision
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">{m.title}</h4>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {formatPrice(m.amountUSD)}
                  </span>
                  <span className="block text-[11px] font-mono text-slate-400">
                    Rp {m.amountIDR.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Deliverable Notes */}
              {m.deliverableNotes && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">
                    Catatan Pengerjaan Developer:
                  </span>
                  <p className="text-xs text-slate-200">{m.deliverableNotes}</p>
                  {m.deliverableUrl && (
                    <a
                      href={m.deliverableUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-bold hover:underline pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Buka Hasil Deliverable / Studio Link
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons based on Role */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  {isApproved
                    ? `Approved & Released: ${new Date(m.approvedAt || '').toLocaleDateString('id-ID')}`
                    : isSubmitted
                    ? 'Menunggu Review & Rilis Dana Klien'
                    : 'Pengerjaan Tahap Berjalan'}
                </span>

                <div className="flex items-center gap-2">
                  {/* Developer Action */}
                  {role === 'DEVELOPER' && !isApproved && (
                    <button
                      onClick={() => setSelectedMilestoneStage(m.stage)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Unggah Hasil Milestone
                    </button>
                  )}

                  {/* Client Action */}
                  {role === 'CLIENT' && isSubmitted && (
                    <>
                      <button
                        onClick={() => handleClientRevision(m.stage)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Minta Revisi
                      </button>
                      <button
                        onClick={() => handleClientApprove(m.stage)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" /> Setujui & Rilis Escrow
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Developer Submission Modal Form */}
      {selectedMilestoneStage && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/50 space-y-4">
          <h4 className="font-bold text-white text-sm">
            Unggah Hasil Pengerjaan Milestone Stage {selectedMilestoneStage}%
          </h4>
          <form onSubmit={handleDevSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-bold">Catatan Deliverables *</label>
              <textarea
                rows={3}
                required
                value={deliverableNotes}
                onChange={(e) => setDeliverableNotes(e.target.value)}
                placeholder="Tuliskan modul, fitur, atau script yang telah selesai dikerjakan..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-bold">Link Hasil / Roblox Place / GitHub</label>
              <input
                type="url"
                value={deliverableUrl}
                onChange={(e) => setDeliverableUrl(e.target.value)}
                placeholder="https://www.roblox.com/games/..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedMilestoneStage(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Kirim Deliverable
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
