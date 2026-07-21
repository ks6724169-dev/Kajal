import { Router } from 'express';
import { SchoolRegistrationController } from '../controllers/SchoolRegistrationController.js';

const router = Router();

router.post('/start', SchoolRegistrationController.start);
router.post('/complete', SchoolRegistrationController.complete);
router.get('/:id', SchoolRegistrationController.get);

export default router;
