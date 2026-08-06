import React, { useState } from 'react';
import { sampleShareAssets } from '../data/shareAssetsData';
import { WorkspaceMode } from '../layouts/Header';
import { IndonesiaFirstPaymentModal } from '../components/IndonesiaFirstPaymentModal';
import { useLanguage } from '../i18n/LanguageContext';

// Import Marketplace Components
import { ServiceCatalogView } from '../components/marketplace/ServiceCatalogView';
import { DeveloperDirectoryView } from '../components/marketplace/DeveloperDirectoryView';
import { ServiceDetailModal } from '../components/marketplace/ServiceDetailModal';
import { DeveloperDetailModal } from '../components/marketplace/DeveloperDetailModal';
import { ServiceDTO, DeveloperDTO } from '../types/api';

// Import UI Prototype Components
import { AnimatedMarqueeHero } from '../components/ui/AnimatedMarqueeHero';
import { MagneticDock } from '../components/ui/MagneticDock';
import { Features } from '../components/ui/Features';
import { ContainerScroll } from '../components/ui/ContainerScroll';
import { RadialOrbitalTimeline } from '../components/ui/RadialOrbitalTimeline';

import { 
  ShieldCheck, ArrowRight, Star, Sparkles, Lock, 
  Gamepad2, Users, ChevronRight, QrCode, Award
} from 'lucide-react';

