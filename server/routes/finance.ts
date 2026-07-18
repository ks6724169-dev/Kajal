import { Router } from 'express';
import { financeController } from '../controllers/FinanceController.js';

const router = Router();

router.post('/fee-structures', financeController.createFeeStructure.bind(financeController));
router.post('/payments', financeController.receivePayment.bind(financeController));
router.post('/scholarships', financeController.applyScholarship.bind(financeController));
router.post('/refunds', financeController.processRefund.bind(financeController));
router.post('/vouchers', financeController.generateVoucher.bind(financeController));
router.get('/revenue-report', financeController.getRevenueAnalytics.bind(financeController));

export default router;
