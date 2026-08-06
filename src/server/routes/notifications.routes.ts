import { Router } from 'express';
import * as notifCtrl from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/requireRole.js';

const router = Router();

router.get('/', requireAuth, notifCtrl.getNotifications);
router.patch('/:id/read', requireAuth, notifCtrl.markRead);
router.patch('/read-all', requireAuth, notifCtrl.markAllRead);

export default router;
