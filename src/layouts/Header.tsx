import React, { useState } from 'react';
import { Globe, User, Code2, ShieldAlert, Package, Languages, LogIn, ChevronDown, Sparkles, LogOut } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export type WorkspaceMode = 'public' | 'client' | 'developer' | 'admin' | 'share-assets';

interface HeaderProps {
  currentMode: WorkspaceMode;
  onSelectMode: (mode: WorkspaceMode) => void;
  onOpenUploadAsset?: () => void;
  onOpenAuthModal?: (initialMode?: 'login' | 'register', initialRole?: 'CLIENT' | 'DEVELOPER') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onSelectMode, onOpenAuthModal }) => {
  const { language, setLanguage, currency, setCurrency, t } = useLanguage();
  const { user, isAuthenticated, role, logout } = useAuth();
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);

  const getRoleBadge = () => {
    if (role === 'ADMIN') {
      return { label: 'Admin', bg: 'bg-purple-950 text-purple-300 border-purple-800' };
    }
    if (role === 'DEVELOPER') {
      const status = user?.developerProfile?.verificationStatus;
      if (status === 'VERIFIED' || status === 'ELITE') {
        return { label: language === 'id' ? 'Dev Terverifikasi' : 'Verified Dev', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      }
      return { label: language === 'id' ? 'Dev Menunggu Review' : 'Pending Dev', bg: 'bg-amber-950 text-amber-300 border-amber-800' };
    }
    return { label: 'Client', bg: 'bg-blue-950 text-blue-300 border-blue-800' };
  };

  const handleNavClick = (sectionId: string) => {
    if (currentMode !== 'public') {
      onSelectMode('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand & Platform Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectMode('public')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-600/30 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400 font-black text-xl tracking-tighter">
                K
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white uppercase font-mono">
                  KAEVY<span className="text-cyan-400">.STUDIO</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                  PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Roblox Development & Digital Service Platform</p>
            </div>
          </div>
        </div>

        {/* Public Navigation Links */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
          <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
            
            <button
              onClick={() => {
                onSelectMode('public');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                currentMode === 'public'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {t('nav.home')}
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all whitespace-nowrap font-bold"
            >
              {t('nav.services')}
            </button>

            <button
              onClick={() => handleNavClick('developers')}
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all whitespace-nowrap font-bold"
            >
              {t('nav.developers')}
            </button>

            <button
              onClick={() => onSelectMode('share-assets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                currentMode === 'share-assets'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-amber-400 hover:bg-amber-950/40 hover:text-amber-300'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t('nav.shareAsset')}</span>
            </button>

            <button
              onClick={() => handleNavClick('warranty')}
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all whitespace-nowrap font-bold"
            >
              {t('nav.about')}
            </button>

          </div>

          {/* Secondary Actions: Language, Currency, Login & Get Started */}
          <div className="flex items-center gap-2">
            
            {/* Language & Currency Switches */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <Languages className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-1" />
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    language === 'id' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Bahasa Indonesia"
                >
                  ID 🇮🇩
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    language === 'en' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="English"
                >
                  EN 🇺🇸
                </button>
              </div>

              {/* Currency Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setCurrency('IDR')}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    currency === 'IDR' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Indonesian Rupiah (Rp)"
                >
                  IDR (Rp)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    currency === 'USD' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="US Dollar ($)"
                >
                  USD ($)
                </button>
              </div>

            </div>

            {/* AUTHENTICATED USER MENU or LOGIN / REGISTER BUTTONS */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-xs"
                >
                  <img src={user.avatar} alt={user.displayName} className="w-6 h-6 rounded-full object-cover border border-slate-700" />
                  <span className="font-bold text-white max-w-[120px] truncate">{user.displayName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getRoleBadge().bg}`}>
                    {getRoleBadge().label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isLoginMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in duration-150"
                    onMouseLeave={() => setIsLoginMenuOpen(false)}
                  >
                    <div className="p-2.5 border-b border-slate-800 mb-1 space-y-0.5">
                      <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                    </div>

                    {/* Workspace Direct Links */}
                    {role === 'CLIENT' && (
                      <button
                        onClick={() => { onSelectMode('client'); setIsLoginMenuOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                          currentMode === 'client' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>Portal Klien</span>
                      </button>
                    )}

                    {role === 'DEVELOPER' && (
                      <button
                        onClick={() => { onSelectMode('developer'); setIsLoginMenuOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                          currentMode === 'developer' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ruang Kerja Developer</span>
                      </button>
                    )}

                    {role === 'ADMIN' && (
                      <>
                        <button
                          onClick={() => { onSelectMode('admin'); setIsLoginMenuOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                            currentMode === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                          <span>Konsol Admin</span>
                        </button>
                        <button
                          onClick={() => { onSelectMode('client'); setIsLoginMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Lihat Sebagai Klien</span>
                        </button>
                        <button
                          onClick={() => { onSelectMode('developer'); setIsLoginMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Lihat Sebagai Developer</span>
                        </button>
                      </>
                    )}

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setIsLoginMenuOpen(false);
                          onSelectMode('public');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'id' ? 'Keluar Akun' : 'Log Out'}</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('nav.login')}</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all flex items-center gap-1.5"
                >
                  <span>{t('common.getStarted')}</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};
