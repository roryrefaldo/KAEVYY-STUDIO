import React, { useState } from 'react';
import { GlowCard } from '../../shared/ui/GlowCard';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(data.data.message || 'Instruksi reset password telah dikirim.');
        if (data.data.resetToken) {
          setGeneratedToken(data.data.resetToken);
        }
      } else {
        setError(data.error?.message || 'Gagal mengirim permintaan reset password.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-4">
            <Mail className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Lupa Password</h2>
          <p className="mt-2 text-sm text-slate-400">
            Masukkan alamat email terdaftar untuk menerima link reset password
          </p>
        </div>

        <GlowCard className="p-8 border-slate-800 bg-slate-900/80 backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {statusMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                {statusMsg}
              </div>
              {generatedToken && (
                <div className="mt-3 pt-3 border-t border-emerald-500/20 text-xs">
                  <p className="text-slate-300 mb-1">Token Reset (Pengembangan/Sistem):</p>
                  <code className="block p-2 bg-slate-950 rounded text-cyan-400 font-mono break-all">
                    {generatedToken}
                  </code>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('reset-password', { token: generatedToken })}
                      className="mt-3 w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      Lanjut Reset Password Sekarang
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Alamat Email
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:outline-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                'Mengirim...'
              ) : (
                <>
                  Kirim Instruksi Reset
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </GlowCard>

        {onNavigate && (
          <p className="text-center text-sm text-slate-400">
            Kembali ke{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Halaman Masuk
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
