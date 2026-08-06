import { DEFAULT_EXCHANGE_RATE_IDR } from '../constants';

export const formatCurrencyUSD = (amountUSD: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountUSD);
};

export const formatCurrencyIDR = (amountIDR: number): string => {
  return `Rp ${amountIDR.toLocaleString('id-ID')}`;
};

export const convertUSDToIDR = (
  amountUSD: number,
  rate: number = DEFAULT_EXCHANGE_RATE_IDR
): number => {
  return amountUSD * rate;
};

export const formatDateID = (dateInput: string | Date): string => {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const calculatePercentageAmount = (
  totalAmount: number,
  percentage: number
): number => {
  return (totalAmount * percentage) / 100;
};
