import { Router } from 'express';
import * as payCtrl from '../controllers/payment.controller.js';
import { requireAuth, requireRole } from '../middleware/requireRole.js';

const router = Router();

router.post('/orders/:orderNumber/payments', requireAuth, payCtrl.createPayment);
router.patch('/payments/:id/mark-paid', requireAuth, payCtrl.markPaymentPaid);
router.get('/orders/:orderNumber/escrow', requireAuth, payCtrl.getEscrowForOrder);

// Admin Escrow Actions
router.post('/admin/escrow/:id/release', requireAuth, requireRole('ADMIN'), payCtrl.releaseEscrow);
router.post('/admin/escrow/:id/refund', requireAuth, requireRole('ADMIN'), payCtrl.refundEscrow);

export default router;
