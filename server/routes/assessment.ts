import { Router } from 'express';
import { AssessmentController } from '../controllers/AssessmentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Question Bank
router.post('/questions', requireRole(['admin', 'teacher']), AssessmentController.createQuestion);
router.post('/questions/ai-generate', requireRole(['admin', 'teacher']), AssessmentController.generateAIQuestions);

// Question Paper
router.post('/papers', requireRole(['admin', 'teacher']), AssessmentController.createQuestionPaper);

// CBT
router.post('/cbt/schedule', requireRole(['admin']), AssessmentController.scheduleCBT);
router.post('/cbt/:examId/start', requireRole(['student']), AssessmentController.startCBTSession);

// Analytics
router.get('/analytics/:examId', requireRole(['admin', 'teacher']), AssessmentController.getExamAnalytics);

export default router;
