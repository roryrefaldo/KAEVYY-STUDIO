import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public Auth Endpoints
router.post('/register', authCtrl.registerClient);
router.post('/register/client', authCtrl.registerClient);
router.post('/register/developer', authCtrl.registerDeveloper);
router.post('/login', authCtrl.login);
router.post('/refresh', authCtrl.refresh);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);
router.post('/verify-email', authCtrl.verifyEmail);

// OAuth Public Endpoints
router.post('/oauth/google', (req, res, next) => {
  req.body.provider = 'google';
  return authCtrl.oauthLogin(req, res, next);
});
router.post('/oauth/discord', (req, res, next) => {
  req.body.provider = 'discord';
  return authCtrl.oauthLogin(req, res, next);
});

// Authenticated Auth Endpoints
router.get('/me', requireAuth, authCtrl.getMe);
router.post('/logout', requireAuth, authCtrl.logout);
router.post('/logout-all', requireAuth, authCtrl.logoutAll);
router.post('/change-password', requireAuth, authCtrl.changePassword);
router.get('/sessions', requireAuth, authCtrl.getSessions);
router.delete('/sessions/:id', requireAuth, authCtrl.revokeSession);
router.post('/oauth/link', requireAuth, authCtrl.linkOAuthAccount);

export default router;
