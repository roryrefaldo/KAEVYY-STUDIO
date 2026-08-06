import { Router } from 'express';
import { healthService } from '../runtime/healthService.js';
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import developersRoutes from './developers.routes.js';
import servicesRoutes from './services.routes.js';
import currenciesRoutes from './currencies.routes.js';
import ordersRoutes from './orders.routes.js';
import projectsRoutes from './projects.routes.js';
import paymentsRoutes from './payments.routes.js';
import assetsRoutes from './assets.routes.js';
import warrantiesRoutes from './warranties.routes.js';
import disputesRoutes from './disputes.routes.js';
import messagesRoutes from './messages.routes.js';
import notificationsRoutes from './notifications.routes.js';
import adminRoutes from './admin.routes.js';

const apiRouter = Router();

// Health & Telemetry Probes
apiRouter.get('/health', async (req, res) => {
  const summary = await healthService.getHealthSummary();
  res.status(summary.status === 'ready' ? 200 : 503).json(summary);
});

apiRouter.get('/live', (req, res) => {
  res.status(200).json(healthService.getLiveness());
});

apiRouter.get('/liveness', (req, res) => {
  res.status(200).json(healthService.getLiveness());
});

apiRouter.get('/ready', async (req, res) => {
  const readiness = await healthService.getReadiness();
  res.status(readiness.status === 'ready' ? 200 : 503).json(readiness);
});

apiRouter.get('/readiness', async (req, res) => {
  const readiness = await healthService.getReadiness();
  res.status(readiness.status === 'ready' ? 200 : 503).json(readiness);
});

apiRouter.get('/metrics', async (req, res) => {
  const metrics = await healthService.getMetrics();
  res.status(200).json(metrics);
});

apiRouter.get('/version', (req, res) => {
  res.status(200).json(healthService.getVersion());
});

// Business Logic Sub-Routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/developers', developersRoutes);
apiRouter.use('/services', servicesRoutes);
apiRouter.use('/', currenciesRoutes);
apiRouter.use('/orders', ordersRoutes);
apiRouter.use('/projects', projectsRoutes);
apiRouter.use('/', paymentsRoutes);
apiRouter.use('/assets', assetsRoutes);
apiRouter.use('/', warrantiesRoutes);
apiRouter.use('/', disputesRoutes);
apiRouter.use('/', messagesRoutes);
apiRouter.use('/notifications', notificationsRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
