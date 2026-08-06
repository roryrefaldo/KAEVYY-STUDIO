import { Router } from 'express';
import * as currCtrl from '../controllers/currency.controller.js';
import { responseCache } from '../cache/responseCache.js';

const router = Router();

router.get('/currencies', responseCache.cacheMiddleware({ ttlSeconds: 600, tags: ['currencies'] }), currCtrl.getCurrencies);
router.get('/exchange-rates', responseCache.cacheMiddleware({ ttlSeconds: 600, tags: ['exchange-rates'] }), currCtrl.getExchangeRates);

export default router;
