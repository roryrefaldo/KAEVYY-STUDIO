import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Building2, 
  Wallet, 
  CreditCard, 
  Copy, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  X,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type PaymentChannel = 'qris' | 'bca_va' | 'mandiri_va' | 'bri_va' | 'gopay' | 'dana' | 'paypal';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'EXPIRED' | 'FAILED';

interface IndonesiaFirstPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
  projectTitle?: string;
  amountUSD?: number; // Base amount in USD
  onPaymentSuccess?: (method: string) => void;
}

export const IndonesiaFirstPaymentModal: React.FC<IndonesiaFirstPaymentModalProps> = ({
  isOpen,
  onClose,
  orderNumber = 'KVS-20260731-001',
  projectTitle = 'Roblox Custom Simulator Map & Scripting',
  amountUSD = 250,
  onPaymentSuccess
}) => {
  const { language, currency, setCurrency, formatPrice, t } = useLanguage();

  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>('qris');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PENDING');
  const [copiedVa, setCopiedVa] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Virtual Account number mock
  const vaNumber = '88012 89201 9283';

  // Platform fee calculation (10%)
  const platformFeeUSD = amountUSD * 0.1;
  const totalAmountUSD = amountUSD + platformFeeUSD;

  // Realtime countdown SLA timer (23 hours 59 minutes)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 45 });

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCopyVa = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s/g, ''));
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 3000);
  };

  const handleSimulatePaymentStatusCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setPaymentStatus('PAID');
      if (onPaymentSuccess) {
        onPaymentSuccess(selectedChannel);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base lg:text-lg tracking-tight">
                  {t('checkout.title')}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  {language === 'id' ? 'PERLINDUNGAN PEMBAYARAN' : 'ESCROW VAULT'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Order ID: <span className="font-mono text-cyan-400 font-semibold">{orderNumber}</span></p>
            </div>
          </div>

          {/* Currency Toggle inside Modal */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setCurrency('IDR')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  currency === 'IDR' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                IDR (Rp)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  currency === 'USD' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Layout (Payment Methods Left, Breakdown & Interactive Target Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
          
          {/* Left Column: Payment Method Navigation (6 Cols) */}
          <div className="lg:col-span-6 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40 space-y-4">
            
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('checkout.selectPayment')}
              </h4>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded-full">
                INDONESIA FIRST
              </span>
            </div>

            {/* 1. QRIS Option (Top Priority) */}
            <div 
              onClick={() => setSelectedChannel('qris')}
              className={`group p-4 rounded-2xl border transition-all cursor-pointer relative ${
                selectedChannel === 'qris'
                  ? 'bg-cyan-950/30 border-cyan-500 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
                  {t('checkout.indonesiaFirstBadge')}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  selectedChannel === 'qris' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    {t('checkout.qrisTitle')}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {t('checkout.qrisSub')}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">BCA</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">Mandiri</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">GoPay</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">OVO</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">DANA</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">ShopeePay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Bank Virtual Account */}
            <div 
              onClick={() => setSelectedChannel('bca_va')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedChannel.includes('va')
                  ? 'bg-blue-950/30 border-blue-500 shadow-lg shadow-blue-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  selectedChannel.includes('va') ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-white text-sm">
                    {t('checkout.vaTitle')}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('checkout.vaSub')}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedChannel('bca_va'); }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border text-left transition-all ${
                        selectedChannel === 'bca_va' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      BCA Virtual Account
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedChannel('mandiri_va'); }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border text-left transition-all ${
                        selectedChannel === 'mandiri_va' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      Mandiri Virtual Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. E-Wallets */}
            <div 
              onClick={() => setSelectedChannel('gopay')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedChannel === 'gopay' || selectedChannel === 'dana'
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  selectedChannel === 'gopay' || selectedChannel === 'dana' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">
                    {t('checkout.ewalletTitle')}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('checkout.ewalletSub')}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. PayPal (International) */}
            <div 
              onClick={() => setSelectedChannel('paypal')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedChannel === 'paypal'
                  ? 'bg-indigo-950/30 border-indigo-500 shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  selectedChannel === 'paypal' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    {t('checkout.paypalTitle')}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('checkout.paypalSub')}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Payment Display & Summary (6 Cols) */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between space-y-6">
            
            {/* Payment SLA Countdown & Order Breakdown */}
            <div className="space-y-4">
              
              {/* SLA Timer Bar */}
              <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded-xl flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="font-semibold">{t('checkout.expiresIn')}:</span>
                </div>
                <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')} WIB
                </span>
              </div>

              {/* Price Breakdown Box */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  {t('checkout.orderSummary')}
                </h4>
                
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{t('checkout.servicePrice')}</span>
                  <span className="font-mono font-semibold text-white">{formatPrice(amountUSD)}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-300">
                  <span>{t('checkout.platformFee')}</span>
                  <span className="font-mono font-semibold text-slate-400">{formatPrice(platformFeeUSD)}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                  <span className="font-bold text-sm text-white">{t('checkout.totalDeposit')}</span>
                  <span className="font-mono font-black text-lg text-cyan-400">
                    {formatPrice(totalAmountUSD)}
                  </span>
                </div>
              </div>

              {/* Dynamic Interactive Payment Target based on Selected Channel */}
              {paymentStatus === 'PAID' ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/60 rounded-2xl text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-emerald-400 text-sm tracking-wide">
                    {t('checkout.statusPaid')}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {language === 'id' ? (
                      <>
                        Pembayaran sebesar <span className="font-mono text-white font-bold">{formatPrice(totalAmountUSD)}</span> telah berhasil diterima dan dilindungi oleh KAEVY. Developer siap mengerjakan project kamu!
                      </>
                    ) : (
                      <>
                        Funds of <span className="font-mono text-white font-bold">{formatPrice(totalAmountUSD)}</span> are safely secured in Escrow. The developer is ready to start your project!
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {/* QRIS Interactive Target */}
                  {selectedChannel === 'qris' && (
                    <div className="p-5 bg-white text-slate-950 rounded-2xl text-center space-y-3 border border-slate-200 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-black text-xs text-slate-900 tracking-wider">QRIS PASAR UANG INDONESIA</span>
                        <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded">GPN</span>
                      </div>
                      
                      {/* Generated QRIS SVG Graphic */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block mx-auto">
                        <div className="w-40 h-40 bg-slate-900 rounded-lg p-2 flex flex-col justify-between items-center relative overflow-hidden">
                          <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-white rounded">
                            {Array.from({ length: 36 }).map((_, i) => (
                              <div key={i} className={`rounded-sm ${i % 2 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-white'}`} />
                            ))}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-cyan-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                              KAEVY
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] font-medium text-slate-600">
                        {t('checkout.scanInstruction')}
                      </p>
                    </div>
                  )}

                  {/* Virtual Account Interactive Target */}
                  {selectedChannel.includes('va') && (
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 uppercase font-semibold">{t('checkout.vaNumberLabel')}</span>
                        <span className="px-2 py-0.5 bg-blue-950 text-blue-400 font-bold text-[10px] rounded border border-blue-800">
                          AUTOMATED VA
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="font-mono font-black text-lg text-white tracking-widest">
                          {vaNumber}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyVa}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedVa ? t('checkout.vaCopied') : t('checkout.copyVa')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PayPal Interactive Target */}
                  {selectedChannel === 'paypal' && (
                    <div className="p-5 bg-indigo-950/40 border border-indigo-800/80 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                        <CreditCard className="w-4 h-4" />
                        <span>PayPal Express Checkout (USD)</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Redirects to PayPal secure environment for card authorization. Funds held in Kaevy Escrow Vault upon clearance.
                      </p>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Bottom Actions & Security Guarantee */}
            <div className="space-y-3 pt-2">
              
              {paymentStatus !== 'PAID' && (
                <button
                  type="button"
                  onClick={handleSimulatePaymentStatusCheck}
                  disabled={isChecking}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm tracking-wide shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t('checkout.checkingStatus')}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{t('checkout.checkStatus')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('checkout.securityNotice')}</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
