import { BaseEntity } from './BaseEntity.js';

export interface Shift extends BaseEntity {
  shiftName: string;
  startTime: string;
  endTime: string;
  halfDayHours?: number;
  fullDayHours?: number;
  graceTimeMins?: number;
}

export interface ShiftAssignment extends BaseEntity {
  employeeId: string;
  shiftId: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface Holiday extends BaseEntity {
  holidayName: string;
  holidayDate: Date;
  holidayType?: string;
}

export interface EmployeeAttendance extends BaseEntity {
  employeeId: string;
  date: Date;
  status: string;
  source: string;
  checkIn?: Date;
  checkOut?: Date;
  lateMins?: number;
  earlyExitMins?: number;
  overtimeMins?: number;
  shiftId?: string;
  recordStatus?: string;
}

export interface BiometricAttendance extends BaseEntity {
  employeeId: string;
  deviceId?: string;
  punchTime: Date;
  punchType?: string;
}

export interface GPSAttendance extends BaseEntity {
  employeeId: string;
  latitude: number;
  longitude: number;
  punchTime: Date;
  punchType?: string;
}

export interface FaceAttendance extends BaseEntity {
  employeeId: string;
  faceImageUrl?: string;
  confidenceScore?: number;
  punchTime: Date;
  punchType?: string;
}

export interface AttendanceCorrection extends BaseEntity {
  employeeId: string;
  attendanceDate: Date;
  requestedCheckIn?: Date;
  requestedCheckOut?: Date;
  reason?: string;
  approvedBy?: string;
}

export interface LeaveType extends BaseEntity {
  typeName: string;
  description?: string;
  yearlyLimit?: number;
  carryForward?: boolean;
}

export interface LeaveBalance extends BaseEntity {
  employeeId: string;
  leaveTypeId: string;
  financialYear: string;
  allocatedDays: number;
  usedDays?: number;
  balanceDays: number;
}

export interface LeaveApplication extends BaseEntity {
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
}

export interface LeaveApproval extends BaseEntity {
  leaveApplicationId: string;
  approverId: string;
  approvalDate: Date;
  comments?: string;
  approvalStatus: string;
}

export interface PayrollCycle extends BaseEntity {
  cycleName: string;
  startDate: Date;
  endDate: Date;
  paymentDate: Date;
}

export interface SalaryStructure extends BaseEntity {
  structureName: string;
  description?: string;
}

export interface SalaryComponent extends BaseEntity {
  structureId: string;
  componentName: string;
  componentType: string;
  amountType?: string;
  amountValue?: number;
}

export interface EmployeeSalary extends BaseEntity {
  employeeId: string;
  structureId: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  annualCtc?: number;
}

export interface PayrollRun extends BaseEntity {
  cycleId: string;
  runDate?: Date;
  processedBy?: string;
  totalGross?: number;
  totalDeductions?: number;
  totalNet?: number;
}

export interface Payslip extends BaseEntity {
  employeeId: string;
  payrollRunId: string;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  pdfUrl?: string;
}

export interface PayrollAdjustment extends BaseEntity {
  employeeId: string;
  payrollRunId?: string;
  adjustmentType?: string;
  amount: number;
  reason?: string;
}

export interface Bonus extends BaseEntity {
  employeeId: string;
  bonusType?: string;
  amount: number;
  awardDate?: Date;
}

export interface Incentive extends BaseEntity {
  employeeId: string;
  incentiveType?: string;
  amount: number;
  awardDate?: Date;
}

export interface Deduction extends BaseEntity {
  employeeId: string;
  deductionType?: string;
  amount: number;
  deductionDate?: Date;
}

export interface Loan extends BaseEntity {
  employeeId: string;
  principalAmount: number;
  interestRate?: number;
  tenureMonths: number;
  emiAmount?: number;
  disbursementDate?: Date;
}

export interface LoanInstallment extends BaseEntity {
  loanId: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  isPaid?: boolean;
  paidDate?: Date;
}

export interface AdvanceSalary extends BaseEntity {
  employeeId: string;
  amount: number;
  requestDate: Date;
  recoveryMonth?: string;
}

export interface Reimbursement extends BaseEntity {
  employeeId: string;
  expenseType?: string;
  amount: number;
  expenseDate: Date;
  description?: string;
  receiptUrl?: string;
}

export interface Claim extends BaseEntity {
  employeeId: string;
  claimType?: string;
  amount: number;
  claimDate: Date;
  description?: string;
  documentUrl?: string;
}

export interface TaxProfile extends BaseEntity {
  employeeId: string;
  panNumber?: string;
  taxRegime?: string;
}

export interface PFAccount extends BaseEntity {
  employeeId: string;
  uanNumber?: string;
  pfNumber?: string;
}

export interface ESIAccount extends BaseEntity {
  employeeId: string;
  esiNumber?: string;
  dispensary?: string;
}

export interface ProfessionalTax extends BaseEntity {
  employeeId: string;
  state?: string;
  ptNumber?: string;
}

export interface TDSProfile extends BaseEntity {
  employeeId: string;
  financialYear?: string;
  totalTaxLiability?: number;
  tdsDeducted?: number;
}

export interface PayrollLedger extends BaseEntity {
  payrollRunId?: string;
  accountType?: string;
  amount?: number;
  transactionType?: string;
}

export interface EmployeeDocument extends BaseEntity {
  employeeId: string;
  documentType?: string;
  documentUrl: string;
}

export interface EmployeeBankAccount extends BaseEntity {
  employeeId: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
  isPrimary?: boolean;
}

export interface EmployeeSelfService extends BaseEntity {
  employeeId: string;
  requestType?: string;
  requestData?: any;
}

export interface PayrollAudit extends BaseEntity {
  payrollRunId?: string;
  auditedBy?: string;
  auditDate?: Date;
  findings?: string;
}
