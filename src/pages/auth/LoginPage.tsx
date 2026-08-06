import React, { useState } from 'react';
import { GlowCard } from '../../shared/ui/GlowCard';
import { useAuthContext } from '../../auth/context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles, CheckSquare, Square } from 'lucide-react';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginWithPassword, loginWithGoogle, loginWithDiscord, isLoading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Email wajib diisi.');
      return;
    }
    try {
      await loginWithPassword({ email, password, rememberMe });
      if (onNavigate) onNavigate('home');
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
    }
  };

  const handleOAuth = async (provider: 'google' | 'discord') => {
    setError(null);
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithDiscord();
      if (onNavigate) onNavigate('home');
    } catch (err: any) {
      setError(err.message || `Gagal masuk dengan ${provider}.`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Masuk ke KAEVY STUDIO</h2>
          <p className="mt-2 text-sm text-slate-400">
            Akses marketplace asset & layanan developer Roblox terverifikasi
          </p>
        </div>

        <GlowCard className="p-8 border-slate-800 bg-slate-900/80 backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Lupa Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                {rememberMe ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600" />
                )}
                Ingat Saya (Remember Me)
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                'Memproses...'
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-slate-500 font-mono">Atau Masuk Dengan</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('discord')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Discord
              </button>
            </div>
          </div>
        </GlowCard>

        {onNavigate && (
          <p className="text-center text-sm text-slate-400">
            Belum memiliki akun?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Daftar Sekarang
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
