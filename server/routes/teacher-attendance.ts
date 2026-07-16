import { Router } from 'express';
import { workforceController } from '../controllers/WorkforceController.js';
import { validateRequest } from '../middlewares/validate.js';
import { EmployeeAttendanceSchema } from '../validators/WorkforceValidator.js';

const router = Router();
router.post('/', validateRequest(EmployeeAttendanceSchema), workforceController.markAttendance);
export default router;
