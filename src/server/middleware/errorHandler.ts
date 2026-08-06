import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AppError } from '../errors/index.js';
import { logger } from '../utils/logger.js';
import { metricsTracker } from '../observability/metricsTracker.js';

export function errorHandler(err: any, req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  const path = req.path || req.originalUrl || 'unknown_path';
  const requestId = req.requestId;

  if (err instanceof AppError) {
    metricsTracker.recordError(path, err.statusCode, err.message, requestId);
    logger.warn(`AppError [${err.code}]: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      requestId,
      path,
    });

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // Unhandled internal server error
  metricsTracker.recordError(path, 500, err?.message || 'Internal Server Error', requestId);
  logger.error(`Unhandled Exception on ${req.method} ${path}`, err, {
    requestId,
    path,
  });

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Terjadi kesalahan internal pada server.',
    },
  });
}
