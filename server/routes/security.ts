import { Router } from 'express';
import { SecurityController } from '../controllers/SecurityController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/login', SecurityController.login);
router.post('/mfa/verify', SecurityController.verifyMFA);

// Protected routes
router.use(requireAuth);
router.post('/device/trust', SecurityController.trustDevice);
router.get('/analytics/risk/:userId', requireRole(['admin']), SecurityController.analyzeRisk);

export default router;
