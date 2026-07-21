import { Router } from 'express';
import { BackupController } from '../controllers/BackupController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/jobs', requireRole(['admin']), BackupController.triggerBackup);
router.post('/restores', requireRole(['admin']), BackupController.triggerRestore);
router.get('/analytics', requireRole(['admin']), BackupController.getAnalytics);

export default router;
