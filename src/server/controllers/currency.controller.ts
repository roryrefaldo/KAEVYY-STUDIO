import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { db } from '../../db/index.js';
import { exchangeRates } from '../../db/schema/index.js';
import { desc } from 'drizzle-orm';

export async function getCurrencies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  res.json({
    success: true,
    data: [
      { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', isWholeInteger: true },
      { code: 'USD', name: 'United States Dollar', symbol: '$', isWholeInteger: false, decimals: 2 },
    ],
  });
}

export async function getExchangeRates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const rates = await db.select().from(exchangeRates).orderBy(desc(exchangeRates.effectiveAt)).limit(10);
    res.json({
      success: true,
      data: rates,
    });
  } catch (error) {
    next(error);
  }
}
