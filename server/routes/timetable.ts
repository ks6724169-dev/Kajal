import { Router } from 'express';
import { timetableController } from '../controllers/TimetableController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequest as validate } from '../middlewares/validate.js';
import { TimetableSchema } from '../validators/TimetableValidator.js';

const router = Router();

router.use(requireAuth as any);

router.post(
  '/',
  requireRole(['SUPER_ADMIN', 'SCHOOL_OWNER', 'PRINCIPAL', 'TIMETABLE_MANAGER']) as any,
  validate(TimetableSchema),
  timetableController.createTimetable
);

router.get('/:id', timetableController.getTimetable);

router.post(
  '/:id/publish',
  requireRole(['SUPER_ADMIN', 'PRINCIPAL', 'TIMETABLE_MANAGER']) as any,
  timetableController.publishTimetable
);

router.get('/teacher/:teacherId', timetableController.getTeacherSchedule);
router.get('/class/:classId', timetableController.getClassSchedule);

router.post(
  '/:id/auto-generate',
  requireRole(['SUPER_ADMIN', 'TIMETABLE_MANAGER']) as any,
  timetableController.autoGenerate
);

router.get('/:id/conflicts', timetableController.getConflicts);
router.get('/:id/analytics', timetableController.getAnalytics);

router.get('/resource/:resourceId/utilization', timetableController.getAllocationUtilization);

export default router;
