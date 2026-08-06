import { Router } from 'express';
import * as serviceCtrl from '../controllers/service.controller.js';
import { requireAuth, requireRole } from '../middleware/requireRole.js';
import { responseCache } from '../cache/responseCache.js';

const router = Router();

// Public with response caching
router.get('/', responseCache.cacheMiddleware({ ttlSeconds: 300, tags: ['services', 'categories'] }), serviceCtrl.listServices);
router.get('/:id', responseCache.cacheMiddleware({ ttlSeconds: 300, tags: ['services'] }), serviceCtrl.getServiceById);

// Developer
router.post('/', requireAuth, requireRole('DEVELOPER', 'ADMIN'), serviceCtrl.createService);
router.patch('/:id', requireAuth, requireRole('DEVELOPER', 'ADMIN'), serviceCtrl.updateService);
router.delete('/:id', requireAuth, requireRole('DEVELOPER', 'ADMIN'), serviceCtrl.deleteService);

export default router;
