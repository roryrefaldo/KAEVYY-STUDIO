import React, { useState } from 'react';
import { DocSection, AssetCategory } from '../../types/prd';
import { useLanguage } from '../../i18n/LanguageContext';
import { ArrowLeft, Upload, Plus, Trash2, ShieldCheck, CheckCircle2, FileArchive, Sparkles, AlertCircle } from 'lucide-react';

interface UploadAssetPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

const CATEGORIES: AssetCategory[] = [
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

export const UploadAssetPage: React.FC<UploadAssetPageProps> = ({ onBack, onSuccess }) => {
  const { language, t } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Systems');
  const [version, setVersion] = useState('1.0.0');
  const [license, setLicense] = useState('MIT License');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('Framework, Luau, Studio');

  // Dynamic 1 to 10 Documentation Sections
  const [docSections, setDocSections] = useState<DocSection[]>([
    {
      id: 'doc-1',
      title: '1. Installation & Setup Overview',
      content: 'Place the module inside ReplicatedStorage and require it from a ServerScriptService script.'
    }
  ]);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>({
    name: 'KaevyModulePackage_v1.0.0.zip',
    size: '14.2 MB',
    type: 'ZIP Archive (Recommended)'
  });
  const [uploadProgress, setUploadProgress] = useState(100);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'passed'>('passed');

  const addDocSection = () => {
    if (docSections.length >= 10) return;
    const newId = `doc-${docSections.length + 1}`;
    setDocSections(prev => [
      ...prev,
      {
        id: newId,
        title: `${prev.length + 1}. New Documentation Section`,
        content: 'Enter section markdown or usage instructions here...'
      }
    ]);
  };

  const removeDocSection = (index: number) => {
    if (docSections.length <= 1) return;
    setDocSections(prev => prev.filter((_, i) => i !== index));
  };

  const updateDocSection = (index: number, field: 'title' | 'content', val: string) => {
    setDocSections(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleSimulateFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSelectedFile({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.endsWith('.zip') ? 'ZIP Archive (Recommended)' : f.name.split('.').pop()?.toUpperCase() || 'FILE'
      });
      setScanState('scanning');
      setTimeout(() => {
        setScanState('passed');
      }, 1200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Please provide an Asset Title.");
      return;
    }
    alert("Asset successfully uploaded! State: [PENDING MODERATION] — Admin review queue notified.");
    onSuccess();
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col space-y-8 p-6 lg:p-12 max-w-[1400px] mx-auto w-full">
      
      {/* Back CTA */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors self-start cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> {language === 'id' ? 'Kembali' : 'Back'}
      </button>

      {/* Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Formulir Unggah Asset Komunitas</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {language === 'id' ? 'Unggah Share Asset Roblox Baru' : 'Publish Roblox Share Asset'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          {language === 'id'
            ? 'Publikasikan modul Luau, asset map, UI pack, atau plugin kamu. Semua unggahan akan dipindai oleh sistem AST LUA anti-malware otomatis.'
            : 'Publish Luau modules, maps, UI packs or plugins. Submissions undergo AST Lua security scans.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Metadata Fields */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">1. Rincian & Identitas Asset</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Judul Asset *</label>
              <input
                type="text"
                required
                placeholder="misal: Advanced Luau Datastore V2 Engine"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Kategori Asset *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as AssetCategory)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Versi Rilis *</label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Lisensi Penggunaan *</label>
              <input
                type="text"
                value={license}
                onChange={e => setLicense(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Deskripsi Singkat Asset *</label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan kegunaan utama dan fitur unggulan dari asset ini..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Tag Pencarian (Dipisahkan koma)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* File Archive Upload Section */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">2. Unggah File Digital Archive (.ZIP)</h2>

          <div className="p-8 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-amber-500/50 transition-colors text-center space-y-4">
            <FileArchive className="w-12 h-12 text-amber-400 mx-auto" />
            <div>
              <p className="text-xs font-bold text-white">Tarik dan lepas file .ZIP asset di sini, atau klik untuk memilih file</p>
              <p className="text-[11px] text-slate-500 mt-1">Maksimal ukuran file: 250 MB (.zip, .rbxm, .rbxmx)</p>
            </div>
            <input
              type="file"
              onChange={handleSimulateFileDrop}
              className="hidden"
              id="asset-file-input"
            />
            <label
              htmlFor="asset-file-input"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4" /> Pilih File Digital
            </label>
          </div>

          {selectedFile && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileArchive className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedFile.name}</h4>
                  <p className="text-[10px] text-slate-400">{selectedFile.size} • {selectedFile.type}</p>
                </div>
              </div>

              {scanState === 'scanning' && (
                <span className="text-xs text-amber-400 font-mono animate-pulse">Scanning AST LUA...</span>
              )}
              {scanState === 'passed' && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security Check Passed
                </span>
              )}
            </div>
          )}
        </div>

        {/* 1 to 10 Documentation Sections Suite */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white">3. Dokumentasi Panduan Penggunaan (1 hingga 10 Bagian)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sediakan panduan langkah-demi-langkah bagi pengunduh asset.</p>
            </div>
            <button
              type="button"
              onClick={addDocSection}
              disabled={docSections.length >= 10}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Bagian Doc ({docSections.length}/10)
            </button>
          </div>

          <div className="space-y-6">
            {docSections.map((sec, idx) => (
              <div key={sec.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">BAGIAN DOKUMENTASI #{idx + 1}</span>
                  {docSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocSection(idx)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Judul Bagian #{idx + 1}</label>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={e => updateDocSection(idx, 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Isi Petunjuk & Panduan Kode Bagian #{idx + 1}</label>
                  <textarea
                    rows={4}
                    value={sec.content}
                    onChange={e => updateDocSection(idx, 'content', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
          >
            Kirim Asset untuk Moderasi
          </button>
        </div>

      </form>
    </div>
  );
};
