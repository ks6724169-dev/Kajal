import { Router } from 'express';
import { libraryController } from '../controllers/LibraryController.js';

const router = Router();

router.post('/books', libraryController.registerBook.bind(libraryController));
router.post('/issues', libraryController.issueBook.bind(libraryController));
router.post('/returns', libraryController.returnBook.bind(libraryController));
router.post('/reservations', libraryController.reserveBook.bind(libraryController));
router.post('/digital-resources', libraryController.uploadDigitalResource.bind(libraryController));
router.post('/ai/recommendations', libraryController.aiRecommendation.bind(libraryController));
router.get('/search', libraryController.smartSearch.bind(libraryController));
router.get('/dashboard', libraryController.getDashboardMetrics.bind(libraryController));

export default router;
