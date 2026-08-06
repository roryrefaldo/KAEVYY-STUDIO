import { Router } from 'express';
import * as assetCtrl from '../controllers/asset.controller.js';
import { requireAuth, requireRole } from '../middleware/requireRole.js';
import { responseCache } from '../cache/responseCache.js';

const router = Router();

// Public
router.get('/', responseCache.cacheMiddleware({ ttlSeconds: 300, tags: ['share-assets'] }), assetCtrl.listPublicAssets);
router.get('/:id', responseCache.cacheMiddleware({ ttlSeconds: 300, tags: ['share-assets'] }), assetCtrl.getAssetById);
router.get('/:id/download', assetCtrl.downloadAsset);

// Developer / User
router.post('/', requireAuth, assetCtrl.createAsset);
router.post('/:id/submit-for-review', requireAuth, assetCtrl.submitForReview);

// Admin Moderation
router.post('/admin/:id/moderate', requireAuth, requireRole('ADMIN'), assetCtrl.moderateAsset);

export default router;
