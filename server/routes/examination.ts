import { Router } from 'express';
import { examinationController } from '../controllers/ExaminationController.js';

const router = Router();

// Examination Master CRUD
router.post('/', examinationController.createExamination.bind(examinationController));
router.get('/:id', examinationController.getExamination.bind(examinationController));
router.patch('/:id', examinationController.updateExamination.bind(examinationController));
router.delete('/:id', examinationController.deleteExamination.bind(examinationController));

// Examination Schedules & Marks Entries
router.post('/schedules', examinationController.createExaminationSchedule.bind(examinationController));
router.post('/marks', examinationController.recordMarks.bind(examinationController));

// Grading & Cumulative Metrics compilation
router.post('/grades/compile', examinationController.compileStudentGrade.bind(examinationController));
router.post('/gpa/compile', examinationController.compileGPA.bind(examinationController));
router.post('/cgpa/compile', examinationController.compileCGPA.bind(examinationController));

// Declare results
router.post('/results/declare', examinationController.declareResults.bind(examinationController));

// Promotion, remarks, and intelligence actions
router.post('/promotions', examinationController.promoteStudent.bind(examinationController));
router.post('/remarks', examinationController.addAcademicRemark.bind(examinationController));
router.post('/intelligence/analyze', examinationController.analyzePerformance.bind(examinationController));

export default router;
