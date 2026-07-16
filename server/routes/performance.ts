import { Router } from 'express';
import { workforceController } from '../controllers/WorkforceController.js';
import { validateRequest } from '../middlewares/validate.js';
import { PerformanceReviewSchema } from '../validators/WorkforceValidator.js';

const router = Router();
router.post('/', validateRequest(PerformanceReviewSchema), workforceController.reviewPerformance);
export default router;
