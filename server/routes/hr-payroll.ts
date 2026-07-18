import { Router } from 'express';
import { hrPayrollController } from '../controllers/HRPayrollController.js';
import { requireAuth, requireRole, requireTenant } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Attendance
router.post('/attendance', requireRole(['Employee', 'HR Manager', 'Super Admin']), hrPayrollController.markAttendance);
router.post('/attendance/gps', requireRole(['Employee', 'HR Manager', 'Super Admin']), hrPayrollController.markGPSAttendance);

// Leave
router.post('/leave', requireRole(['Employee', 'HR Manager', 'Super Admin']), hrPayrollController.applyLeave);
router.post('/leave/approve', requireRole(['Department Head', 'HR Manager', 'Principal', 'Super Admin']), hrPayrollController.approveLeave);

// Payroll
router.post('/payroll/generate', requireRole(['Payroll Manager', 'HR Manager', 'Super Admin']), hrPayrollController.generatePayroll);
router.post('/payroll/salary-component', requireRole(['Payroll Manager', 'HR Manager', 'Super Admin']), hrPayrollController.addSalaryComponent);

// ESS
router.post('/ess/bank-account', requireRole(['Employee', 'Super Admin']), hrPayrollController.addBankAccount);
router.post('/ess/reimbursement', requireRole(['Employee', 'Super Admin']), hrPayrollController.applyReimbursement);

// Analytics
router.get('/analytics/attendance', requireRole(['HR Manager', 'Principal', 'School Owner', 'Super Admin']), hrPayrollController.getAttendanceAnalytics);
router.get('/analytics/payroll', requireRole(['HR Manager', 'Payroll Manager', 'Principal', 'School Owner', 'Super Admin']), hrPayrollController.getPayrollForecast);

export default router;
