import { Router } from 'express';
import * as msgCtrl from '../controllers/message.controller.js';
import { requireAuth } from '../middleware/requireRole.js';

const router = Router();

router.get('/conversations', requireAuth, msgCtrl.getConversations);
router.get('/conversations/:id/messages', requireAuth, msgCtrl.getMessages);
router.post('/conversations/:id/messages', requireAuth, msgCtrl.sendMessage);

// Order specific message routes
router.get('/orders/:orderNumber', requireAuth, msgCtrl.getOrderMessages);
router.post('/orders/:orderNumber', requireAuth, msgCtrl.sendOrderMessage);

// Individual message edit / delete
router.patch('/:id', requireAuth, msgCtrl.editMessage);
router.delete('/:id', requireAuth, msgCtrl.deleteMessage);

export default router;

