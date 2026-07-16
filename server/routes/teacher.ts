import { Router } from 'express';
import { workforceController } from '../controllers/WorkforceController.js';
import { validateRequest } from '../middlewares/validate.js';
import { TeacherSchema } from '../validators/WorkforceValidator.js';

const router = Router();
router.post('/', validateRequest(TeacherSchema), workforceController.assignTeacher);
export default router;
