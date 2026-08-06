import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Lock, ShieldAlert, ArrowLeft, UserCheck, LogIn } from 'lucide-react';

interface UnauthorizedAccessProps {
  requiredRole: 'CLIENT' | 'DEVELOPER' | 'ADMIN';
  onOpenLogin: () => void;
  onBackHome: () => void;
}

export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  requiredRole,
  onOpenLogin,
  onBackHome
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();

  const getRoleLabel = () => {
    if (requiredRole === 'ADMIN') return language === 'id' ? 'Admin' : 'Admin';
    if (requiredRole === 'DEVELOPER') return language === 'id' ? 'Developer Terverifikasi' : 'Verified Developer';
    return language === 'id' ? 'Klien' : 'Client';
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
            RESTRICTED_ACCESS
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {language === 'id' ? 'Akses Terbatas' : 'Access Restricted'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            {language === 'id'
              ? `Halaman ini hanya dapat diakses oleh pengguna dengan hak akses ${getRoleLabel()}.`
              : `This page is restricted to users with ${getRoleLabel()} authorization.`}
          </p>
        </div>

        {isAuthenticated && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            {language === 'id' ? 'Kamu saat ini masuk sebagai: ' : 'Currently logged in as: '}
            <strong className="text-white font-mono">{user?.displayName}</strong> ({user?.role})
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onBackHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'id' ? 'Kembali ke Beranda' : 'Return Home'}
          </button>

          {!isAuthenticated ? (
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
            >
              <LogIn className="w-4 h-4" />
              {language === 'id' ? 'Masuk ke Akun' : 'Sign In'}
            </button>
          ) : (
            <button
              onClick={() => { logout(); onOpenLogin(); }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              {language === 'id' ? 'Ganti Akun' : 'Switch Account'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
