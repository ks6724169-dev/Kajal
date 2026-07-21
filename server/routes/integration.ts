import { Router } from 'express';
import { IntegrationController } from '../controllers/IntegrationController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/providers', requireRole(['admin']), IntegrationController.registerProvider);
router.post('/connectors', requireRole(['admin']), IntegrationController.configureConnector);
router.post('/webhooks', requireRole(['admin']), IntegrationController.registerWebhook);
router.post('/sync/trigger', requireRole(['admin']), IntegrationController.triggerSync);
router.post('/mapping/suggest', requireRole(['admin']), IntegrationController.suggestMapping);

export default router;
