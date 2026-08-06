import React, { useEffect, useState } from 'react';
import { getService } from '../../lib/api';
import { ServiceDTO } from '../../types/api';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  X, Star, ShieldCheck, Clock, CheckCircle2, QrCode, 
  RefreshCw, AlertCircle, Sparkles, Building 
} from 'lucide-react';

interface ServiceDetailModalProps {
  serviceId: string | null;
  onClose: () => void;
  onOrderService: (service: ServiceDTO) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  serviceId,
  onClose,
  onOrderService,
}) => {
  const { language, t } = useLanguage();
  const [service, setService] = useState<ServiceDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getService(serviceId);
        if (res.success && res.data) {
          setService(res.data);
        } else {
          throw new Error('Jasa tidak ditemukan.');
        }
      } catch (err: any) {
        console.error('Error loading service detail:', err);
        setError(
          language === 'id'
            ? 'Gagal memuat rincian jasa. Silakan coba lagi.'
            : 'Failed to load service details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [serviceId]);

  if (!serviceId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'id' ? 'Detail Jasa API' : 'Service Blueprint Detail'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {loading && (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">
                {language === 'id' ? 'Memuat data jasa...' : 'Fetching service record...'}
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="py-8 text-center space-y-4">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-xs text-slate-300">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
              >
                {language === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
          )}

          {!loading && !error && service && (
            <>
              {/* Category & Rating Header */}
              <div className="flex items-center justify-between gap-4">
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-800 font-mono">
                  {service.categoryName || 'Roblox Service'}
                </span>
                <div className="flex items-center gap-1.5 text-amber-400 text-sm font-bold bg-amber-950/40 px-3 py-1 rounded-full border border-amber-900/60">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{service.rating || 4.98}</span>
                  <span className="text-slate-400 text-xs font-normal">({service.completedCount || 42} pesanan selesai)</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{service.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{service.description}</p>
              </div>

              {/* Developer info */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={service.developerAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={service.developerDisplayName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">{service.developerDisplayName || 'AeroScript_Dev'}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {language === 'id' ? 'Developer Terverifikasi KAEVY' : 'Verified KAEVY Developer'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">{language === 'id' ? 'Kapasitas Queue' : 'Queue Capacity'}</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{service.activeQueueCount || 2} / {service.maxQueueCapacity || 3} Active</span>
                  </div>
                </div>
              </div>

              {/* Scope & Features List */}
              {service.features && service.features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {language === 'id' ? 'Cakupan Layanan & Fitur Include:' : 'Included Scope & Deliverables:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-200">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guarantees */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-900/50 flex items-center gap-3">
                <Building className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="text-xs text-cyan-200">
                  <strong>Garansi Sistem 30 Hari:</strong> Segala bug scripting atau kerusakan asset pasca penyerahan akan diperbaiki secara gratis oleh developer terverifikasi KAEVY.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!loading && !error && service && (
          <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">
                {service.pricingType === 'STARTING_FROM' ? t('marketplace.startingFrom') : 'Mulai Dari'}
              </div>
              <div className="text-xl font-black text-white font-mono">
                {service.baseCurrency === 'IDR'
                  ? `Rp ${(typeof service.basePrice === 'number' ? service.basePrice : parseFloat(service.basePrice) || 0).toLocaleString('id-ID')}`
                  : `$${(typeof service.basePrice === 'number' ? service.basePrice : parseFloat(service.basePrice) || 0).toLocaleString('en-US')}`}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOrderService(service);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{language === 'id' ? 'Pesan Sekarang' : 'Order Service Now'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
