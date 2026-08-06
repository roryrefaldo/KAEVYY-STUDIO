import React, { useState } from 'react';
import { GlowCard } from '../../shared/ui/GlowCard';
import { MailCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface VerifyEmailPageProps {
  initialToken?: string;
  onNavigate?: (page: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ initialToken = '', onNavigate }) => {
  const [token, setToken] = useState(initialToken);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setStatus('loading');
    setMsg(null);

    try {
      const res = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMsg(data.data.message || 'Email berhasil diverifikasi!');
      } else {
        setStatus('error');
        setMsg(data.error?.message || 'Gagal memverifikasi token.');
      }
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message || 'Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-4">
            <MailCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Verifikasi Email Anda</h2>
          <p className="mt-2 text-sm text-slate-400">
            Masukkan token verifikasi yang dikirimkan ke email Anda
          </p>
        </div>

        <GlowCard className="p-8 border-slate-800 bg-slate-900/80 backdrop-blur-xl">
          {status === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              {msg}
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              {msg}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Token Verifikasi
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Masukkan token verifikasi..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:outline-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {status === 'loading' ? 'Memverifikasi...' : 'Verifikasi Email'}
            </button>
          </form>

          {status === 'success' && onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="mt-4 w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-cyan-400 rounded-xl transition-colors"
            >
              Lanjut ke Halaman Masuk
            </button>
          )}
        </GlowCard>
      </div>
    </div>
  );
};
