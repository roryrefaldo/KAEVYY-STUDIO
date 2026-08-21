import React, { useState } from 'react';
import { GlowCard } from '../../shared/ui/GlowCard';
import { useAuthContext } from '../../auth/context/AuthContext';
import { User, Code2, Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  onNavigate?: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { registerClient, registerDeveloper, isLoading } = useAuthContext();
  const [role, setRole] = useState<'CLIENT' | 'DEVELOPER'>('CLIENT');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [specialization, setSpecialization] = useState('Luau / Lua Scripting');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !displayName || !password) {
      setError('Email, Nama Tampilan, dan Password wajib diisi.');
      return;
    }

    try {
      if (role === 'CLIENT') {
        await registerClient({
          email,
          displayName,
          password,
          companyName,
          discordUsername,
        });
      } else {
        await registerDeveloper({
          email,
          displayName,
          password,
          specialization,
          bio: 'Pengembang Roblox Studio Terverifikasi',
          skills: [specialization, 'Roblox Studio'],
        });
      }
      setSuccessMsg('Registrasi berhasil! Silakan periksa email Anda untuk verifikasi.');
      setTimeout(() => {
        if (onNavigate) onNavigate('home');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Buat Akun KAEVY STUDIO</h2>
          <p className="mt-2 text-sm text-slate-400">
            Bergabung dengan platform Roblox Developer Services & Marketplace
          </p>
        </div>

        <GlowCard className="p-8 border-slate-800 bg-slate-900/80 backdrop-blur-xl">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('CLIENT')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                role === 'CLIENT'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Akun Klien / Game Owner
            </button>
            <button
              type="button"
              onClick={() => setRole('DEVELOPER')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                role === 'DEVELOPER'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Akun Developer / Scripter
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Nama Tampilan / Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Contoh: KaevyDeveloper"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter, huruf besar & angka"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {role === 'CLIENT' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Nama Perusahaan / Studio (Opsional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: Nova Studios ID"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Username Discord (Opsional)
                  </label>
                  <input
                    type="text"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    placeholder="username#0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Spesialisasi Utama
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="Luau / Lua Scripting">Luau / Lua Scripting</option>
                  <option value="Roblox UI Design">Roblox UI & Interface</option>
                  <option value="Building & 3D Modeling">Building & 3D Modeling</option>
                  <option value="Anti-Cheat & Security">Anti-Cheat & System Audit</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-4 py-3.5 px-4 font-semibold rounded-xl focus:outline-none transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                role === 'CLIENT'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-amber-500/20 hover:from-amber-400 hover:to-orange-500'
              }`}
            >
              {isLoading ? (
                'Membuat Akun...'
              ) : (
                <>
                  Daftar Akun {role === 'CLIENT' ? 'Klien' : 'Developer'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </GlowCard>

        {onNavigate && (
          <p className="text-center text-sm text-slate-400">
            Sudah memiliki akun?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Masuk
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
