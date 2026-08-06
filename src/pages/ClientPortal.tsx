import React, { useState, useEffect } from 'react';
import { sampleOrders, serviceMarketplaceItems, developerProfiles } from '../data/portalData';
import { OrderItem } from '../types/prd';
import { WorkspaceMode } from '../layouts/Header';
import { IndonesiaFirstPaymentModal } from '../components/IndonesiaFirstPaymentModal';
import { useLanguage } from '../i18n/LanguageContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  MessageSquare,
  CreditCard,
  Star,
  ShieldCheck,
  Sparkles,
  User,
  Clock,
  ArrowRight,
  Download,
  CheckCircle2,
  ChevronRight,
  FileText,
  AlertCircle,
  QrCode,
  RefreshCw
} from 'lucide-react';
import { ServiceCatalogView } from '../components/marketplace/ServiceCatalogView';
import { DeveloperDirectoryView } from '../components/marketplace/DeveloperDirectoryView';
import { ServiceDetailModal } from '../components/marketplace/ServiceDetailModal';
import { DeveloperDetailModal } from '../components/marketplace/DeveloperDetailModal';
import { ServiceDTO, DeveloperDTO } from '../types/api';
import { getOrders } from '../lib/api';

interface ClientPortalProps {
  onNavigate: (mode: WorkspaceMode) => void;
  onOpenOrderModal: (order: OrderItem) => void;
  onOpenShareAssets: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onNavigate, onOpenOrderModal, onOpenShareAssets }) => {
  const { language, t, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'my-orders' | 'marketplace' | 'find-developer' | 'payments' | 'warranty'>('overview');
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<{ title: string; priceUSD: number } | null>(null);

  // Detail Modals State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string | null>(null);

  // Live API Orders State
  const [clientOrders, setClientOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchClientOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await getOrders();
      if (res.data) {
        setClientOrders(res.data);
      }
    } catch (err: any) {
      if (err?.status === 0 || err?.code === 'NETWORK_ERROR') {
        console.warn('Backend server offline (network error), fallback to sample client orders');
      } else {
        console.warn('API error from backend server:', err?.message || err);
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchClientOrders();
  }, []);

  const handleOpenCheckout = (title: string, priceUSD: number) => {
    setSelectedServiceForPayment({ title, priceUSD });
    setIsPaymentModalOpen(true);
  };

  const handleOrderServiceFromApi = (srv: ServiceDTO) => {
    const numericPrice = typeof srv.basePrice === 'number' ? srv.basePrice : parseFloat(srv.basePrice) || 250;
    handleOpenCheckout(srv.title, srv.baseCurrency === 'IDR' ? numericPrice / 15500 : numericPrice);
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Client Portal Navigation Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">Portal Klien</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  Akses Sebagai NovaStudios_CEO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'id'
                  ? 'Kelola pesanan jasa, perlindungan pembayaran KAEVY, dan tiket garansi perbaikan bug kamu.'
                  : 'Manage your active commissions, escrow deposits, and bug warranties.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchClientOrders}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Client Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onNavigate('share-assets')}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> {t('common.browseAssets')}
            </button>
          </div>
        </div>

        {/* Client Portal Secondary Sub-Nav */}
        <div className="max-w-[1700px] mx-auto mt-4 pt-2 flex items-center gap-1 overflow-x-auto custom-scrollbar border-t border-slate-800/80">
          {[
            { id: 'overview', label: language === 'id' ? 'Ringkasan' : 'Overview', icon: LayoutDashboard },
            { id: 'my-orders', label: language === 'id' ? 'Pesanan Saya' : 'My Orders', icon: ShoppingBag, badge: language === 'id' ? '2 Aktif' : '2 Active' },
            { id: 'marketplace', label: language === 'id' ? 'Katalog Jasa' : 'Marketplace', icon: ShoppingBag },
            { id: 'find-developer', label: language === 'id' ? 'Cari Developer' : 'Find Developer', icon: Users },
            { id: 'payments', label: language === 'id' ? 'Pembayaran & Garansi' : 'Payments & Escrow', icon: CreditCard },
            { id: 'warranty', label: language === 'id' ? 'Garansi Bug' : 'Warranty Tickets', icon: ShieldCheck, badge: language === 'id' ? '1 Aktif' : '1 Active' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${isActive ? 'bg-blue-950 text-white' : 'bg-slate-800 text-slate-300'}`}>
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
            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">{language === 'id' ? 'Pesanan Aktif' : 'Active Orders'}</span>
                <div className="text-2xl font-black text-white font-mono">{language === 'id' ? '2 Project' : '2 Projects'}</div>
                <p className="text-[11px] text-blue-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {language === 'id' ? 'Penyerahan berikutnya dalam 3 hari' : 'Next deliverable in 3 days'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">{language === 'id' ? 'Pembayaran Dilindungi' : 'Locked in Escrow'}</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">{formatPrice(1950)}</div>
                <p className="text-[11px] text-slate-400">{language === 'id' ? 'Perlindungan Pembayaran KAEVY' : '100% Protection Guarantee'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">{language === 'id' ? 'Garansi Bug Aktif' : 'Active Warranty'}</span>
                <div className="text-2xl font-black text-cyan-400 font-mono">{language === 'id' ? 'Sisa 26 Hari' : '26 Days Left'}</div>
                <p className="text-[11px] text-slate-400">Order #KVS-20260725-009</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">{language === 'id' ? 'Pesan Baru' : 'Unread Messages'}</span>
                <div className="text-2xl font-black text-amber-400 font-mono">{language === 'id' ? '3 Baru' : '3 New'}</div>
                <p className="text-[11px] text-slate-400">Dari AeroScript_Dev</p>
              </div>
            </div>

            {/* Active Orders List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {language === 'id' ? 'Pesanan Aktif & Perkembangan Project' : 'Active Orders & Project Progress'}
                </h2>
                <button onClick={() => setActiveTab('my-orders')} className="text-xs text-blue-400 font-bold hover:underline">
                  {language === 'id' ? 'Lihat Semua Pesanan' : 'View All Orders'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {sampleOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => onOpenOrderModal(ord)}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer space-y-4 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-400 font-bold">{ord.id}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-800">
                            {ord.orderStatus}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mt-1">
                          {ord.serviceTitle}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            {language === 'id' ? 'Nilai Project' : 'Escrow Amount'}
                          </span>
                          <div className="text-base font-black text-emerald-400 font-mono">{formatPrice(ord.amount)}</div>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-blue-600/20">
                          {language === 'id' ? 'Lihat Detail Pesanan' : 'Inspect Order'} <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Checkpoints */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{language === 'id' ? 'Tahapan Pengerjaan Project' : 'Project Milestone Progress'}</span>
                        <span className="font-mono font-bold text-blue-400">{ord.progressPercentage}% {language === 'id' ? 'Selesai' : 'Completed'}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all" style={{ width: `${ord.progressPercentage}%` }} />
                      </div>
                    </div>

                    {/* Assigned Developer & Deadline */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-2">
                      <div className="flex items-center gap-3">
                        <img src={ord.developerAvatar} alt={ord.developerName} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                        <div>
                          <span className="text-slate-400">{language === 'id' ? 'Developer:' : 'Assigned Developer: '}</span>
                          <span className="text-white font-bold">{ord.developerName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-slate-400">
                        <span>{language === 'id' ? 'Batas Waktu:' : 'Deadline:'} <strong className="text-white font-mono">{ord.deadline}</strong></span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> {ord.messagesCount} {language === 'id' ? 'Pesan' : 'Messages'}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Quick Marketplace & Developer Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">Popular Marketplace Services</h3>
                  <button onClick={() => setActiveTab('marketplace')} className="text-xs text-blue-400 font-bold hover:underline">Explore All</button>
                </div>
                <div className="space-y-3">
                  {serviceMarketplaceItems.slice(0, 2).map((srv) => (
                    <div key={srv.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-white text-xs">{srv.title}</h4>
                        <span className="text-[11px] text-slate-400">Est. {srv.estimatedDays} days • {srv.completedCount} finished</span>
                      </div>
                      <span className="font-mono font-bold text-white text-xs">${srv.startingPrice}+</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">Top Available Developers</h3>
                  <button onClick={() => setActiveTab('find-developer')} className="text-xs text-blue-400 font-bold hover:underline">Browse Directory</button>
                </div>
                <div className="space-y-3">
                  {developerProfiles.slice(0, 2).map((dev) => (
                    <div key={dev.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={dev.avatar} alt={dev.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <h4 className="font-bold text-white text-xs flex items-center gap-1">{dev.name} <ShieldCheck className="w-3 h-3 text-emerald-400" /></h4>
                          <span className="text-[11px] text-slate-400 font-mono">{dev.handle}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">{dev.activeQueueCount}/{dev.maxQueueCapacity} Capacity</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </>
        )}

        {activeTab === 'my-orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">All Client Orders</h2>
            <div className="grid grid-cols-1 gap-4">
              {sampleOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => onOpenOrderModal(ord)}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-mono text-slate-400">{ord.id}</span>
                      <h3 className="text-lg font-bold text-white">{ord.serviceTitle}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Amount</span>
                      <div className="text-xl font-black text-emerald-400 font-mono">${ord.amount}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{ord.description}</p>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold">
                    Open Interactive Order Brief & Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <ServiceCatalogView
            onOrderService={handleOrderServiceFromApi}
            onSelectServiceDetail={(id) => setSelectedServiceId(id)}
          />
        )}

        {activeTab === 'find-developer' && (
          <DeveloperDirectoryView
            onSelectDeveloperDetail={(id) => setSelectedDeveloperId(id)}
            onRequestQuote={(dev) => {
              handleOpenCheckout(`Custom Development Order - ${dev.userDisplayName}`, 500);
            }}
          />
        )}

        {activeTab === 'payments' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">Payment Ledger & Escrow Status</h2>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">Order #KVS-20260731-001</span>
                  <p className="text-slate-400">Locked in Escrow Vault</p>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-base">$1,200.00</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">Order #KVS-20260728-004</span>
                  <p className="text-slate-400">Locked in Escrow Vault (Pending Review)</p>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-base">$750.00</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">Active 30-Day Bug Warranty Protection</h2>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Order #KVS-20260725-009 (Pet Trading System)</span>
                <span className="text-cyan-400 font-bold">26 Days Warranty Remaining</span>
              </div>
              <p className="text-xs text-slate-400">You can submit bug reports to your assigned developer for free fixes within 30 days of completion.</p>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold mt-2">Submit Warranty Bug Ticket</button>
            </div>
          </div>
        )}

      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        serviceId={selectedServiceId}
        onClose={() => setSelectedServiceId(null)}
        onOrderService={handleOrderServiceFromApi}
      />

      {/* Developer Detail Modal */}
      <DeveloperDetailModal
        developerId={selectedDeveloperId}
        onClose={() => setSelectedDeveloperId(null)}
        onRequestQuote={(dev) => {
          handleOpenCheckout(`Custom Development Order - ${dev.userDisplayName}`, 500);
        }}
      />

      {/* Indonesia-First Payment Checkout Modal */}
      <IndonesiaFirstPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        projectTitle={selectedServiceForPayment?.title || 'Roblox Service Order'}
        amountUSD={selectedServiceForPayment?.priceUSD || 250}
        onPaymentSuccess={() => {
          setTimeout(() => {
            setIsPaymentModalOpen(false);
          }, 2000);
        }}
      />

    </div>
  );
};
