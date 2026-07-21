import { Router } from 'express';
import { WorkflowController } from '../controllers/WorkflowController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', requireRole(['admin']), WorkflowController.createWorkflow);
router.post('/:versionId/publish', requireRole(['admin']), WorkflowController.publishWorkflow);
router.post('/:versionId/start', WorkflowController.startWorkflow);

router.post('/approvals/:approvalId/approve', WorkflowController.approve);
router.post('/approvals/:approvalId/reject', WorkflowController.reject);
router.post('/approvals/:approvalId/delegate', WorkflowController.delegate);

router.post('/tasks/:taskId/complete', WorkflowController.completeTask);

router.post('/instances/:instanceId/escalate', requireRole(['admin', 'principal']), WorkflowController.escalate);

router.get('/analytics', requireRole(['admin', 'principal']), WorkflowController.getAnalytics);

export default router;
