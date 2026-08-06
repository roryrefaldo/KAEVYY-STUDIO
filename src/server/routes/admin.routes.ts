import { Router } from 'express';
import * as adminCtrl from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/requireRole.js';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/dashboard', adminCtrl.getDashboardStats);
router.get('/audit-logs', adminCtrl.listAuditLogs);
router.post('/verifications/:id/approve', adminCtrl.approveVerification);
router.post('/verifications/:id/reject', adminCtrl.rejectVerification);
router.post('/users/:id/suspend', adminCtrl.suspendUser);
router.post('/users/:id/activate', adminCtrl.activateUser);

export default router;
