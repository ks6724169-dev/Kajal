import { z } from 'zod';

export const CreateFeeStructureSchema = z.object({
  name: z.string().min(1),
  academicYearId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  totalAmount: z.number().positive(),
  installments: z.array(z.object({
    installmentName: z.string().min(1),
    dueDate: z.string().date(),
    amount: z.number().positive(),
    lateFeePerDay: z.number().nonnegative().optional()
  })).optional()
});

export const ReceivePaymentSchema = z.object({
  studentId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMode: z.string().min(1),
  referenceNumber: z.string().optional()
});

export const ApplyScholarshipSchema = z.object({
  studentId: z.string().uuid(),
  name: z.string().min(1),
  amount: z.number().positive()
});

export const ApplyConcessionSchema = z.object({
  studentId: z.string().uuid(),
  reason: z.string().min(1),
  amount: z.number().positive().optional(),
  percentage: z.number().positive().max(100).optional()
});

export const ProcessRefundSchema = z.object({
  studentId: z.string().uuid(),
  paymentId: z.string().uuid().optional(),
  amount: z.number().positive(),
  reason: z.string().min(1)
});

export const GenerateVoucherSchema = z.object({
  voucherType: z.enum(['PAYMENT', 'RECEIPT', 'JOURNAL', 'CONTRA']),
  voucherDate: z.string().date(),
  totalAmount: z.number().positive(),
  narration: z.string().optional(),
  entries: z.array(z.object({
    accountId: z.string().uuid(),
    debitAmount: z.number().nonnegative().optional(),
    creditAmount: z.number().nonnegative().optional()
  })).min(2)
});

export const RecordExpenseSchema = z.object({
  expenseCategory: z.string().min(1),
  amount: z.number().positive(),
  expenseDate: z.string().date(),
  paidTo: z.string().optional(),
  description: z.string().optional()
});
