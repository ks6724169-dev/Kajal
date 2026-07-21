import { Router } from 'express';
import { GlobalOperationsController } from '../controllers/GlobalOperationsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/deployments', requireRole(['admin']), GlobalOperationsController.orchestrateDeployment);
router.post('/clusters', requireRole(['admin']), GlobalOperationsController.registerClusterNode);
router.post('/regions', requireRole(['admin']), GlobalOperationsController.registerRegion);
router.post('/rollouts', requireRole(['admin']), GlobalOperationsController.triggerRollout);
router.post('/autoscaling', requireRole(['admin']), GlobalOperationsController.configureAutoscaling);
router.post('/maintenance', requireRole(['admin']), GlobalOperationsController.scheduleMaintenance);

router.get('/command-center', requireRole(['admin']), GlobalOperationsController.getCommandCenterMetrics);
router.get('/global-health', requireRole(['admin']), GlobalOperationsController.getGlobalHealthSummary);
router.get('/capacity', requireRole(['admin']), GlobalOperationsController.getCapacityPlanner);
router.get('/cost-analysis', requireRole(['admin']), GlobalOperationsController.getCostAnalysis);
router.get('/release-history', requireRole(['admin']), GlobalOperationsController.getReleaseHistory);
router.get('/compliance', requireRole(['admin']), GlobalOperationsController.getComplianceOverview);
router.get('/ai-summary', requireRole(['admin']), GlobalOperationsController.getAISummary);

export default router;
