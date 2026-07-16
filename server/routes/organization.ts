import { Router } from 'express';
import { organizationController } from '../controllers/OrganizationController.js';
import { validateRequest } from '../middlewares/validate.js';
import { OrganizationSchema, CampusSchema } from '../validators/MasterDataValidator.js';

const router = Router();

router.post('/', validateRequest(OrganizationSchema), organizationController.create);
router.post('/:orgId/campuses', validateRequest(CampusSchema), organizationController.createCampus);

export default router;
