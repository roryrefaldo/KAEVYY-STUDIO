import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Clock, ShieldAlert, CheckCircle2, FileText, Code2, ArrowLeft, LogOut } from 'lucide-react';

interface DeveloperPendingVerificationProps {
  onBackHome: () => void;
}

export const DeveloperPendingVerification: React.FC<DeveloperPendingVerificationProps> = ({ onBackHome }) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();

  const devProfile = user?.developerProfile;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
              PENDING_VERIFICATION
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {language === 'id' ? 'Pengajuan Developer Sedang Diperiksa' : 'Developer Application Under Review'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === 'id'
                ? 'Profil dan portofolio kamu sedang diperiksa oleh tim KAEVY STUDIO.'
                : 'Your profile and portfolio application are currently being reviewed by the KAEVY STUDIO moderation team.'}
            </p>
          </div>
        </div>

        {/* Submitted Data Summary */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            {language === 'id' ? 'Ringkasan Pendaftaran Kamu' : 'Your Submitted Application Summary'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500">{language === 'id' ? 'Nama Developer:' : 'Developer Name:'}</span>
              <p className="font-bold text-white font-mono">{user?.displayName}</p>
            </div>
            <div>
              <span className="text-slate-500">Email:</span>
              <p className="font-bold text-white font-mono">{user?.email}</p>
            </div>
            <div>
              <span className="text-slate-500">{language === 'id' ? 'Spesialisasi:' : 'Specialization:'}</span>
              <p className="font-bold text-emerald-400">{devProfile?.specialization || 'Luau Scripting'}</p>
            </div>
            <div>
              <span className="text-slate-500">{language === 'id' ? 'Waktu Pengajuan:' : 'Submitted At:'}</span>
              <p className="font-bold text-slate-300">{devProfile?.submittedAt || 'Terbaru'}</p>
            </div>
          </div>
        </div>

        {/* Verification Checklist Steps */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            {language === 'id' ? 'Tahapan Verifikasi KAEVY' : 'KAEVY Verification Workflow'}
          </h3>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">{language === 'id' ? 'Pendaftaran Dikirim' : 'Application Submitted'}</p>
                <p className="text-slate-400">{language === 'id' ? 'Data profil dan informasi akun telah diterima.' : 'Profile data and credentials received.'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/80 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 animate-spin" />
              <div className="text-xs">
                <p className="font-bold text-amber-300">{language === 'id' ? 'Pemeriksaan Portofolio & Keahlian' : 'Portfolio & Skill Review'}</p>
                <p className="text-slate-400">{language === 'id' ? 'Tim admin sedang memverifikasi standar kualitas pengerjaan.' : 'Admin team is verifying work quality standards.'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 opacity-60 flex items-center gap-3">
              <Code2 className="w-5 h-5 text-slate-500 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-400">{language === 'id' ? 'Akses Ruang Kerja Developer Diberikan' : 'Developer Workspace Unlocked'}</p>
                <p className="text-slate-500">{language === 'id' ? 'Kamu dapat mengambil project aktif dan pesanan klien.' : 'You can claim available project tickets and serve clients.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onBackHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'id' ? 'Kembali ke Beranda Utama' : 'Return to Public Home'}
          </button>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {language === 'id' ? 'Keluar Akun' : 'Log Out'}
          </button>
        </div>

      </div>
    </div>
  );
};
