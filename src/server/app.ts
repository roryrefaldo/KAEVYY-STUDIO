import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestLoggerMiddleware } from './middleware/requestLogger.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthService } from './runtime/healthService.js';
import apiRouter from './routes/index.js';

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
 app.use(cors({
 origin: (origin, callback) => {
 if (!origin) return callback(null, true); // same-origin & health check
 if (allowedOrigins.includes(origin)) return callback(null, true);
 return callback(null, false);
 },
 credentials: true,
 }));
  app.use(cookieParser());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.use(requestLoggerMiddleware);
  app.use(rateLimitMiddleware({ windowMs: 60 * 1000, max: 200 }));
  app.use(authMiddleware);

  // Root level health and probe endpoints
  app.get('/health', async (req, res) => {
    const summary = await healthService.getHealthSummary();
    res.status(summary.status === 'ready' ? 200 : 503).json(summary);
  });

  app.get('/live', (req, res) => {
    res.status(200).json(healthService.getLiveness());
  });

  app.get('/ready', async (req, res) => {
    const readiness = await healthService.getReadiness();
    res.status(readiness.status === 'ready' ? 200 : 503).json(readiness);
  });

  app.get('/metrics', async (req, res) => {
    const metrics = await healthService.getMetrics();
    res.status(200).json(metrics);
  });

  app.get('/version', (req, res) => {
    res.status(200).json(healthService.getVersion());
  });

  // Mount API router under both /api/v1 and /api for compatibility
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
