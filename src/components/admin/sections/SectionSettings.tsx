import React, { useState } from 'react';
import {
  SlidersHorizontal,
  DollarSign,
  Globe,
  Lock,
  ToggleLeft,
  ToggleRight,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PlatformSettings } from '../../../types/adminControl';
import { SensitiveActionPayload } from '../AdminJustificationModal';

interface SectionSettingsProps {
  settings: PlatformSettings;
  onTriggerAction: (payload: SensitiveActionPayload) => void;
}

export const SectionSettings: React.FC<SectionSettingsProps> = ({
  settings: initialSettings,
  onTriggerAction,
}) => {
  const [settings, setSettings] = useState<PlatformSettings>({ ...initialSettings });
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (key: keyof PlatformSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    onTriggerAction({
      title: 'Update Global Platform Configuration & Fee Parameters',
      impactSummary: `Persists updated platform parameters: Fee Rate = ${settings.platformFeePercent}%, USD/IDR Rate = ${settings.usdToIdrRate}, Maintenance Mode = ${settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}.`,
      actionType: 'UPDATE_SETTINGS',
      onConfirm: (reason) => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-purple-400" />
            SECTION 11 — Enterprise Platform Settings & Payment Providers
          </h2>
          <p className="text-xs text-slate-400">
            Configure platform commission fee percentages, USD/IDR exchange rates, emergency maintenance mode, and payment gateway providers.
          </p>
        </div>

        {isSaved && (
          <div className="px-4 py-2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings Persisted Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Core Financial Rates */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Core Commission & FX Rate Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Platform Fee Percentage (%)</span>
                <span className="text-emerald-400 font-mono font-bold">{settings.platformFeePercent}%</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={settings.platformFeePercent}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, platformFeePercent: Number(e.target.value) }))
                }
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-slate-500">
                Applied to gross escrow milestone amounts upon order completion release.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>USD to IDR Currency Conversion Rate</span>
                <span className="text-cyan-400 font-mono font-bold">
                  Rp {settings.usdToIdrRate.toLocaleString()}
                </span>
              </label>
              <input
                type="number"
                step="50"
                min="10000"
                max="25000"
                value={settings.usdToIdrRate}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, usdToIdrRate: Number(e.target.value) }))
                }
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-slate-500">
                Used for Midtrans / Bank Transfer localized rupiah conversions.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Switches & Payment Providers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Switches */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Platform Controls & Feature Flags
            </h3>

            <div className="space-y-3">
              {[
                {
                  key: 'maintenanceMode',
                  label: 'Emergency Maintenance Mode',
                  description: 'Blocks new order placement and shows maintenance banner to non-admin users.',
                  danger: true,
                },
                {
                  key: 'autoReleaseEscrowDays',
                  label: 'Auto-Release Unclaimed Milestones',
                  description: 'Automatically releases escrow after client review window expires.',
                },
                {
                  key: 'allowNewRegistrations',
                  label: 'Allow New User Registrations',
                  description: 'Permits new client and developer account creations.',
                },
              ].map((item) => {
                const val = (settings as any)[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggle(item.key as any)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      val
                        ? item.danger
                          ? 'bg-rose-950/40 border-rose-800/80'
                          : 'bg-purple-950/40 border-purple-800/80'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>

                    {val ? (
                      <ToggleRight className={`w-7 h-7 shrink-0 ${item.danger ? 'text-rose-400' : 'text-purple-400'}`} />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Provider Gateways */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Active Payment Gateways
            </h3>

            <div className="space-y-3">
              {[
                {
                  key: 'stripeEnabled',
                  label: 'Stripe International (Credit Card / Apple Pay)',
                  description: 'Global credit card processing with automatic webhook verification.',
                },
                {
                  key: 'midtransEnabled',
                  label: 'Midtrans Indonesia (QRIS / Bank Transfer / VA)',
                  description: 'Indonesian localized rupiah payment gateway.',
                },
                {
                  key: 'manualBankTransferEnabled',
                  label: 'Manual Escrow Direct Bank Deposit',
                  description: 'Requires admin manual payment verification receipt review.',
                },
              ].map((item) => {
                const val = (settings as any)[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggle(item.key as any)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      val ? 'bg-cyan-950/40 border-cyan-800/80' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>

                    {val ? (
                      <ToggleRight className="w-7 h-7 text-cyan-400 shrink-0" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Persist Platform Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
