import { Router } from 'express';
import { studentController } from '../controllers/StudentController.js';
import { validateRequest } from '../middlewares/validate.js';
import { StudentSchema } from '../validators/StudentValidator.js';

const router = Router();

router.post('/admit', validateRequest(StudentSchema), studentController.admit);
router.post('/e2e-lifecycle-check', studentController.runE2ELifecycleCheck);
router.get('/:id', studentController.getProfile);
router.patch('/:id/status', studentController.updateStatus);

export default router;
