import { Router } from 'express';
import { workforceController } from '../controllers/WorkforceController.js';
import { validateRequest } from '../middlewares/validate.js';
import { EmployeeLeaveSchema } from '../validators/WorkforceValidator.js';

const router = Router();
router.post('/', validateRequest(EmployeeLeaveSchema), workforceController.requestLeave);
export default router;
