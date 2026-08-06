import React, { useState } from 'react';
import { ShareAssetItem } from '../../types/prd';
import { useLanguage } from '../../i18n/LanguageContext';
import { ArrowLeft, Download, Share2, ShieldCheck, Star, FileText, CheckCircle2, Copy, BookOpen, Clock, Tag } from 'lucide-react';

interface AssetDetailPageProps {
  asset: ShareAssetItem;
  onBack: () => void;
}

export const AssetDetailPage: React.FC<AssetDetailPageProps> = ({ asset, onBack }) => {
  const { language, t } = useLanguage();
  const [downloadCount, setDownloadCount] = useState(asset.downloadsCount);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [activeDocIndex, setActiveDocIndex] = useState(0);

  const handleDownload = () => {
    if (!hasDownloaded) {
      setDownloadCount(prev => prev + 1);
      setHasDownloaded(true);
    }
    // Simulate downloading digital asset archive
    const dummyContent = `# ${asset.title}\nVersion: ${asset.version}\nDownloaded from KAEVY STUDIO Platform.\nSecurity Check: PASSED AST LUA SCAN.`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.title.toLowerCase().replace(/[^a-z0-0]/g, '_')}_v${asset.version}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col space-y-8 p-6 lg:p-12 max-w-[1500px] mx-auto w-full">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors self-start cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> {language === 'id' ? 'Kembali ke Perpustakaan Share Asset' : 'Back to Share Asset Library'}
      </button>

      {/* Hero Asset Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-800">
                {asset.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950 text-slate-300 font-mono border border-slate-800">
                v{asset.version}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Passed AST Malware Scan
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{asset.title}</h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{asset.description}</p>

            {/* Creator Profile */}
            <div className="flex items-center gap-4 pt-2">
              <img src={asset.creatorAvatar} alt={asset.creatorName} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                  <span>{asset.creatorName}</span>
                  {asset.isVerifiedCreator && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                </div>
                <span className="text-xs text-slate-400">Uploaded {asset.createdAt} • Updated {asset.updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Download Action & Stats Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 w-full lg:w-[320px] shrink-0">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>File Format:</span>
                <strong className="text-amber-300 font-mono">{asset.fileFormat}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Archive Size:</span>
                <strong className="text-white font-mono">{asset.fileSize}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>License:</span>
                <strong className="text-slate-200">{asset.license}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Downloads:</span>
                <strong className="text-white font-mono">{downloadCount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Rating:</span>
                <strong className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {asset.rating} / 5.0
                </strong>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{hasDownloaded ? 'Download Again (.ZIP)' : 'Download Digital Asset (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
          <Tag className="w-4 h-4 text-slate-500" />
          {asset.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 1 to 10 Documentation Sections Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Doc Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Dokumentasi Modul</span>
          </div>
          <div className="space-y-1">
            {asset.documentationSections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveDocIndex(idx)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeDocIndex === idx
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                <span className="line-clamp-1">{sec.title}</span>
                <span className="font-mono text-[10px] opacity-70">Sec {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Doc Content Display */}
        <div className="lg:col-span-3 p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">{asset.documentationSections[activeDocIndex]?.title}</h2>
            <span className="text-xs font-mono text-slate-400">Section {activeDocIndex + 1} of {asset.documentationSections.length}</span>
          </div>

          <div className="text-sm text-slate-300 leading-relaxed font-mono bg-slate-950 p-6 rounded-2xl border border-slate-800/80 whitespace-pre-wrap">
            {asset.documentationSections[activeDocIndex]?.content}
          </div>
        </div>

      </div>

    </div>
  );
};
