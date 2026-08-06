import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldAlert, LogOut, ArrowLeft, MessageSquare } from 'lucide-react';

interface AccountSuspendedProps {
  onBackHome: () => void;
}

export const AccountSuspended: React.FC<AccountSuspendedProps> = ({ onBackHome }) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-rose-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-rose-950 border border-rose-700/80 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
            ACCOUNT_SUSPENDED
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {language === 'id' ? 'Akun Kamu Sedang Ditangguhkan' : 'Account Suspended'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {language === 'id'
              ? 'Akses ke akun kamu ditangguhkan sementara karena memerlukan peninjauan lebih lanjut oleh tim KAEVY.'
              : 'Your account access has been suspended pending review by KAEVY STUDIO moderation.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-400 space-y-2">
          <p>
            <strong className="text-white">{language === 'id' ? 'Email Akun:' : 'Account Email:'}</strong> {user?.email}
          </p>
          <p>
            {language === 'id'
              ? 'Jika menurut kamu ini adalah kekeliruan, silakan hubungi tim dukungan KAEVY.'
              : 'If you believe this is an error, please contact KAEVY support team.'}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onBackHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'id' ? 'Kembali ke Beranda' : 'Return Home'}
          </button>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {language === 'id' ? 'Keluar Akun' : 'Log Out'}
          </button>
        </div>

      </div>
    </div>
  );
};
