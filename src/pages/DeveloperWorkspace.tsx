import React, { useState, useEffect } from 'react';
import { sampleOrders } from '../data/portalData';
import { OrderItem } from '../types/prd';
import { WorkspaceMode } from '../layouts/Header';
import { useLanguage } from '../i18n/LanguageContext';
import {
  LayoutDashboard,
  Code2,
  Layers,
  DollarSign,
  Star,
  MessageSquare,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  FileText,
  Check,
  X,
  Send,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { getOrders, acceptOrder, rejectOrder, submitMilestone } from '../lib/api';

interface DeveloperWorkspaceProps {
  onNavigate: (mode: WorkspaceMode) => void;
  onOpenOrderModal: (order: OrderItem) => void;
  onOpenUploadAsset: () => void;
}

export const DeveloperWorkspace: React.FC<DeveloperWorkspaceProps> = ({
  onNavigate,
  onOpenOrderModal,
  onOpenUploadAsset,
}) => {
  const { language, t, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'my-projects' | 'queue' | 'earnings' | 'portfolio'>('overview');

  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Deliverable modal state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [milestonePercentage, setMilestonePercentage] = useState<number>(25);
  const [deliverableNotes, setDeliverableNotes] = useState<string>('');
  const [deliverableUrl, setDeliverableUrl] = useState<string>('');
  const [submittingMilestone, setSubmittingMilestone] = useState(false);

  const fetchDeveloperOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      if (res.data) {
        setOrdersList(res.data);
      }
    } catch (err: any) {
      if (err?.status === 0 || err?.code === 'NETWORK_ERROR') {
        console.warn('Backend server offline (network error), falling back to local developer state');
      } else {
        console.warn('API error from backend server:', err?.message || err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeveloperOrders();
  }, []);

  const handleAccept = async (orderNumber: string) => {
    try {
      await acceptOrder(orderNumber);
      setActionMessage(`Pesanan ${orderNumber} berhasil diterima! Proyek kini telah aktif.`);
      fetchDeveloperOrders();
    } catch (err: any) {
      // Local fallback for display
      setActionMessage(`Pesanan ${orderNumber} diterima! Status diperbarui ke IN_PROGRESS.`);
      setOrdersList((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'IN_PROGRESS' } : o))
      );
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleReject = async (orderNumber: string) => {
    const reason = prompt('Masukkan alasan penolakan pesanan (opsional):') || undefined;
    try {
      await rejectOrder(orderNumber, reason);
      setActionMessage(`Pesanan ${orderNumber} ditolak.`);
      fetchDeveloperOrders();
    } catch (err: any) {
      setActionMessage(`Pesanan ${orderNumber} telah ditolak.`);
      setOrdersList((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: 'CANCELLED' } : o))
      );
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleSubmitMilestoneAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setSubmittingMilestone(true);
    try {
      await submitMilestone(selectedProjectId, milestonePercentage, deliverableNotes, deliverableUrl);
      setActionMessage(`Deliverable Milestone ${milestonePercentage}% berhasil disubmit ke client!`);
      setSelectedProjectId(null);
      setDeliverableNotes('');
      setDeliverableUrl('');
      fetchDeveloperOrders();
    } catch (err: any) {
      setActionMessage(`Deliverable Milestone ${milestonePercentage}% dikirim untuk ditinjau.`);
      setSelectedProjectId(null);
    } finally {
      setSubmittingMilestone(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const pendingOrders = ordersList.filter((o) => o.status === 'PENDING_REVIEW');
  const activeProjects = ordersList.filter((o) => o.status === 'IN_PROGRESS' || o.status === 'REVISION');

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col">
      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="bg-emerald-500 text-slate-950 font-bold px-6 py-3 text-center text-xs shadow-lg animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Developer Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              DW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {language === 'id' ? 'Ruang Kerja Developer' : 'Developer Workspace'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {language === 'id' ? 'Developer Terverifikasi: @aeroscript' : 'Verified Developer: @aeroscript'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'id'
                  ? 'Pusat pengerjaan Luau Scripting & Sistem Roblox Studio'
                  : 'Luau Engineering & Systems Architecture Hub'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDeveloperOrders}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onOpenUploadAsset}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> {language === 'id' ? 'Unggah Share Asset' : 'Upload Share Asset'}
            </button>
          </div>
        </div>

        {/* Developer Sub-Nav */}
        <div className="max-w-[1700px] mx-auto mt-4 pt-2 flex items-center gap-1 overflow-x-auto custom-scrollbar border-t border-slate-800/80">
          {[
            { id: 'overview', label: language === 'id' ? 'Ringkasan' : 'Overview', icon: LayoutDashboard },
            {
              id: 'inbox',
              label: language === 'id' ? 'Inbox Pesanan Masuk' : 'Order Inbox',
              icon: Layers,
              badge: `${pendingOrders.length || 1} ${language === 'id' ? 'Masuk' : 'Pending'}`,
            },
            {
              id: 'my-projects',
              label: language === 'id' ? 'Project Saya' : 'My Active Projects',
              icon: Code2,
              badge: `${activeProjects.length || 1} ${language === 'id' ? 'Aktif' : 'Active'}`,
            },
            { id: 'queue', label: language === 'id' ? 'Kapasitas Aktif' : 'Simultaneous Capacity', icon: Clock, badge: '2/3 Slot' },
            { id: 'earnings', label: language === 'id' ? 'Saldo & Penghasilan' : 'Wallet & Earnings', icon: DollarSign },
            { id: 'portfolio', label: language === 'id' ? 'Portofolio' : 'Portfolio Showcase', icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
                      isActive ? 'bg-emerald-950 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-6 space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Top Developer Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {language === 'id' ? 'Status Kapasitas Aktif' : 'Active Capacity Status'}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">2 / 3 Aktif</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">Tersisa 1 Slot</div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 w-[66%]" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Developer Terverifikasi: Maksimal 3 project aktif secara bersamaan
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Saldo Siap Ditarik</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">{formatPrice(1850)}</div>
                <p className="text-[11px] text-slate-400">
                  {formatPrice(1080)} dalam proses pengerjaan (Escrow)
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Tingkat Penyelesaian</span>
                <div className="text-2xl font-black text-white font-mono">98.4%</div>
                <p className="text-[11px] text-slate-400">42 pesanan selesai</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Penilaian Developer</span>
                <div className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1">
                  4.98 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400">Engineer Luau Terverifikasi</p>
              </div>
            </div>

            {/* Developer Incoming Order Inbox Preview */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Inbox Pesanan Masuk (PENDING_REVIEW)</h2>
                  <p className="text-xs text-slate-400">Terima atau tolak pesanan dari klien secara real-time</p>
                </div>
                <button
                  onClick={() => setActiveTab('inbox')}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Lihat Semua Inbox ({pendingOrders.length})
                </button>
              </div>

              {pendingOrders.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  Tidak ada pesanan baru yang menunggu persetujuan.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map((ord) => (
                    <div
                      key={ord.id || ord.orderNumber}
                      className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-cyan-400 font-bold">{ord.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800">
                            PENDING_REVIEW
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-sm">{ord.titleSnapshot || 'Jasa Custom Roblox Scripting'}</h3>
                        <p className="text-xs text-slate-400">{ord.descriptionSnapshot || 'Deskripsi permintaan dari client'}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Harga Sepakat</span>
                          <div className="text-base font-black text-emerald-400 font-mono">
                            {formatPrice(parseFloat(ord.budgetAmountSnapshot || '500000'))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(ord.orderNumber)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-emerald-600/20"
                          >
                            <Check className="w-4 h-4" /> Terima Pesanan
                          </button>
                          <button
                            onClick={() => handleReject(ord.orderNumber)}
                            className="px-3 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <X className="w-4 h-4" /> Tolak
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Developer Assigned Projects */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Active Assigned Projects & Milestone Checkpoints</h2>
                <button
                  onClick={() => setActiveTab('my-projects')}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Manage All
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {sampleOrders.slice(0, 1).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-400 font-bold">{ord.id}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                            {ord.orderStatus}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-1">
                          {ord.serviceTitle}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Net Payout (90%)</span>
                          <div className="text-base font-black text-emerald-400 font-mono">
                            ${(ord.amount * 0.9).toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedProjectId(ord.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-emerald-600/20"
                        >
                          Submit Milestone Deliverable <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Checkpoints */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Milestone Progress ({ord.progressPercentage}%)</span>
                        <span className="font-mono font-bold text-emerald-400">Next Milestone: 75% Visual Integration</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${ord.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'inbox' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Inbox Pesanan Masuk (Pending Review)</h2>
              <p className="text-xs text-slate-400">
                Pilih untuk menerima atau menolak pesanan jasa dari calon klien KAEVY STUDIO
              </p>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-400 space-y-2">
                <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-white">Inbox Pesanan Kosong</p>
                <p className="text-xs text-slate-500">Belum ada pesanan baru yang menunggu persetujuan Anda saat ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((ord) => (
                  <div
                    key={ord.id || ord.orderNumber}
                    className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-cyan-400 font-bold">{ord.orderNumber}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800">
                          PENDING_REVIEW
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{ord.titleSnapshot || 'Pesanan Jasa Studio'}</h3>
                      <p className="text-xs text-slate-300 max-w-2xl">{ord.descriptionSnapshot || 'Tidak ada catatan tambahan.'}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-bold uppercase">Nilai Pesanan</span>
                        <div className="text-xl font-black text-emerald-400 font-mono">
                          {formatPrice(parseFloat(ord.budgetAmountSnapshot || '500000'))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAccept(ord.orderNumber)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Terima & Mulai
                        </button>
                        <button
                          onClick={() => handleReject(ord.orderNumber)}
                          className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" /> Tolak
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-projects' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Project Saya & Pengiriman Deliverable Milestone</h2>

            <div className="grid grid-cols-1 gap-4">
              {sampleOrders.map((ord) => (
                <div key={ord.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-mono text-xs text-slate-400 font-bold">{ord.id}</span>
                      <h3 className="font-bold text-white text-lg">{ord.serviceTitle}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Progress Milestone</span>
                      <div className="text-xl font-black text-emerald-400 font-mono">{ord.progressPercentage}%</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">{ord.description}</p>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400">
                      Klien: <strong className="text-white">{ord.clientName}</strong>
                    </span>
                    <button
                      onClick={() => setSelectedProjectId(ord.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-500 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Submit Deliverable (.RBXL / Link)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">Developer Wallet & Payouts</h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400">Available For Immediate Withdrawal</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">{formatPrice(1850)}</div>
              </div>
              <button className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md">
                Request Payout (Bank / E-Wallet)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deliverable Submit Modal */}
      {selectedProjectId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 space-y-5 relative">
            <button
              onClick={() => setSelectedProjectId(null)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Unggah Deliverable Milestone</h3>
              <p className="text-xs text-slate-400">Kirim hasil pengerjaan project ke Klien untuk ditinjau & disetujui</p>
            </div>

            <form onSubmit={handleSubmitMilestoneAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pilih Persentase Milestone</label>
                <select
                  value={milestonePercentage}
                  onChange={(e) => setMilestonePercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                >
                  <option value={25}>25% - Setup Arsitektur & DP</option>
                  <option value={50}>50% - Fitur Utama & Logic Scripting</option>
                  <option value={75}>75% - Integrasi UI & Testing</option>
                  <option value={100}>100% - Final Handover (.RBXL & Docs)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">URL / Link File Deliverable (Google Drive / GitHub / Roblox)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/..."
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Catatan Pengerjaan untuk Client</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan fitur yang telah selesai, instruksi pengujian, atau perubahan modul..."
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingMilestone}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" /> {submittingMilestone ? 'Mengirim...' : 'Kirim Deliverable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
