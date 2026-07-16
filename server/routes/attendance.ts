import { Router } from 'express';
import { attendanceController } from '../controllers/AttendanceController.js';
import { validateRequest } from '../middlewares/validate.js';
import { AttendanceSchema } from '../validators/LifecycleValidator.js';

const router = Router();

router.post('/', validateRequest(AttendanceSchema), attendanceController.mark);
router.patch('/:id/lock', attendanceController.lock);

export default router;
