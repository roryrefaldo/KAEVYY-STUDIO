import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { isStaticOrDevAsset } from './requestLogger.js';

const requestsMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(options: { windowMs?: number; max?: number } = {}) {
  const windowMs = options.windowMs || 60 * 1000; // 1 min
  const max = options.max || 100; // 100 requests per min

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (isStaticOrDevAsset(req.path)) {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = requestsMap.get(ip);
    if (!record || now > record.resetTime) {
      requestsMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Batas jumlah permintaan terlampaui. Silakan coba lagi beberapa saat lagi.',
        },
      });
    }

    record.count++;
    next();
  };
}
