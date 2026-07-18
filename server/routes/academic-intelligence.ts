import { Router } from 'express';
import { academicIntelligenceController } from '../controllers/AcademicIntelligenceController.js';

const router = Router();

router.post('/analyze/student', academicIntelligenceController.analyzeStudent.bind(academicIntelligenceController));
router.post('/analyze/subject', academicIntelligenceController.analyzeSubject.bind(academicIntelligenceController));

router.post('/plan/study', academicIntelligenceController.generateStudyPlan.bind(academicIntelligenceController));
router.post('/plan/recommendation', academicIntelligenceController.generateRecommendation.bind(academicIntelligenceController));

router.post('/predict/promotion', academicIntelligenceController.predictPromotion.bind(academicIntelligenceController));
router.post('/predict/dropout', academicIntelligenceController.predictDropout.bind(academicIntelligenceController));
router.post('/predict/attendance', academicIntelligenceController.predictAttendance.bind(academicIntelligenceController));

export default router;
