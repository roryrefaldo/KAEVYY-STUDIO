import { Router } from 'express';
import * as orderCtrl from '../controllers/order.controller.js';
import { requireAuth, requireRole } from '../middleware/requireRole.js';

const router = Router();

router.post('/', requireAuth, requireRole('CLIENT', 'ADMIN'), orderCtrl.createOrder);
router.get('/', requireAuth, orderCtrl.listOrders);
router.get('/:orderNumber', requireAuth, orderCtrl.getOrderByNumber);
router.patch('/:orderNumber/accept', requireAuth, requireRole('DEVELOPER', 'ADMIN'), orderCtrl.acceptOrder);
router.patch('/:orderNumber/reject', requireAuth, requireRole('DEVELOPER', 'ADMIN'), orderCtrl.rejectOrder);
router.patch('/:orderNumber/cancel', requireAuth, orderCtrl.cancelOrder);

router.get('/:orderNumber/events', requireAuth, orderCtrl.getOrderEvents);

export default router;
