import React, { useState, useEffect } from 'react';
import { GlowCard } from '../../shared/ui/GlowCard';
import { useAuthContext } from '../../auth/context/AuthContext';
import { Laptop, Smartphone, Monitor, Shield, Trash2, LogOut, CheckCircle2 } from 'lucide-react';

export const ManageSessionsPage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/sessions', {
        headers: {
          Authorization: `Bearer kaevy_token_${user?.id || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/v1/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer kaevy_token_${user?.id || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Sesi berhasil dicabut.');
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    } catch (err: any) {
      setMsg(err.message || 'Gagal mencabut sesi.');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await fetch('/api/v1/auth/logout-all', {
        method: 'POST',
        headers: {
          Authorization: `Bearer kaevy_token_${user?.id || ''}`,
        },
      });
      logout();
    } catch {
      logout();
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    if (/mobile/i.test(deviceType)) return <Smartphone className="w-5 h-5 text-cyan-400" />;
    if (/tablet/i.test(deviceType)) return <Laptop className="w-5 h-5 text-cyan-400" />;
    return <Monitor className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-cyan-400" />
            Manajemen Sesi Perangkat
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Daftar perangkat yang saat ini terhubung ke akun Anda
          </p>
        </div>
        <button
          onClick={handleLogoutAll}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar Semua Perangkat
        </button>
      </div>

      {msg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {msg}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Memuat daftar sesi...</div>
      ) : sessions.length === 0 ? (
        <GlowCard className="p-8 text-center border-slate-800">
          <p className="text-slate-400 text-sm">Satu-satunya sesi aktif adalah sesi Anda saat ini.</p>
        </GlowCard>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <GlowCard key={session.id} className="p-5 border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    {getDeviceIcon(session.deviceType || 'Desktop')}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      {session.deviceType || 'Desktop Device'}
                      {session.isRememberMe && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded">
                          Remember Me
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      IP: <span className="font-mono text-slate-300">{session.ipAddress || '127.0.0.1'}</span> •{' '}
                      {session.userAgent ? session.userAgent.slice(0, 45) + '...' : 'Unknown Browser'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Terakhir Aktif:{' '}
                      {session.lastActiveAt
                        ? new Date(session.lastActiveAt).toLocaleString('id-ID')
                        : 'Baru Saja'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRevokeSession(session.id)}
                  className="p-2.5 bg-slate-950 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 rounded-xl transition-colors"
                  title="Cabut Sesi Perangkat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );
};
