import { Router } from 'express';
import { behaviourController } from '../controllers/BehaviourController.js';
import { validateRequest } from '../middlewares/validate.js';
import { BehaviourSchema } from '../validators/LifecycleValidator.js';

const router = Router();

router.post('/', validateRequest(BehaviourSchema), behaviourController.recordIncident);

export default router;
