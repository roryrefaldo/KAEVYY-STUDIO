import React from 'react';
import { useEscrow } from '../../hooks/useEscrow';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { ShieldCheck, Lock, Unlock, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatEscrowBadge } from '../../utils/orderWorkspaceUtils';

interface EscrowViewProps {
  orderNumber?: string;
}

export const EscrowView: React.FC<EscrowViewProps> = ({ orderNumber = 'KS-2026-8801' }) => {
  const { language, formatPrice } = useLanguage();
  const { escrow, loading } = useEscrow(orderNumber);

  if (loading) {
    return <div className="py-12 text-center text-xs font-mono text-slate-400">Memuat status Escrow Vault...</div>;
  }

  if (!escrow) {
    return <div className="py-12 text-center text-xs font-mono text-slate-400">Data Escrow Vault tidak ditemukan.</div>;
  }

  const badge = formatEscrowBadge(escrow.status, language === 'id' ? 'id' : 'en');

  return (
    <div className="space-y-6">
      {/* Escrow Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${badge.bgClass}`}>
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                {badge.label}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white">Escrow Vault Protection #{orderNumber}</h3>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block uppercase">Total Nilai Escrow</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {formatPrice(escrow.totalAmountUSD)}
            </span>
            <span className="block text-xs font-mono text-slate-500">
              (Rp {escrow.totalAmountIDR.toLocaleString('id-ID')})
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl border-t border-slate-800 pt-3">
          Sistem Escrow Kaevy Studio bertindak sebagai penjamin transaksi netral. Pembayaran Klien dikunci aman
          di rekening penampung dan hanya akan dicairkan ke Developer per tahapan milestone setelah persetujuan Klien.
        </p>
      </div>

      {/* Vault Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">Dana Terkunci di Escrow</span>
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-amber-400 font-mono">
            {formatPrice(escrow.heldAmountUSD)}
          </span>
          <span className="text-xs text-slate-400 block font-mono">
            Rp {escrow.heldAmountIDR.toLocaleString('id-ID')}
          </span>
          <p className="text-[11px] text-slate-500 pt-1">
            Siap dirilis secara bertahap saat developer menyelesaikan milestone berikutnya.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">Dana Telah Dirilis ke Developer</span>
            <Unlock className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 font-mono">
            {formatPrice(escrow.releasedAmountUSD)}
          </span>
          <span className="text-xs text-slate-400 block font-mono">
            Rp {escrow.releasedAmountIDR.toLocaleString('id-ID')}
          </span>
          <p className="text-[11px] text-slate-500 pt-1">
            Telah berhasil disetujui klien dan ditransfer ke dompet developer.
          </p>
        </div>
      </div>

      {/* Escrow Guarantees List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="font-bold text-white text-sm">Jaminan Keamanan Escrow Vault KAEVY STUDIO</h4>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Proteksi Anti-Ghosting:</strong> Jika developer membatalkan pengerjaan, 100% dana sisa di Escrow dikembalikan ke Klien.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Proteksi Hak Cipta Kode:</strong> Developer dijamin menerima pembayaran utuh setelah hasil deliverable disetujui.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
