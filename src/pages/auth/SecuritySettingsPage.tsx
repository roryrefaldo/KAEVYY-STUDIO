import React, { useState } from 'react';
import { GlowCard } from '../../shared/ui/GlowCard';
import { useAuthContext } from '../../auth/context/AuthContext';
import { ShieldCheck, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { ManageSessionsPage } from './ManageSessionsPage';

export const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'password' | 'sessions' | 'oauth'>('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer kaevy_token_${user?.id || ''}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.data.message || 'Password berhasil diubah.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error?.message || 'Gagal mengubah password.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-cyan-400" />
          Pengaturan Keamanan Akun
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Kelola password, sesi aktif, dan kredensial OAuth terhubung
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'password'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'sessions'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sesi Perangkat
        </button>
        <button
          onClick={() => setActiveTab('oauth')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'oauth'
              ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          OAuth Terhubung
        </button>
      </div>

      {activeTab === 'password' && (
        <GlowCard className="p-8 border-slate-800 bg-slate-900/80">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            Ubah Password
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {msg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              {msg}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password Saat Ini
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter, 1 huruf besar & angka"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-6 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Memperbarui...' : 'Perbarui Password'}
            </button>
          </form>
        </GlowCard>
      )}

      {activeTab === 'sessions' && <ManageSessionsPage />}

      {activeTab === 'oauth' && (
        <GlowCard className="p-8 border-slate-800 bg-slate-900/80 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Akun OAuth Terhubung
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Google OAuth</h4>
                  <p className="text-xs text-slate-400">Terhubung untuk masuk instan</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Terhubung
              </span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Discord OAuth</h4>
                  <p className="text-xs text-slate-400">Terhubung untuk Roblox Developer Services</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Terhubung
              </span>
            </div>
          </div>
        </GlowCard>
      )}
    </div>
  );
};
