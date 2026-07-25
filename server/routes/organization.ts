import { Router } from 'express';
import { organizationController } from '../controllers/OrganizationController.js';
import { validateRequest } from '../middlewares/validate.js';
import { OrganizationSchema, CampusSchema } from '../validators/MasterDataValidator.js';

const router = Router();

router.get('/', organizationController.getDetails);
router.post('/', validateRequest(OrganizationSchema), organizationController.create);
router.put('/:orgId', organizationController.updateDetails);
router.post('/:orgId/campuses', validateRequest(CampusSchema), organizationController.createCampus);
router.post('/:orgId/documents', organizationController.addDoc);
router.delete('/:orgId/documents/:docId', organizationController.deleteDoc);
router.get('/users', organizationController.getUsers);
router.get('/audit-logs', organizationController.getAudit);

export default router;
