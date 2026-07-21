import { Router } from 'express';
import { DeveloperPlatformController } from '../controllers/DeveloperPlatformController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/developers', requireRole(['admin']), DeveloperPlatformController.createDeveloper);
router.post('/applications', requireRole(['admin', 'developer']), DeveloperPlatformController.createApplication);
router.post('/apikeys', requireRole(['admin', 'developer']), DeveloperPlatformController.createAPIKey);
router.get('/openapi', DeveloperPlatformController.getOpenAPI);
router.post('/ai/plugin-boilerplate', requireRole(['admin', 'developer']), DeveloperPlatformController.generatePluginBoilerplate);

export default router;
