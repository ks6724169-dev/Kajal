import { Router } from 'express';
import { hostelController } from '../controllers/HostelController.js';

const router = Router();

router.post('/hostels', hostelController.registerHostel.bind(hostelController));
router.post('/rooms', hostelController.registerRoom.bind(hostelController));
router.post('/allocations', hostelController.allocateBed.bind(hostelController));
router.post('/transfers', hostelController.transferRoom.bind(hostelController));
router.post('/leaves', hostelController.applyLeave.bind(hostelController));
router.post('/visitors', hostelController.registerVisitor.bind(hostelController));
router.post('/gate-passes', hostelController.generateGatePass.bind(hostelController));
router.post('/complaints', hostelController.registerComplaint.bind(hostelController));
router.post('/meals/attendance', hostelController.recordMealAttendance.bind(hostelController));
router.post('/laundry', hostelController.recordLaundry.bind(hostelController));

router.get('/analytics/occupancy-forecast', hostelController.getOccupancyForecast.bind(hostelController));
router.get('/mess-plans/:messPlanId/recommendations', hostelController.getMealRecommendations.bind(hostelController));
router.get('/allocations/smart-suggest', hostelController.getSmartAllocation.bind(hostelController));

export default router;
