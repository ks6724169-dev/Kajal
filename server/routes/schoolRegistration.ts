import { Router } from 'express';
import { SchoolRegistrationController } from '../controllers/SchoolRegistrationController.js';

const router = Router();

router.post('/start', SchoolRegistrationController.start);
router.post('/calculate', SchoolRegistrationController.calculate);
router.post('/prepare-payment', SchoolRegistrationController.preparePayment);
router.post('/verify-payment', SchoolRegistrationController.verifyPayment);
router.post('/complete', SchoolRegistrationController.complete);
router.post('/:id/activate', SchoolRegistrationController.activate);
router.get('/:id/status', SchoolRegistrationController.status);
router.get('/:id/certificate', SchoolRegistrationController.certificate);
router.get('/:id/receipt', SchoolRegistrationController.receipt);
router.post('/webhook', SchoolRegistrationController.paymentWebhook);
router.get('/admin/registrations', SchoolRegistrationController.getAllRegistrations);
router.get('/admin/audit-logs', SchoolRegistrationController.getAuditLogs);

router.post('/:id', SchoolRegistrationController.update);
router.get('/:id', SchoolRegistrationController.get);

export default router;
