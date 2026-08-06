import { OrderMilestoneItem, EscrowVaultRecord, WarrantyClaimRecord } from '../types/orderWorkspace.types';

export const calculateMilestoneAmounts = (
  totalPriceUSD: number,
  exchangeRateIDR: number = 15500
) => {
  return [
    {
      stage: 25 as const,
      title: 'Milestone 1: Down Payment & Core Architecture Setup (25%)',
      percentage: 25,
      amountUSD: totalPriceUSD * 0.25,
      amountIDR: totalPriceUSD * 0.25 * exchangeRateIDR,
    },
    {
      stage: 50 as const,
      title: 'Milestone 2: Functional Prototype & System Integration (50%)',
      percentage: 50,
      amountUSD: totalPriceUSD * 0.50,
      amountIDR: totalPriceUSD * 0.50 * exchangeRateIDR,
    },
    {
      stage: 100 as const,
      title: 'Milestone 3: Final Delivery, Security Audit & Source Code Release (25%)',
      percentage: 25,
      amountUSD: totalPriceUSD * 0.25,
      amountIDR: totalPriceUSD * 0.25 * exchangeRateIDR,
    },
  ];
};

export const calculateWarrantyRemainingDays = (startDateIso: string, durationDays: number = 30): number => {
  const start = new Date(startDateIso).getTime();
  const now = new Date().getTime();
  const elapsedDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const remaining = durationDays - elapsedDays;
  return remaining > 0 ? remaining : 0;
};

export const formatEscrowBadge = (status: EscrowVaultRecord['status'], lang: 'id' | 'en' = 'id') => {
  switch (status) {
    case 'HELD_IN_ESCROW':
      return {
        label: lang === 'id' ? 'Dana Aman Terkunci di Escrow' : 'Funds Safely Held in Escrow Vault',
        bgClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      };
    case 'PARTIALLY_RELEASED':
      return {
        label: lang === 'id' ? 'Sebagian Dana Telah Dirilis' : 'Partially Released to Dev',
        bgClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
      };
    case 'FULLY_RELEASED':
      return {
        label: lang === 'id' ? 'Seluruh Escrow Telah Dirilis' : 'Escrow Fully Released',
        bgClass: 'bg-blue-950/80 text-blue-300 border-blue-800',
      };
    case 'REFUNDED':
      return {
        label: lang === 'id' ? 'Dana Dikembalikan ke Klien' : 'Funds Refunded to Client',
        bgClass: 'bg-rose-950/80 text-rose-300 border-rose-800',
      };
    default:
      return {
        label: status,
        bgClass: 'bg-slate-800 text-slate-300 border-slate-700',
      };
  }
};
