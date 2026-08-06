import { Router } from 'express';
import * as projectCtrl from '../controllers/project.controller.js';
import { requireAuth, requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/:id', requireAuth, projectCtrl.getProjectById);
router.post('/:id/milestones/:percentage/submit', requireAuth, requireRole('DEVELOPER'), projectCtrl.submitMilestone);
router.post('/:id/milestones/:percentage/approve', requireAuth, requireRole('CLIENT'), projectCtrl.approveMilestone);
router.post('/:id/milestones/:percentage/request-revision', requireAuth, requireRole('CLIENT'), projectCtrl.requestRevision);

export default router;
