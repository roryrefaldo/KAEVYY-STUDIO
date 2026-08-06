import { Router } from 'express';
import * as warrantyCtrl from '../controllers/warranty.controller.js';
import { requireAuth } from '../middleware/requireRole.js';

const router = Router();

router.get('/orders/:orderNumber/warranty', requireAuth, warrantyCtrl.getWarrantyForOrder);
router.post('/orders/:orderNumber/warranty/tickets', requireAuth, warrantyCtrl.createWarrantyTicket);
router.patch('/warranty/tickets/:id/status', requireAuth, warrantyCtrl.updateTicketStatus);
router.post('/orders/:orderNumber/reviews', requireAuth, warrantyCtrl.createReview);

export default router;
