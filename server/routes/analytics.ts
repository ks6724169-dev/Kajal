import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/dashboards', requireRole(['admin', 'principal']), AnalyticsController.createDashboard);
router.get('/dashboards', requireRole(['admin', 'principal', 'teacher']), AnalyticsController.getDashboards);
router.get('/executive-summary', requireRole(['admin', 'principal']), AnalyticsController.getExecutiveSummary);
router.get('/kpis', requireRole(['admin', 'principal']), AnalyticsController.getKPIs);

export default router;
