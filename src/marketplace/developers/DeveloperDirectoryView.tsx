import React, { useState, useEffect } from 'react';
import { getDevelopers } from '../../lib/api';
import { DeveloperDTO, DeveloperQueryParams } from '../../types/api';
import { useLanguage } from '../../i18n/LanguageContext';
import { GlowCard } from '../../shared/ui/GlowCard';
import { MarketplacePagination } from '../shared/MarketplacePagination';
import { 
  Users, ShieldCheck, Star, Search, RefreshCw, AlertCircle, 
  Award, Code, CheckCircle2, MessageSquare 
} from 'lucide-react';

interface DeveloperDirectoryViewProps {
  onSelectDeveloperDetail?: (devId: string) => void;
  onRequestQuote?: (developer: DeveloperDTO) => void;
}

export const DeveloperDirectoryView: React.FC<DeveloperDirectoryViewProps> = ({
  onSelectDeveloperDetail,
  onRequestQuote,
}) => {
  const { language } = useLanguage();

  const [developers, setDevelopers] = useState<DeveloperDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('');
  const [tier, setTier] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchDevelopers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: DeveloperQueryParams = {
        page,
        limit: 9,
        search: search.trim() || undefined,
        specialization: specialization || undefined,
        tier: tier || undefined,
      };

      const res = await getDevelopers(params);
      if (res.success && Array.isArray(res.data)) {
        setDevelopers(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages || 1);
        }
      } else {
        throw new Error('Format data tidak sesuai.');
      }
    } catch (err: any) {
      console.error('Error fetching developers:', err);
      setError(
        language === 'id'
          ? 'Data belum berhasil dimuat. Silakan coba lagi.'
          : 'Unable to load developer data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, [page, specialization, tier]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDevelopers();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('');
    setTier('');
    setPage(1);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            {language === 'id' ? 'Direktori Developer' : 'Developer Directory'}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {language === 'id' ? 'Talenta Roblox Terverifikasi' : 'Verified Roblox Studio Talent'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'id'
              ? 'Temukan Scripter, UI Designer, dan Build Developer Roblox terverifikasi.'
              : 'Browse verified Roblox programmers, UI designers, and 3D map builders.'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'id' ? 'Cari nama atau skill...' : 'Search name or skill...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap cursor-pointer"
          >
            {language === 'id' ? 'Cari' : 'Search'}
          </button>
        </form>
      </div>

      {/* Specialization Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => { setSpecialization(''); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              specialization === '' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {language === 'id' ? 'Semua Spesialisasi' : 'All Specializations'}
          </button>
          <button
            onClick={() => { setSpecialization('Luau / Lua Scripting'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              specialization === 'Luau / Lua Scripting' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Luau / Scripting
          </button>
          <button
            onClick={() => { setSpecialization('UI / UX Design'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              specialization === 'UI / UX Design' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            UI / UX Design
          </button>
          <button
            onClick={() => { setSpecialization('3D Modeling & Map'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              specialization === '3D Modeling & Map' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            3D Map & Modeling
          </button>
        </div>

        {(search || specialization || tier) && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> {language === 'id' ? 'Reset Filter' : 'Reset Filters'}
          </button>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>{language === 'id' ? 'Memuat direktori developer...' : 'Fetching developer directory...'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-slate-800"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-8 bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-rose-900/50 text-center space-y-4 max-w-lg mx-auto my-8">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-xs text-slate-300">{error}</p>
          <button
            onClick={fetchDevelopers}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {language === 'id' ? 'Coba Lagi' : 'Try Again'}
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && developers.length === 0 && (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-8">
          <Search className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs text-slate-300">{language === 'id' ? 'Developer tidak ditemukan.' : 'No developers found.'}</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
          >
            {language === 'id' ? 'Lihat Semua' : 'Reset Search'}
          </button>
        </div>
      )}

      {/* DEVELOPERS GRID */}
      {!loading && !error && developers.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <GlowCard key={dev.id} className="p-6 flex flex-col justify-between group">
                <div className="space-y-4">
                  {/* Avatar & Tier */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={dev.userAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                        alt={dev.userDisplayName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3
                            onClick={() => onSelectDeveloperDetail && onSelectDeveloperDetail(dev.id)}
                            className="font-bold text-white group-hover:text-emerald-400 transition-colors cursor-pointer text-sm"
                          >
                            {dev.userDisplayName}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{dev.specialization}</span>
                      </div>
                    </div>

                    {dev.developerTier === 'ELITE' && (
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold font-mono shrink-0">
                        ELITE
                      </span>
                    )}
                  </div>

                  {/* Rating & Stats */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{dev.rating || 4.95}</span>
                    </div>
                    <div className="text-slate-500">•</div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{dev.completedOrders || 38} {language === 'id' ? 'Selesai' : 'Completed'}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {dev.bio}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(dev.skills || ['Luau', 'Roblox Studio']).slice(0, 3).map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-slate-950 text-emerald-400 border border-emerald-950 text-[10px] font-mono font-semibold"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectDeveloperDetail && onSelectDeveloperDetail(dev.id)}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'id' ? 'Lihat Profil' : 'View Profile'}
                  </button>

                  <button
                    onClick={() => onRequestQuote && onRequestQuote(dev)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{language === 'id' ? 'Konsultasi' : 'Contact'}</span>
                  </button>
                </div>
              </GlowCard>
            ))}
          </div>

          <MarketplacePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};
