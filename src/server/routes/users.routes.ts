import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/requireRole.js';

const router = Router();

router.get('/me', requireAuth, userCtrl.getMe);
router.patch('/me', requireAuth, userCtrl.updateMe);
router.get('/me/preferences', requireAuth, userCtrl.getPreferences);
router.patch('/me/preferences', requireAuth, userCtrl.updatePreferences);

export default router;
