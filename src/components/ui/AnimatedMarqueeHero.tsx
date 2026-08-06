import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Sparkles, Code2, Layers, Cpu, Box, Layout, Lock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AnimatedMarqueeHeroProps {
  onExploreServices: () => void;
  onBrowseAssets: () => void;
}

const marqueeItemsEn = [
  { icon: Code2, title: "Luau Engine Scripting", desc: "Modular, performant Lua architecture", badge: "Core Engine" },
  { icon: Box, title: "3D Environment & PBR Maps", desc: "High-detail Roblox Studio building", badge: "3D Art" },
  { icon: Layout, title: "Custom Roblox UI/UX", desc: "Responsive HUDs, shop systems & interfaces", badge: "Interface" },
  { icon: Cpu, title: "Combat & Physics Systems", desc: "Custom hitboxes, animations & replication", badge: "Gameplay" },
  { icon: Lock, title: "Escrow Payment Protection", desc: "Milestone-backed payment releases", badge: "Security" },
  { icon: Layers, title: "Verified Share Assets", desc: "Clean AST security-scanned modules", badge: "Asset Hub" },
];

const marqueeItemsId = [
  { icon: Code2, title: "Luau Engine Scripting", desc: "Arsitektur Lua modular & cepat", badge: "Scripting" },
  { icon: Box, title: "Map & Lingkungan 3D", desc: "Pembuatan map Roblox Studio detail", badge: "3D Art" },
  { icon: Layout, title: "Desain UI/UX Roblox", desc: "Desain HUD, toko, & antarmuka game", badge: "Interface" },
  { icon: Cpu, title: "Sistem Combat & Fisika", desc: "Hitbox, animasi, & sistem gameplay", badge: "Gameplay" },
  { icon: Lock, title: "Perlindungan Pembayaran", desc: "Pelepasan dana sesuai tahapan project", badge: "Keamanan" },
  { icon: Layers, title: "Aset Share Terverifikasi", desc: "Modul aman bebas malware", badge: "Koleksi Aset" },
];

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  onExploreServices,
  onBrowseAssets,
}) => {
  const { language, t } = useLanguage();
  const marqueeItems = language === 'id' ? marqueeItemsId : marqueeItemsEn;

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto w-full overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-950/50"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-mono">{t('hero.badge')}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">{t('hero.badgeSub')}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]"
        >
          {language === 'id' ? (
            <>
              Bangun Pengalaman Roblox yang Lebih Baik Bersama{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                Developer Terverifikasi.
              </span>
            </>
          ) : (
            <>
              Build Better Roblox Experiences With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                Verified Talent.
              </span>
            </>
          )}
        </motion.h1>

        {/* Supporting Description */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Call To Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={onExploreServices}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {t('hero.ctaServices')} <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onBrowseAssets}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-sm shadow-lg hover:border-amber-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> {t('hero.ctaAssets')}
          </button>
        </motion.div>

        {/* Quick Trust Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <span className="text-sm font-bold text-white block">
              {language === 'id' ? 'Perlindungan Pembayaran' : 'Escrow Protection'}
            </span>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {language === 'id' ? 'Sistem pembayaran terstruktur' : 'Escrow-based payment protection'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <span className="text-sm font-bold text-emerald-400 block">
              {language === 'id' ? 'Developer Terverifikasi' : 'Verified Network'}
            </span>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {language === 'id' ? 'Jaringan developer Roblox terkurasi' : 'Verified Developer Network'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <span className="text-sm font-bold text-cyan-400 block">
              {language === 'id' ? 'Garansi Bug 30 Hari' : '30-Day Coverage'}
            </span>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {language === 'id' ? 'Perbaikan bug gratis pasca serah terima' : '30-Day Bug Warranty'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <span className="text-sm font-bold text-amber-400 block">
              {language === 'id' ? 'Perpustakaan Asset' : 'Asset Library'}
            </span>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {language === 'id' ? 'Koleksi Share Asset siap pakai' : 'Curated Share Asset Library'}
            </p>
          </div>
        </div>
      </div>

      {/* Cinematic Marquee Carousel */}
      <div className="mt-14 relative w-full overflow-hidden mask-fade-x py-2">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-md min-w-[280px]"
              >
                <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white font-sans">{item.title}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-800 text-slate-400">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
