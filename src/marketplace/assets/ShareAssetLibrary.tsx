import React, { useState } from 'react';
import { sampleShareAssets } from '../../data/shareAssetsData';
import { ShareAssetItem, AssetCategory } from '../../types/prd';
import { useLanguage } from '../../i18n/LanguageContext';
import { Search, Sparkles, Download, Star, Filter, ShieldCheck, Plus, ChevronRight, FileCode, Tag } from 'lucide-react';

interface ShareAssetLibraryProps {
  onSelectAsset: (assetId: string) => void;
  onOpenUploadAsset: () => void;
}

const CATEGORIES: (AssetCategory | 'All')[] = [
  'All',
  'Roblox Studio',
  'Maps',
  'Models',
  'Scripts',
  'UI',
  'Systems',
  'Plugins',
  'Templates',
  'Tools',
  'Resources'
];

export const ShareAssetLibrary: React.FC<ShareAssetLibraryProps> = ({ onSelectAsset, onOpenUploadAsset }) => {
  const { language, t, formatPrice } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');

  const filteredAssets = sampleShareAssets.filter(ast => {
    const matchesCategory = selectedCategory === 'All' || ast.category === selectedCategory;
    const matchesSearch = ast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ast.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col space-y-8 p-6 lg:p-12 max-w-[1700px] mx-auto w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-500/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{language === 'id' ? 'Koleksi Asset Digital' : 'First-Class Digital Asset Library'}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {language === 'id' ? 'Perpustakaan Share Asset Roblox' : 'Roblox Share Asset Library'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {language === 'id'
              ? 'Temukan, bagikan, dan unduh script Luau, map 3D, antarmuka pengguna, dan plugin Roblox Studio terverifikasi. Semua unggahan telah melewati pemeriksaan keamanan malware.'
              : 'Discover, share, and download verified Luau scripts, 3D maps, UI suites, and Studio plugins. All community uploads undergo automated AST Lua security and malware scanning.'}
          </p>
        </div>

        <button
          onClick={onOpenUploadAsset}
          className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {language === 'id' ? 'Unggah Asset Baru' : 'Upload New Asset'}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'id' ? 'Cari asset, modul Luau, atau UI pack...' : 'Search assets, Luau modules, UI packs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset.id)}
            className="group p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 transition-all flex flex-col justify-between cursor-pointer space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              {/* Thumbnail & Badge */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80">
                <img
                  src={asset.previewUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-amber-300 font-bold">
                  {asset.category}
                </div>
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                  FREE SHARE
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-1">{asset.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{asset.description}</p>
              </div>
            </div>

            {/* Footer Stats & Creator */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{asset.rating}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{asset.downloadsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> AST Safe
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <img src={asset.creatorAvatar} alt={asset.creatorName} className="w-5 h-5 rounded-full object-cover border border-slate-700" />
                  <span className="text-xs font-semibold text-slate-300">{asset.creatorName}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
