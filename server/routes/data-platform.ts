import { Router } from 'express';
import { DataPlatformController } from '../controllers/DataPlatformController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/pipelines', requireRole(['admin']), DataPlatformController.createPipeline);
router.post('/etl', requireRole(['admin']), DataPlatformController.triggerETL);
router.post('/training', requireRole(['admin']), DataPlatformController.startTraining);

export default router;
