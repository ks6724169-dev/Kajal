import { Router } from 'express';
import { workforceController } from '../controllers/WorkforceController.js';
import { validateRequest } from '../middlewares/validate.js';
import { EmployeeSchema } from '../validators/WorkforceValidator.js';

const router = Router();
router.post('/', validateRequest(EmployeeSchema), workforceController.onboardEmployee);
export default router;
