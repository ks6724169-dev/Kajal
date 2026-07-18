import { Router } from 'express';
import { communicationController } from '../controllers/CommunicationController.js';

const router = Router();

router.post('/notifications', communicationController.sendNotification.bind(communicationController));
router.post('/announcements', communicationController.createAnnouncement.bind(communicationController));
router.post('/circulars', communicationController.createCircular.bind(communicationController));
router.post('/messages', communicationController.sendInternalMessage.bind(communicationController));
router.post('/broadcasts', communicationController.sendBroadcast.bind(communicationController));
router.post('/reminders', communicationController.scheduleReminder.bind(communicationController));
router.put('/notifications/:id/read', communicationController.markRead.bind(communicationController));

export default router;
