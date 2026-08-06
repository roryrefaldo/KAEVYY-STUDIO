import React, { useEffect, useState } from 'react';
import { getDeveloper } from '../../lib/api';
import { DeveloperDTO } from '../../types/api';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  X, ShieldCheck, Star, RefreshCw, AlertCircle, 
  MessageSquare, FolderGit2 
} from 'lucide-react';

interface DeveloperDetailModalProps {
  developerId: string | null;
  onClose: () => void;
  onRequestQuote?: (developer: DeveloperDTO) => void;
}

export const DeveloperDetailModal: React.FC<DeveloperDetailModalProps> = ({
  developerId,
  onClose,
  onRequestQuote,
}) => {
  const { language } = useLanguage();
  const [developer, setDeveloper] = useState<DeveloperDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!developerId) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDeveloper(developerId);
        if (res.success && res.data) {
          setDeveloper(res.data);
        } else {
          throw new Error('Developer tidak ditemukan.');
        }
      } catch (err: any) {
        console.error('Error loading developer detail:', err);
        setError(
          language === 'id'
            ? 'Gagal memuat profil developer. Silakan coba lagi.'
            : 'Failed to load developer profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [developerId]);

  if (!developerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'id' ? 'Profil Developer Terverifikasi' : 'Verified Developer Profile'}</span>
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
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">
                {language === 'id' ? 'Memuat profil developer...' : 'Fetching developer record...'}
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

          {!loading && !error && developer && (
            <>
              {/* Profile Header */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <img
                  src={developer.userAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={developer.userDisplayName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-lg">{developer.userDisplayName}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {developer.developerTier === 'ELITE' && (
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold font-mono">
                        ELITE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{developer.specialization}</p>
                  <div className="flex items-center gap-3 text-xs text-amber-400 font-bold pt-1">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {developer.rating || 4.95}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">
                      {developer.completedOrders || 38} {language === 'id' ? 'Project Selesai' : 'Projects Completed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {language === 'id' ? 'Tentang Developer' : 'About Developer'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                  {developer.bio}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {language === 'id' ? 'Keahlian Utama' : 'Core Tech Stack & Skills'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(developer.skills || ['Luau', 'DataStore', 'Knit Framework', 'UI Animation']).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-950 text-emerald-300 border border-emerald-900/60 text-xs font-mono font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Capacity Status */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">{language === 'id' ? 'Kapasitas Pengerjaan Aktif' : 'Active Queue Capacity'}</span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'id' ? 'Dibatasi untuk menjaga kualitas garansi code' : 'Capped to guarantee code quality'}
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {language === 'id'
                    ? `${developer.activeQueueCount || 2} dari ${developer.maxQueueCapacity || developer.activeProjectCapacity || 3} Slot`
                    : `${developer.activeQueueCount || 2} / ${developer.maxQueueCapacity || developer.activeProjectCapacity || 3} Slots`}
                </span>
              </div>

              {/* Portfolio Samples */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'id' ? 'Sampel Portofolio Kode & Game' : 'Portfolio Highlights'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(developer.portfolioItems || [
                    { title: 'DataStore V2 Engine', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', tag: 'Luau Scripting' },
                    { title: 'Custom RPG HUD UI', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', tag: 'UI / UX' },
                  ]).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <img src={item.image} alt={item.title} className="w-full h-24 rounded-lg object-cover" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{item.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold">{item.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!loading && !error && developer && (
          <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
            >
              {language === 'id' ? 'Tutup' : 'Close'}
            </button>

            {onRequestQuote && (
              <button
                onClick={() => {
                  onClose();
                  onRequestQuote(developer);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'id' ? 'Ajukan Project' : 'Contact Developer'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
