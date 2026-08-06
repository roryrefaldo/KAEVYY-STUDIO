import { db } from './index.js';

export interface MonetaryValidationResult {
  valid: boolean;
  amount: number;
  currency: 'IDR' | 'USD';
  formattedString: string;
  errorMessage?: string;
}

/**
 * Executes a callback inside a database transaction.
 */
export async function withTransaction<T>(
  callback: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>
): Promise<T> {
  return await db.transaction(async (tx) => {
    return await callback(tx);
  });
}

/**
 * Generates unique Order Number format: KS-ORD-YYYYMMDD-XXXX
 */
export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `KS-ORD-${dateStr}-${randomSuffix}`;
}

/**
 * Generates unique Payment Reference format: PAY-XXXXX-XXXX
 */
export function generatePaymentReference(): string {
  const dateStr = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PAY-${dateStr}-${randomSuffix}`;
}

/**
 * Validates and formats monetary values according to KAEVY STUDIO currency rules.
 * IDR: Whole integer settlement (zero decimals).
 * USD: Exactly 2 decimal places.
 */
export function validateAndFormatMonetary(amount: number, currency: string): MonetaryValidationResult {
  const normCurrency = currency.toUpperCase() as 'IDR' | 'USD';

  if (normCurrency !== 'IDR' && normCurrency !== 'USD') {
    return {
      valid: false,
      amount,
      currency: 'IDR',
      formattedString: '',
      errorMessage: `Unsupported currency: ${currency}. Supported currencies are IDR and USD.`,
    };
  }

  if (amount <= 0) {
    return {
      valid: false,
      amount,
      currency: normCurrency,
      formattedString: '',
      errorMessage: 'Monetary amount must be positive.',
    };
  }

  if (normCurrency === 'IDR') {
    if (!Number.isInteger(amount)) {
      return {
        valid: false,
        amount,
        currency: 'IDR',
        formattedString: '',
        errorMessage: 'IDR amounts must be whole integers without fractional decimals.',
      };
    }
    const formattedString = `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    return { valid: true, amount, currency: 'IDR', formattedString };
  } else {
    const formattedString = `$${amount.toFixed(2)}`;
    return { valid: true, amount: parseFloat(amount.toFixed(2)), currency: 'USD', formattedString };
  }
}

/**
 * Returns maximum simultaneous active project capacity for developer tier.
 * VERIFIED: 3
 * ELITE: 5
 */
export function getDeveloperMaxCapacity(developerTier: 'VERIFIED' | 'ELITE'): number {
  return developerTier === 'ELITE' ? 5 : 3;
}

/**
 * Calculates 30-day warranty window strictly starting from project completion date.
 */
export function calculateWarrantyDates(completedAt: Date): { startAt: Date; endAt: Date } {
  const startAt = new Date(completedAt.getTime());
  const endAt = new Date(completedAt.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
  return { startAt, endAt };
}

/**
 * Calculates escrow breakdown based on gross budget amount and platform fee rate snapshot.
 */
export function calculateEscrowAmounts(grossBudgetAmount: number, platformFeeRate: number) {
  const platformFeeAmount = parseFloat((grossBudgetAmount * platformFeeRate).toFixed(2));
  const netDeveloperAmount = parseFloat((grossBudgetAmount - platformFeeAmount).toFixed(2));
  return {
    grossBudgetAmount,
    platformFeeRate,
    platformFeeAmount,
    netDeveloperAmount,
  };
}

/**
 * Validates Share Asset documentation blocks count (Min 1, Max 10).
 */
export function validateAssetDocumentationCount(blocksCount: number): { valid: boolean; message?: string } {
  if (blocksCount < 1) {
    return { valid: false, message: 'Share Assets must contain at least 1 documentation block.' };
  }
  if (blocksCount > 10) {
    return { valid: false, message: 'Share Assets cannot exceed 10 documentation blocks.' };
  }
  return { valid: true };
}

/**
 * Validates Share Asset file size limit (Maximum 500MB = 524,288,000 bytes).
 */
export const MAX_ASSET_FILE_SIZE_BYTES = 524288000;

export function validateAssetFileSize(fileSizeBytes: number): { valid: boolean; message?: string } {
  if (fileSizeBytes <= 0) {
    return { valid: false, message: 'File size must be greater than zero bytes.' };
  }
  if (fileSizeBytes > MAX_ASSET_FILE_SIZE_BYTES) {
    return { valid: false, message: `File size exceeds the 500MB limit (${fileSizeBytes} bytes provided).` };
  }
  return { valid: true };
}
