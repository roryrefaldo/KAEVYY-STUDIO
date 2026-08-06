import { Router } from 'express';
import * as disputeCtrl from '../controllers/dispute.controller.js';
import { requireAuth, requireRole } from '../middleware/requireRole.js';

const router = Router();

router.post('/orders/:orderNumber/disputes', requireAuth, disputeCtrl.openDispute);
router.get('/orders/:orderNumber/dispute', requireAuth, disputeCtrl.getDisputeForOrder);
router.post('/disputes/:id/evidence', requireAuth, disputeCtrl.submitEvidence);
router.post('/admin/disputes/:id/resolve', requireAuth, requireRole('ADMIN'), disputeCtrl.resolveDispute);

export default router;
