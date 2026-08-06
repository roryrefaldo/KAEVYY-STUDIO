import { Router } from 'express';
import * as devCtrl from '../controllers/developer.controller.js';
import { requireAuth, requireRole } from '../middleware/requireRole.js';
import { responseCache } from '../cache/responseCache.js';

const router = Router();

// Public
router.get('/', responseCache.cacheMiddleware({ ttlSeconds: 300, tags: ['developers'] }), devCtrl.listDevelopers);

// Developer Profile / Auth
router.get('/me', requireAuth, requireRole('DEVELOPER'), devCtrl.getMyProfile);
router.patch('/me', requireAuth, requireRole('DEVELOPER'), devCtrl.updateMyProfile);
router.get('/me/capacity', requireAuth, requireRole('DEVELOPER'), devCtrl.getMyCapacity);
router.get('/me/earnings', requireAuth, requireRole('DEVELOPER'), devCtrl.getMyEarnings);
router.post('/me/verification', requireAuth, requireRole('DEVELOPER'), devCtrl.submitVerification);
router.get('/me/verification', requireAuth, requireRole('DEVELOPER'), devCtrl.getVerificationStatus);

// Public single dev
router.get('/:id', responseCache.cacheMiddleware({ ttlSeconds: 300, tags: ['developers'] }), devCtrl.getDeveloperById);

export default router;
