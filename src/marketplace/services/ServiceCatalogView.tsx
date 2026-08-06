import React, { useState, useEffect } from 'react';
import { getServices } from '../../lib/api';
import { ServiceDTO, ServiceQueryParams } from '../../types/api';
import { useLanguage } from '../../i18n/LanguageContext';
import { GlowCard } from '../../shared/ui/GlowCard';
import { MarketplacePagination } from '../shared/MarketplacePagination';
import { 
  Star, CheckCircle2, QrCode, Search, Filter, RefreshCw, AlertCircle, 
  Gamepad2, ShieldCheck, Clock 
} from 'lucide-react';

interface ServiceCatalogViewProps {
  onOrderService: (service: ServiceDTO) => void;
  onSelectServiceDetail?: (serviceId: string) => void;
}

export const ServiceCatalogView: React.FC<ServiceCatalogViewProps> = ({
  onOrderService,
  onSelectServiceDetail,
}) => {
  const { language, t } = useLanguage();

  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchCatalogServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ServiceQueryParams = {
        page,
        limit: 12,
        search: search.trim() || undefined,
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        availability: availability || undefined,
        status: 'ACTIVE',
      };

      const res = await getServices(params);
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages || 1);
          setTotalItems(res.meta.total || res.data.length);
        }
      } else {
        throw new Error('Format data tidak sesuai.');
      }
    } catch (err: any) {
      console.error('Error fetching catalog services:', err);
      setError(
        language === 'id'
          ? 'Data belum berhasil dimuat. Silakan coba lagi.'
          : 'Unable to load service data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogServices();
  }, [page, category, availability]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCatalogServices();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('');
    setPage(1);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            {language === 'id' ? 'Katalog Jasa API' : 'Live Service Marketplace'}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {language === 'id' ? 'Pilih Jasa Studio Roblox Terpercaya' : 'Commission Professional Roblox Services'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'id'
              ? 'Seluruh jasa terhubung langsung ke API server KAEVY dengan garansi 30 hari.'
              : 'All services fetched in real-time from KAEVY Studio API.'}
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
              placeholder={language === 'id' ? 'Cari jasa Luau, UI, Map...' : 'Search Luau, UI, Maps...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap cursor-pointer"
          >
            {language === 'id' ? 'Cari' : 'Search'}
          </button>
        </form>
      </div>

      {/* Category Pills & Quick Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter:
          </span>
          <button
            onClick={() => { setCategory(''); setPage(1); }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              category === '' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {language === 'id' ? 'Semua Kategori' : 'All Categories'}
          </button>
          <button
            onClick={() => { setCategory('roblox-scripting'); setPage(1); }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              category === 'roblox-scripting' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Luau / Scripting
          </button>
          <button
            onClick={() => { setCategory('ui-ux-design'); setPage(1); }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              category === 'ui-ux-design' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            UI / UX & HUD
          </button>
          <button
            onClick={() => { setCategory('3d-modeling-map'); setPage(1); }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              category === '3d-modeling-map' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            3D Map & Modeling
          </button>
        </div>

        {(search || category || minPrice || maxPrice || availability) && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> {language === 'id' ? 'Reset Filter' : 'Reset Filters'}
          </button>
        )}
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>{language === 'id' ? 'Jasa sedang dimuat...' : 'Loading services from API...'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                <div className="h-12 bg-slate-800 rounded w-full"></div>
                <div className="h-8 bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-rose-900/50 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              {language === 'id' ? 'Data belum berhasil dimuat.' : 'Unable to load data.'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchCatalogServices}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Coba Lagi' : 'Try Again'}</span>
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && services.length === 0 && (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-slate-950 text-slate-500 border border-slate-800 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              {language === 'id' ? 'Jasa belum tersedia.' : 'No services found.'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'id'
                ? 'Coba ubah pencarian atau filter yang kamu gunakan.'
                : 'Try adjusting your search terms or filters.'}
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            {language === 'id' ? 'Lihat Semua Jasa' : 'Clear Filters'}
          </button>
        </div>
      )}

      {/* SERVICE GRID */}
      {!loading && !error && services.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const numericPrice = typeof srv.basePrice === 'number' ? srv.basePrice : parseFloat(srv.basePrice) || 0;
              const formattedPriceStr = srv.baseCurrency === 'IDR'
                ? `Rp ${numericPrice.toLocaleString('id-ID')}`
                : `$${numericPrice.toLocaleString('en-US')}`;

              return (
                <GlowCard key={srv.id} className="p-6 flex flex-col justify-between group h-full">
                  <div className="space-y-4">
                    {/* Header Badge & Rating */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800 font-mono">
                        {srv.categoryName || 'Roblox Service'}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{srv.rating || 4.98}</span>
                        <span className="text-slate-500 font-normal">({srv.completedCount || 42})</span>
                      </div>
                    </div>

                    {/* Developer Info */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <img
                        src={srv.developerAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={srv.developerDisplayName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200">{srv.developerDisplayName || 'AeroScript_Dev'}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onSelectServiceDetail && onSelectServiceDetail(srv.id)}
                      className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug cursor-pointer"
                    >
                      {srv.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>

                    {/* Features checklist */}
                    {srv.features && srv.features.length > 0 && (
                      <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        {srv.features.slice(0, 3).map((ft, i) => (
                          <li key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{ft}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Card Footer: Capacity, Price, Order CTA */}
                  <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        {srv.pricingType === 'STARTING_FROM' ? t('marketplace.startingFrom') : 'Mulai Dari'}
                      </div>
                      <div className="text-lg font-black text-white font-mono">{formattedPriceStr}</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>
                          {language === 'id'
                            ? `${srv.activeQueueCount || 2} dari ${srv.maxQueueCapacity || 3} project sedang dikerjakan`
                            : `${srv.activeQueueCount || 2} / ${srv.maxQueueCapacity || 3} Active Projects`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOrderService(srv)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{t('marketplace.orderNow') || 'Pesan Jasa'}</span>
                    </button>
                  </div>
                </GlowCard>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <MarketplacePagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};
