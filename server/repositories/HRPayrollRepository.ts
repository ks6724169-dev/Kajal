import { BaseRepository } from './BaseRepository.js';
import {
  EmployeeAttendance, AttendanceCorrection, BiometricAttendance, FaceAttendance,
  GPSAttendance, Shift, ShiftAssignment, Holiday, LeaveType, LeaveBalance,
  LeaveApplication, LeaveApproval, PayrollCycle, SalaryStructure, SalaryComponent,
  EmployeeSalary, Payslip, PayrollRun, PayrollAdjustment, Bonus, Incentive,
  Deduction, Loan, LoanInstallment, AdvanceSalary, Reimbursement, Claim,
  TaxProfile, PFAccount, ESIAccount, ProfessionalTax, TDSProfile, PayrollLedger,
  EmployeeDocument, EmployeeBankAccount, EmployeeSelfService, PayrollAudit
} from '../entities/HRPayrollDomain.js';

export class EmployeeAttendanceRepository extends BaseRepository<EmployeeAttendance> { protected tableName = 'employee_attendance'; }
export class AttendanceCorrectionRepository extends BaseRepository<AttendanceCorrection> { protected tableName = 'attendance_correction'; }
export class BiometricAttendanceRepository extends BaseRepository<BiometricAttendance> { protected tableName = 'biometric_attendance'; }
export class FaceAttendanceRepository extends BaseRepository<FaceAttendance> { protected tableName = 'face_attendance'; }
export class GPSAttendanceRepository extends BaseRepository<GPSAttendance> { protected tableName = 'gps_attendance'; }
export class ShiftRepository extends BaseRepository<Shift> { protected tableName = 'shift_master'; }
export class ShiftAssignmentRepository extends BaseRepository<ShiftAssignment> { protected tableName = 'shift_assignment'; }
export class HolidayRepository extends BaseRepository<Holiday> { protected tableName = 'holiday_master'; }
export class LeaveTypeRepository extends BaseRepository<LeaveType> { protected tableName = 'leave_type'; }
export class LeaveBalanceRepository extends BaseRepository<LeaveBalance> { protected tableName = 'leave_balance'; }
export class LeaveApplicationRepository extends BaseRepository<LeaveApplication> { protected tableName = 'leave_application'; }
export class LeaveApprovalRepository extends BaseRepository<LeaveApproval> { protected tableName = 'leave_approval'; }
export class PayrollCycleRepository extends BaseRepository<PayrollCycle> { protected tableName = 'payroll_cycle'; }
export class SalaryStructureRepository extends BaseRepository<SalaryStructure> { protected tableName = 'salary_structure'; }
export class SalaryComponentRepository extends BaseRepository<SalaryComponent> { protected tableName = 'salary_component'; }
export class EmployeeSalaryRepository extends BaseRepository<EmployeeSalary> { protected tableName = 'employee_salary'; }
export class PayslipRepository extends BaseRepository<Payslip> { protected tableName = 'payslip'; }
export class PayrollRunRepository extends BaseRepository<PayrollRun> { protected tableName = 'payroll_run'; }
export class PayrollAdjustmentRepository extends BaseRepository<PayrollAdjustment> { protected tableName = 'payroll_adjustment'; }
export class BonusRepository extends BaseRepository<Bonus> { protected tableName = 'payroll_bonus'; }
export class IncentiveRepository extends BaseRepository<Incentive> { protected tableName = 'payroll_incentive'; }
export class DeductionRepository extends BaseRepository<Deduction> { protected tableName = 'payroll_deduction'; }
export class LoanRepository extends BaseRepository<Loan> { protected tableName = 'employee_loan'; }
export class LoanInstallmentRepository extends BaseRepository<LoanInstallment> { protected tableName = 'loan_installment'; }
export class AdvanceSalaryRepository extends BaseRepository<AdvanceSalary> { protected tableName = 'advance_salary'; }
export class ReimbursementRepository extends BaseRepository<Reimbursement> { protected tableName = 'reimbursement'; }
export class ClaimRepository extends BaseRepository<Claim> { protected tableName = 'claim'; }
export class TaxProfileRepository extends BaseRepository<TaxProfile> { protected tableName = 'tax_profile'; }
export class PFAccountRepository extends BaseRepository<PFAccount> { protected tableName = 'pf_account'; }
export class ESIAccountRepository extends BaseRepository<ESIAccount> { protected tableName = 'esi_account'; }
export class ProfessionalTaxRepository extends BaseRepository<ProfessionalTax> { protected tableName = 'professional_tax'; }
export class TDSProfileRepository extends BaseRepository<TDSProfile> { protected tableName = 'tds_profile'; }
export class PayrollLedgerRepository extends BaseRepository<PayrollLedger> { protected tableName = 'payroll_ledger'; }
export class EmployeeDocumentRepository extends BaseRepository<EmployeeDocument> { protected tableName = 'employee_document'; }
export class EmployeeBankAccountRepository extends BaseRepository<EmployeeBankAccount> { protected tableName = 'employee_bank_account'; }
export class EmployeeSelfServiceRepository extends BaseRepository<EmployeeSelfService> { protected tableName = 'employee_self_service'; }
export class PayrollAuditRepository extends BaseRepository<PayrollAudit> { protected tableName = 'payroll_audit'; }
