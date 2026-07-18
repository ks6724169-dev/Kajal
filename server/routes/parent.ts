import { Router } from 'express';
import { parentController } from '../controllers/ParentController.js';

const router = Router();

// Parents CRUD
router.post('/', parentController.createParent);
router.get('/:id', parentController.getParent);
router.patch('/:id', parentController.updateParent);
router.delete('/:id', parentController.deleteParent);

// Families
router.post('/families', parentController.registerFamily);
router.post('/families/merge', parentController.mergeFamilies);
router.post('/families/split', parentController.splitFamily);
router.get('/families/:id/tree', parentController.getFamilyTree);

// Links/Relational mappings
router.post('/link', parentController.linkParentToStudent);
router.post('/unlink', parentController.removeParentMapping);

// Guardians
router.post('/guardians', parentController.createGuardian);
router.patch('/guardians/:id/verify', parentController.verifyGuardian);

// Emergency Contacts and Pickups
router.post('/emergency-contacts', parentController.registerEmergencyContact);
router.post('/pickups', parentController.authorizePickup);

// Notification preferences and Consents
router.patch('/:parentId/preferences', parentController.updateNotificationPreference);
router.post('/consents', parentController.updateDigitalConsent);

// Activate parent portal
router.patch('/:id/activate-portal', parentController.activateParentPortal);

export default router;