interface PublicHomeProps {
  onNavigate: (mode: WorkspaceMode) => void;
  onSelectAsset: (assetId: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onNavigate, onSelectAsset }) => {
  const { language, t, formatPrice } = useLanguage();

  // Payment Modal state for public demo
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{ title: string; priceUSD: number } | null>(null);

  const handleOrderService = (title: string, priceUSD: number) => {
    setSelectedService({ title, priceUSD });
    setIsPaymentModalOpen(true);
  };

  // Detail Modals State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string | null>(null);

  const handleOrderServiceFromApi = (srv: ServiceDTO) => {
    const numericPrice = typeof srv.basePrice === 'number' ? srv.basePrice : parseFloat(srv.basePrice) || 250;
    const priceUSD = srv.baseCurrency === 'IDR' ? numericPrice / 15500 : numericPrice;
    handleOrderService(srv.title, priceUSD);
  };

  const handleDockSelect = (tabId: string) => {
    if (tabId === 'share-assets') {
      onNavigate('share-assets');
    } else if (tabId === 'get-started' || tabId === 'services') {
      onNavigate('client');
    } else {
      const el = document.getElementById(tabId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col space-y-16 pb-16">
      
      {/* SECTION 01 — Public Navbar Navigation Sub-Bar */}
      <nav className="bg-slate-900/60 border-b border-slate-800/60 px-6 py-3">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-6">
            <span className="text-cyan-400 font-bold tracking-wider uppercase">
              {language === 'id' ? 'Katalog Publik' : 'Public Marketplace'}
            </span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">
              {t('nav.home')}
            </button>
            <a href="#services" className="text-slate-400 hover:text-slate-200 transition-colors">
              {t('nav.services')}
            </a>
            <a href="#developers" className="text-slate-400 hover:text-slate-200 transition-colors">
              {t('nav.developers')}
            </a>
            <button onClick={() => onNavigate('share-assets')} className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" /> Share Assets
            </button>
            <a href="#warranty" className="text-slate-400 hover:text-slate-200 transition-colors">
              {t('nav.about')}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('client')} className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/30 transition-all flex items-center gap-1">
              {t('common.getStarted')} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 02 — HERO (AnimatedMarqueeHero Component) */}
      <AnimatedMarqueeHero
        onExploreServices={() => onNavigate('client')}
        onBrowseAssets={() => onNavigate('share-assets')}
      />

      {/* SECTION 03 — MAGNETIC QUICK EXPLORE (MagneticDock Component) */}
      <MagneticDock onSelectTab={handleDockSelect} />

      {/* SECTION 04 — WHY KAEVY (Features Component) */}
      <Features onLearnMore={() => onNavigate('client')} />

      {/* SECTION 05 — SERVICE DISCOVERY (ServiceCatalogView) */}
      <section id="services" className="px-6 lg:px-12 max-w-[1500px] mx-auto w-full space-y-6">
        <ServiceCatalogView
          onOrderService={handleOrderServiceFromApi}
          onSelectServiceDetail={(id) => setSelectedServiceId(id)}
        />
      </section>

      {/* SECTION 06 — PRODUCT SHOWCASE (ContainerScroll Component) */}
      <ContainerScroll
        titleComponent={
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              {language === 'id' ? 'Tampilan Ruang Kerja' : 'Interactive Workspace Preview'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {language === 'id' ? 'Proses Kerja Terintegrasi Dalam Satu Tempat' : 'One Structured Workflow. One Platform.'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              {language === 'id'
                ? 'Pemantauan tahapan project, alur perlindungan pembayaran, pemeriksaan hasil pekerjaan, dan garansi bug dalam satu sistem teratur.'
                : 'Real-time milestone tracking, locked escrow vaults, checkpoint uploads, and automated bug warranties integrated seamlessly into one workspace.'}
            </p>
          </div>
        }
      />

      {/* SECTION 07 — HOW KAEVY WORKS (RadialOrbitalTimeline Component) */}
      <div id="how-it-works">
        <RadialOrbitalTimeline />
      </div>

      {/* SECTION 08 — VERIFIED DEVELOPERS (DeveloperDirectoryView) */}
      <section id="developers" className="px-6 lg:px-12 max-w-[1500px] mx-auto w-full space-y-6">
        <DeveloperDirectoryView
          onSelectDeveloperDetail={(id) => setSelectedDeveloperId(id)}
          onRequestQuote={(dev) => {
            handleOrderService(`Custom Development Order - ${dev.userDisplayName}`, 500);
          }}
        />
      </section>

      {/* SECTION 09 — SHARE ASSET SHOWCASE (Dedicated Asset Hub) */}
      <section className="px-6 lg:px-12 max-w-[1500px] mx-auto w-full space-y-6">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'id' ? 'Koleksi Asset Digital' : 'First-Class Digital Asset Library'}</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {language === 'id' ? 'Jelajahi & Unduh Asset Roblox Terverifikasi' : 'Discover & Download Verified Roblox Development Assets'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'id'
                ? 'Temukan framework Luau, paket map 3D, antarmuka pengguna, dan alat Roblox Studio yang telah diperiksa keamanan malware-nya.'
                : 'Explore open-source Luau frameworks, custom PBR map packages, user interface systems, and Roblox Studio tools with full documentation and security AST scans.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('share-assets')}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                {language === 'id' ? 'Jelajahi Perpustakaan Asset' : 'Browse Share Asset Library'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            {sampleShareAssets.slice(0, 2).map((ast) => (
              <div
                key={ast.id}
                onClick={() => {
                  onNavigate('share-assets');
                  onSelectAsset(ast.id);
                }}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-3 w-full sm:w-[260px]"
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">{ast.category}</span>
                  <span className="text-slate-400 font-mono">{ast.fileSize}</span>
                </div>
                <h4 className="font-bold text-white text-xs line-clamp-2">{ast.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>{ast.downloadsCount} {language === 'id' ? 'unduhan' : 'downloads'}</span>
                  <span className="text-emerald-400 font-bold">{language === 'id' ? 'Pemeriksaan Keamanan Lolos ✓' : 'Security Scan Passed ✓'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — TRUST / PAYMENT / WARRANTY SECTION */}
      <section id="warranty" className="px-6 lg:px-12 max-w-[1500px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">
                {language === 'id' ? 'Developer Terverifikasi' : 'Verified Talent Protection'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'id'
                  ? 'Setiap developer melalui pemeriksaan portofolio, verifikasi identitas, dan peninjauan kode Luau.'
                  : 'Every developer undergoes portfolio review, identity verification, and Luau code checks.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">
                {language === 'id' ? 'Perlindungan Pembayaran KAEVY' : 'Escrow-Based Vault'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'id'
                  ? 'Pembayaran kamu mengikuti alur perlindungan KAEVY dan akan dirilis setelah kamu menyetujui hasil pekerjaan.'
                  : 'Order funds stay locked in escrow until milestone review & final RBXL signoff.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">
                {t('common.warranty30Days')}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'id'
                  ? 'Laporan bug sesuai lingkup pekerjaan awal dalam 30 hari pasca serah terima akan diperbaiki oleh developer tanpa biaya tambahan.'
                  : 'Original scope bugs reported within 30 days post-delivery are patched by the developer at zero extra fee.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — FINAL CTA */}
      <section className="px-6 lg:px-12 max-w-[1500px] mx-auto w-full text-center py-8">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {language === 'id' ? 'Siap Membangun Game Roblox Kamu?' : 'Ready to Build Something Better?'}
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
            {language === 'id'
              ? 'Gunakan jasa developer Roblox terverifikasi dengan alur pembayaran yang aman dan teratur.'
              : 'Join Roblox studio leaders and creators commissioning custom Lua scripting, 3D maps, and UI systems with escrow protection.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('client')}
              className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition-all flex items-center gap-2"
            >
              {t('common.getStarted')} <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('share-assets')}
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> {t('common.browseAssets')}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 12 — FOOTER */}
      <footer className="pt-12 border-t border-slate-800/80 max-w-[1500px] mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          <span className="font-bold text-slate-300">KAEVY STUDIO PLATFORM</span> — © 2026 Kaevy Studio Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <button onClick={() => onNavigate('share-assets')} className="hover:text-amber-400 transition-colors">Share Asset Library</button>
          <button onClick={() => onNavigate('client')} className="hover:text-white transition-colors">Client Portal</button>
          <button onClick={() => onNavigate('developer')} className="hover:text-white transition-colors">Developer Portal</button>
          <button onClick={() => onNavigate('admin')} className="hover:text-purple-400 transition-colors">Admin Console</button>
        </div>
      </footer>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        serviceId={selectedServiceId}
        onClose={() => setSelectedServiceId(null)}
        onOrderService={handleOrderServiceFromApi}
      />

      {/* Developer Detail Modal */}
      <DeveloperDetailModal
        developerId={selectedDeveloperId}
        onClose={() => setSelectedDeveloperId(null)}
        onRequestQuote={(dev) => {
          handleOrderService(`Custom Development Order - ${dev.userDisplayName}`, 500);
        }}
      />

      {/* Indonesia-First Payment Checkout Modal */}
      <IndonesiaFirstPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        projectTitle={selectedService?.title || 'Roblox Service Order'}
        amountUSD={selectedService?.priceUSD || 250}
        onPaymentSuccess={() => {
          setTimeout(() => {
            setIsPaymentModalOpen(false);
          }, 2000);
        }}
      />

    </div>
  );
};
