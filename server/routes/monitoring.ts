import { Router } from 'express';
import { MonitoringController } from '../controllers/MonitoringController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/health', MonitoringController.checkHealth);

router.use(requireAuth);

router.get('/performance', requireRole(['admin']), MonitoringController.getPerformance);
router.post('/incidents', requireRole(['admin']), MonitoringController.createIncident);
router.post('/feature-flags', requireRole(['admin']), MonitoringController.setFeatureFlag);
router.get('/incidents/:incidentId/analyze', requireRole(['admin']), MonitoringController.analyzeIncident);

export default router;
