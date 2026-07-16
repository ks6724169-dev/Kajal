import { Router } from 'express';
import { workforceController } from '../controllers/WorkforceController.js';
import { validateRequest } from '../middlewares/validate.js';
import { TrainingCourseSchema, EmployeeTrainingSchema } from '../validators/WorkforceValidator.js';

const router = Router();
router.post('/courses', validateRequest(TrainingCourseSchema), workforceController.createCourse);
router.post('/enroll', validateRequest(EmployeeTrainingSchema), workforceController.enrollCourse);
export default router;
