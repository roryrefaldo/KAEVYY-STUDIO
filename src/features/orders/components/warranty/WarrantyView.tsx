import React, { useState } from 'react';
import { useWarranty } from '../../hooks/useWarranty';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { ShieldCheck, AlertCircle, CheckCircle2, LifeBuoy, Send } from 'lucide-react';

interface WarrantyViewProps {
  orderNumber?: string;
}

export const WarrantyView: React.FC<WarrantyViewProps> = ({ orderNumber = 'KS-2026-8801' }) => {
  const { language } = useLanguage();
  const { warranty, submitWarrantyClaim } = useWarranty();

  const [issueTitle, setIssueTitle] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle) return;
    submitWarrantyClaim(issueTitle, issueDetails);
    setSubmittedMessage('Klaim garansi kode berhasil dikirim! Developer dan Admin Kaevy Studio telah diberitahukan.');
    setIssueTitle('');
    setIssueDetails('');
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Garansi Kode Luau 30 Hari & Anti-DataStore Corruption</span>
        </div>
        <h3 className="text-2xl font-black text-white">Perlindungan Garansi Sumber Kode KAEVY STUDIO</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Setiap proyek pekerjaan Roblox yang diselesaikan di platform kami dilindungi garansi 30 hari pasca serah terima.
          Developer wajib memperbaiki bug atau kerentanan logika tanpa biaya tambahan.
        </p>
      </div>

      {submittedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{submittedMessage}</span>
        </div>
      )}

      {/* Warranty Status Card */}
      {warranty && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 block uppercase">
                Status Masa Garansi #{orderNumber}
              </span>
              <h4 className="font-bold text-white text-lg">{warranty.title}</h4>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-cyan-500/30 text-right">
              <span className="text-xs font-mono text-cyan-400 font-bold block">Sisa Masa Garansi</span>
              <span className="text-xl font-black text-white font-mono">{warranty.daysRemaining} Hari</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-mono">Mulai Garansi:</span>
              <span className="font-bold text-white">{new Date(warranty.startDate).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-mono">Berakhir Garansi:</span>
              <span className="font-bold text-white">{new Date(warranty.endDate).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-mono">Tiket Klaim Dibuat:</span>
              <span className="font-bold text-amber-400">{warranty.reportedIssuesCount} Laporan</span>
            </div>
          </div>
        </div>
      )}

      {/* Claim Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-bold text-base">
          <LifeBuoy className="w-5 h-5 text-cyan-400" />
          <span>Ajukan Klaim Perbaikan Garansi</span>
        </div>

        <form onSubmit={handleSubmitClaim} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-bold">Judul Bug / Kendala Kode *</label>
            <input
              type="text"
              required
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="misal: DataStore gagal menyimpan item player pada teleport"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-bold">Detail Error & Langkah Reproduksi Bug</label>
            <textarea
              rows={4}
              required
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
              placeholder="Lampirkan pesan error di Output Roblox Studio atau kronologi bug..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Kirim Klaim Garansi
          </button>
        </form>
      </div>
    </div>
  );
};
