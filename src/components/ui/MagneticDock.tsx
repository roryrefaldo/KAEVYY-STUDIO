import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Gamepad2, Users, Sparkles, ShieldCheck, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface MagneticDockProps {
  onSelectTab: (tabId: string) => void;
}

export const MagneticDock: React.FC<MagneticDockProps> = ({ onSelectTab }) => {
  const mouseX = useMotionValue(Infinity);
  const { language } = useLanguage();

  const dockItems = [
    { id: 'services', label: language === 'id' ? 'Jasa' : 'Services', icon: Gamepad2, color: 'text-cyan-400', bg: 'bg-cyan-950/80', border: 'border-cyan-800/80' },
    { id: 'developers', label: language === 'id' ? 'Developer' : 'Developers', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-950/80', border: 'border-emerald-800/80' },
    { id: 'share-assets', label: 'Share Asset', icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-950/80', border: 'border-amber-800/80' },
    { id: 'how-it-works', label: language === 'id' ? 'Alur Kerja' : 'How It Works', icon: Lock, color: 'text-blue-400', bg: 'bg-blue-950/80', border: 'border-blue-800/80' },
    { id: 'warranty', label: language === 'id' ? 'Garansi Bug' : 'Warranty', icon: ShieldCheck, color: 'text-teal-400', bg: 'bg-teal-950/80', border: 'border-teal-800/80' },
    { id: 'payment', label: language === 'id' ? 'Pembayaran' : 'Payment', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-950/80', border: 'border-purple-800/80' },
    { id: 'get-started', label: language === 'id' ? 'Mulai Sekarang' : 'Get Started', icon: ArrowRight, color: 'text-white', bg: 'bg-cyan-600', border: 'border-cyan-500' },
  ];

  return (
    <section className="px-4 lg:px-12 max-w-[1500px] mx-auto w-full space-y-4">
      <div className="text-center space-y-1">
        <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">
          {language === 'id' ? 'Pintas Navigasi' : 'Quick Platform Navigation'}
        </span>
        <h3 className="text-lg font-bold text-white">
          {language === 'id' ? 'Jelajahi KAEVY Studio' : 'Explore KAEVY Studio'}
        </h3>
      </div>

      {/* Desktop Magnetic Dock */}
      <div className="hidden md:flex justify-center">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-2xl"
        >
          {dockItems.map((item) => (
            <DockIcon key={item.id} mouseX={mouseX} item={item} onClick={() => onSelectTab(item.id)} />
          ))}
        </motion.div>
      </div>

      {/* Mobile Horizontal Scroll Dock */}
      <div className="flex md:hidden overflow-x-auto custom-scrollbar py-2 gap-2 px-2">
        {dockItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 ${item.bg} ${item.border} ${item.color}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

interface DockItem {
  id: string;
  label: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
}

const DockIcon: React.FC<{ mouseX: any; item: DockItem; onClick: () => void }> = ({ mouseX, item, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 72, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer border shadow-lg transition-colors ${item.bg} ${item.border}`}
    >
      <Icon className={`w-5 h-5 ${item.color}`} />
      
      {/* Label Tooltip */}
      <span className="absolute -top-9 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
        {item.label}
      </span>
    </motion.div>
  );
}
