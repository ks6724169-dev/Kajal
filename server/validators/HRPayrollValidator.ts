import { z } from 'zod';

export const MarkAttendanceSchema = z.object({
  employeeId: z.string().uuid(),
  date: z.string().date(),
  checkIn: z.string().datetime().optional(),
  checkOut: z.string().datetime().optional(),
  status: z.string().optional(),
  source: z.string().optional()
});

export const GPSAttendanceSchema = z.object({
  employeeId: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  punchTime: z.string().datetime(),
  punchType: z.string().optional()
});

export const ApplyLeaveSchema = z.object({
  employeeId: z.string().uuid(),
  leaveTypeId: z.string().uuid(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  days: z.number().positive(),
  reason: z.string().optional()
});

export const ApproveLeaveSchema = z.object({
  leaveApplicationId: z.string().uuid(),
  approvalStatus: z.string().min(1),
  comments: z.string().optional()
});

export const GeneratePayrollSchema = z.object({
  cycleId: z.string().uuid()
});

export const AddSalaryComponentSchema = z.object({
  structureId: z.string().uuid(),
  componentName: z.string().min(1),
  componentType: z.string().min(1),
  amountType: z.string().optional(),
  amountValue: z.number().optional()
});

export const ApplyLoanSchema = z.object({
  employeeId: z.string().uuid(),
  principalAmount: z.number().positive(),
  interestRate: z.number().nonnegative().optional(),
  tenureMonths: z.number().int().positive(),
  disbursementDate: z.string().date().optional()
});

export const ApplyReimbursementSchema = z.object({
  employeeId: z.string().uuid(),
  expenseType: z.string().optional(),
  amount: z.number().positive(),
  expenseDate: z.string().date(),
  description: z.string().optional()
});

export const AddBankAccountSchema = z.object({
  employeeId: z.string().uuid(),
  bankName: z.string().min(1),
  accountNumber: z.string().min(1),
  ifscCode: z.string().min(1),
  branchName: z.string().optional(),
  isPrimary: z.boolean().optional()
});
