import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { X, Lock, Mail, ShieldCheck, User, Code2, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  initialRole?: 'CLIENT' | 'DEVELOPER';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  initialRole = 'CLIENT',
  onClose,
  onSuccess
}) => {
  const {
    loginWithPassword,
    loginWithGoogle,
    loginWithDiscord,
    registerClient,
    registerDeveloper,
    switchDemoUser,
    isLoading
  } = useAuth();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [registerRole, setRegisterRole] = useState<'CLIENT' | 'DEVELOPER'>(initialRole);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [discord, setDiscord] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [specialization, setSpecialization] = useState('Luau / Lua Scripting');
  const [skillsInput, setSkillsInput] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [bio, setBio] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg(language === 'id' ? 'Silakan isi email dan kata sandi.' : 'Please enter email and password.');
      return;
    }
    try {
      await loginWithPassword({ email, password });
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setErrorMsg(language === 'id' ? 'Gagal masuk. Periksa kembali email dan kata sandi.' : 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password || !displayName) {
      setErrorMsg(language === 'id' ? 'Silakan lengkapi semua kolom wajib.' : 'Please fill out all required fields.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg(language === 'id' ? 'Kamu perlu menyetujui syarat & ketentuan KAEVY.' : 'You must accept KAEVY terms and conditions.');
      return;
    }
    try {
      await registerClient({ displayName, email, password, discord, whatsapp });
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setErrorMsg(language === 'id' ? 'Pendaftaran gagal. Silakan coba lagi.' : 'Registration failed. Please try again.');
    }
  };

  const handleRegisterDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password || !displayName || !discord) {
      setErrorMsg(language === 'id' ? 'Silakan lengkapi nama, email, kata sandi, dan username Discord.' : 'Please complete name, email, password, and Discord username.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg(language === 'id' ? 'Kamu perlu menyetujui syarat & ketentuan KAEVY.' : 'You must accept KAEVY terms and conditions.');
      return;
    }
    try {
      const skillsArr = skillsInput ? skillsInput.split(',').map(s => s.trim()) : ['Luau'];
      await registerDeveloper({
        displayName,
        email,
        password,
        discord,
        specialization,
        skills: skillsArr,
        portfolioUrl,
        bio
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setErrorMsg(language === 'id' ? 'Pendaftaran developer gagal. Silakan coba lagi.' : 'Developer registration failed. Please try again.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'discord') => {
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithDiscord();
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setErrorMsg(language === 'id' ? 'Login sosial gagal.' : 'Social login failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="p-6 pb-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {mode === 'login'
                  ? (language === 'id' ? 'Masuk ke KAEVY' : 'Login to KAEVY')
                  : (language === 'id' ? 'Buat Akun Baru' : 'Create New Account')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'id'
                  ? 'Platform & Katalog Jasa Roblox Terpercaya'
                  : 'Trusted Roblox Studio Marketplace & Platform'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="px-6 pt-4 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all ${
              mode === 'login'
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40 shadow-sm'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            {language === 'id' ? 'Masuk' : 'Login'}
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all ${
              mode === 'register'
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40 shadow-sm'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            {language === 'id' ? 'Daftar' : 'Register'}
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 flex-1">
          
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    {language === 'id' ? 'Kata Sandi' : 'Password'}
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] text-cyan-400 hover:underline">
                    {language === 'id' ? 'Lupa kata sandi?' : 'Forgot password?'}
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (language === 'id' ? 'Memproses...' : 'Processing...') : (language === 'id' ? 'Masuk ke Akun' : 'Sign In')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <div className="space-y-4">
              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'id' ? 'Pilih Jenis Akun' : 'Select Account Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('CLIENT')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      registerRole === 'CLIENT'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-xs">Client / Klien</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {language === 'id' ? 'Pesan jasa Roblox dan pantau project kamu.' : 'Order Roblox services and track projects.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterRole('DEVELOPER')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      registerRole === 'DEVELOPER'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs">Developer</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {language === 'id' ? 'Gabung sebagai developer dan kerjakan project.' : 'Join as developer and fulfill orders.'}
                    </p>
                  </button>
                </div>
              </div>

              {/* CLIENT REGISTER */}
              {registerRole === 'CLIENT' && (
                <form onSubmit={handleRegisterClient} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      {language === 'id' ? 'Nama Lengkap / Username' : 'Full Name / Display Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NovaStudios_CEO"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      {language === 'id' ? 'Kata Sandi' : 'Password'} *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Discord (Optional)</label>
                      <input
                        type="text"
                        placeholder="username#1234"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">WhatsApp (Optional)</label>
                      <input
                        type="text"
                        placeholder="+628123..."
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-[11px] text-slate-400">
                      {language === 'id'
                        ? 'Saya menyetujui Syarat Ketentuan dan Kebijakan Perlindungan Pembayaran KAEVY.'
                        : 'I agree to KAEVY Terms of Service and Escrow Payment Terms.'}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (language === 'id' ? 'Mendaftarkan...' : 'Registering...') : (language === 'id' ? 'Daftar Sebagai Klien' : 'Register as Client')}
                  </button>
                </form>
              )}

              {/* DEVELOPER REGISTER */}
              {registerRole === 'DEVELOPER' && (
                <form onSubmit={handleRegisterDeveloper} className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-[11px] text-emerald-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>
                      {language === 'id'
                        ? 'Pendaftaran developer memerlukan pemeriksaan tim. Setelah mendaftar, status kamu akan berada di PENDING_VERIFICATION.'
                        : 'Developer applications undergo team verification. Your status will be PENDING_VERIFICATION initially.'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        {language === 'id' ? 'Nama / Display Name' : 'Display Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AeroScript_Dev"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Discord Handle *</label>
                      <input
                        type="text"
                        required
                        placeholder="devname#1234"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="dev@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      {language === 'id' ? 'Kata Sandi' : 'Password'} *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      {language === 'id' ? 'Spesialisasi Utama' : 'Primary Specialization'} *
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Luau / Lua Scripting">Luau / Lua Scripting</option>
                      <option value="Environment / Map Building">Environment / Map Building</option>
                      <option value="UI/UX & Interface Systems">UI/UX & Interface Systems</option>
                      <option value="3D Modeling & Props">3D Modeling & Props</option>
                      <option value="Animation & VFX">Animation & VFX</option>
                      <option value="Full Game Architecture">Full Game Architecture</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      {language === 'id' ? 'Satu Tautan Portofolio / GitHub / Roblox' : 'Portfolio Link (GitHub / Talent Hub / Roblox)'}
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <label className="flex items-start gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] text-slate-400">
                      {language === 'id'
                        ? 'Saya menyetujui Aturan Kapasitas Maksimal 3 Project Aktif dan Kebijakan Garansi Bug.'
                        : 'I accept Developer Capacity Rules (Max 3 active projects) and Bug Warranty Commitments.'}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (language === 'id' ? 'Mengirim Pendaftaran...' : 'Submitting Application...') : (language === 'id' ? 'Daftar Sebagai Developer' : 'Submit Developer Application')}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Logins */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="text-center text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              {language === 'id' ? 'Atau Lanjut Dengan' : 'Or Continue With'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSocialLogin('google')}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span className="text-rose-400 font-black">G</span> Google
              </button>
              <button
                onClick={() => handleSocialLogin('discord')}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span className="text-indigo-400 font-black">D</span> Discord
              </button>
            </div>
          </div>

          {/* DEMO ACCOUNTS QUICK SWITCHER BAR (QA & Prototype Testing) */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Demo Quick-Switch (QA Test Mode)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => { switchDemoUser('client'); if (onSuccess) onSuccess(); onClose(); }}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/80 text-[10px] text-cyan-300 font-mono font-bold transition-all"
              >
                Demo Klien
              </button>
              <button
                type="button"
                onClick={() => { switchDemoUser('developer'); if (onSuccess) onSuccess(); onClose(); }}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-[10px] text-emerald-300 font-mono font-bold transition-all"
              >
                Demo Developer
              </button>
              <button
                type="button"
                onClick={() => { switchDemoUser('pending_developer'); if (onSuccess) onSuccess(); onClose(); }}
                className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-800/80 text-[10px] text-amber-300 font-mono font-bold transition-all"
              >
                Dev Pending
              </button>
              <button
                type="button"
                onClick={() => { switchDemoUser('admin'); if (onSuccess) onSuccess(); onClose(); }}
                className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-800/80 text-[10px] text-purple-300 font-mono font-bold transition-all"
              >
                Demo Admin
              </button>
              <button
                type="button"
                onClick={() => { switchDemoUser('suspended'); if (onSuccess) onSuccess(); onClose(); }}
                className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-[10px] text-rose-300 font-mono font-bold transition-all"
              >
                Suspended
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
