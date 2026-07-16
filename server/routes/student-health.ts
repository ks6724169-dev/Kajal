import { Router } from 'express';
import { healthController } from '../controllers/HealthController.js';
import { validateRequest } from '../middlewares/validate.js';
import { HealthProfileSchema, MedicalVisitSchema } from '../validators/LifecycleValidator.js';

const router = Router();

router.post('/profile', validateRequest(HealthProfileSchema), healthController.upsertProfile);
router.post('/visits', validateRequest(MedicalVisitSchema), healthController.logVisit);

export default router;
