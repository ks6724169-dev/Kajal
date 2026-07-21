import { Router } from 'express';
import { AIAgentController } from '../controllers/AIAgentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/agents', requireRole(['admin']), AIAgentController.createAgent);
router.post('/chat', AIAgentController.chat);
router.post('/tasks', requireRole(['admin', 'principal', 'teacher']), AIAgentController.createTask);
router.post('/recommendations', requireRole(['admin', 'principal', 'teacher']), AIAgentController.createRecommendation);

export default router;
