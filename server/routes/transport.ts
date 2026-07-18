import { Router } from 'express';
import { transportController } from '../controllers/TransportController.js';

const router = Router();

router.get('/vehicles', transportController.getVehicles.bind(transportController));
router.post('/vehicles', transportController.registerVehicle.bind(transportController));
router.put('/vehicles/:id', transportController.updateVehicle.bind(transportController));
router.delete('/vehicles/:id', transportController.deleteVehicle.bind(transportController));
router.get('/drivers', transportController.getDrivers.bind(transportController));
router.post('/drivers', transportController.registerDriver.bind(transportController));
router.get('/routes', transportController.getRoutes.bind(transportController));
router.post('/routes', transportController.registerRoute.bind(transportController));
router.post('/students/assign', transportController.assignStudentTransport.bind(transportController));
router.post('/trips/start', transportController.startTrip.bind(transportController));
router.post('/trips/end', transportController.endTrip.bind(transportController));
router.post('/gps/location', transportController.updateLiveLocation.bind(transportController));
router.post('/emergency', transportController.raiseEmergencyAlert.bind(transportController));
router.get('/routes/:routeId/optimize', transportController.getRouteOptimization.bind(transportController));
router.get('/vehicles/:vehicleId/analytics', transportController.getVehicleAnalytics.bind(transportController));
router.get('/fleet/health', transportController.getFleetHealthScore.bind(transportController));

export default router;
