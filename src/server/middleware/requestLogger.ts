/**
 * KAEVY STUDIO - Enterprise Request Logger & Observability Middleware
 * Phase 10.3 Enterprise Observability
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { metricsTracker } from '../observability/metricsTracker.js';
import { tracer } from '../observability/tracer.js';

export function isStaticOrDevAsset(path: string): boolean {
  if (path.startsWith('/src/') || path.startsWith('/@') || path.startsWith('/node_modules/')) {
    return true;
  }
  if (path === '/favicon.ico' || path === '/robots.txt') {
    return true;
  }
  if (/\.(tsx?|jsx?|css|less|scss|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|eot|map)$/i.test(path) && !path.startsWith('/api/')) {
    return true;
  }
  return false;
}

export function requestLoggerMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (isStaticOrDevAsset(req.path)) {
    return next();
  }

  const startTime = Date.now();

  // 1. Ensure unique Request ID & Trace ID
  const reqId = (req.headers['x-request-id'] as string) || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const traceId = (req.headers['x-trace-id'] as string) || tracer.generateTraceId();

  req.requestId = reqId;
  res.setHeader('X-Request-Id', reqId);
  res.setHeader('X-Trace-Id', traceId);

  // 2. Start distributed tracing span
  const span = tracer.startSpan(`${req.method} ${req.path}`, {
    traceId,
    path: req.path,
    method: req.method,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
  });

  // 3. Handle response completion event
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const statusCode = res.statusCode;
    const userId = req.user?.id;

    // End tracing span
    tracer.endSpan(span.spanId, statusCode >= 400 ? 'ERROR' : 'OK', {
      statusCode,
      userId,
      durationMs,
    });

    // Record metrics
    metricsTracker.recordHttpRequest(req.path, req.method, statusCode, durationMs);

    // Log structured entry
    const logMeta = {
      requestId: reqId,
      traceId,
      userId,
      method: req.method,
      route: req.path,
      statusCode,
      durationMs,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    if (statusCode >= 500) {
      logger.error(`[HTTP 5XX Error] ${req.method} ${req.path} - ${statusCode} (${durationMs}ms)`, logMeta);
    } else if (statusCode >= 400) {
      logger.warn(`[HTTP 4XX Warning] ${req.method} ${req.path} - ${statusCode} (${durationMs}ms)`, logMeta);
    } else {
      logger.info(`[HTTP Request] ${req.method} ${req.path} - ${statusCode} (${durationMs}ms)`, logMeta);
    }
  });

  next();
}
