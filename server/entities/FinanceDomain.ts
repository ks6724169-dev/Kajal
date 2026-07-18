import { BaseEntity } from './BaseEntity.js';

export interface FinancialYear extends BaseEntity {
  yearName: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  isClosed?: boolean;
}

export interface FeeCategory extends BaseEntity {
  name: string;
  description?: string;
}

export interface FeeHead extends BaseEntity {
  name: string;
  description?: string;
  isRefundable?: boolean;
  categoryId?: string;
}

export interface FeeStructure extends BaseEntity {
  name: string;
  academicYearId?: string;
  classId?: string;
  totalAmount: number;
}

export interface FeeInstallment extends BaseEntity {
  structureId: string;
  installmentName: string;
  dueDate: Date;
  amount: number;
  lateFeePerDay?: number;
}

export interface StudentFee extends BaseEntity {
  studentId: string;
  structureId?: string;
  installmentId?: string;
  totalAmount: number;
  concessionAmount?: number;
  scholarshipAmount?: number;
  fineAmount?: number;
  netAmount: number;
  paidAmount?: number;
  balanceAmount: number;
  dueDate?: Date;
  isPaid?: boolean;
}

export interface Payment extends BaseEntity {
  studentId: string;
  amount: number;
  paymentMode: string;
  paymentDate?: Date;
  referenceNumber?: string;
  isVerified?: boolean;
  verifiedBy?: string;
}

export interface Receipt extends BaseEntity {
  paymentId: string;
  receiptNumber: string;
  studentId: string;
  amount: number;
  generatedDate?: Date;
}

export interface FeeCollection extends BaseEntity {
  studentFeeId: string;
  paymentId: string;
  amountAllocated: number;
}

export interface Refund extends BaseEntity {
  studentId: string;
  paymentId?: string;
  amount: number;
  reason?: string;
  refundDate?: Date;
  isProcessed?: boolean;
}

export interface Scholarship extends BaseEntity {
  studentId: string;
  name: string;
  amount: number;
  approvedBy?: string;
}

export interface Concession extends BaseEntity {
  studentId: string;
  reason: string;
  percentage?: number;
  amount?: number;
  approvedBy?: string;
}

export interface Account extends BaseEntity {
  accountCode: string;
  accountName: string;
  accountGroup: string;
  openingBalance?: number;
  currentBalance?: number;
  balanceType?: string;
}

export interface Voucher extends BaseEntity {
  voucherNumber: string;
  voucherDate: Date;
  voucherType: string;
  totalAmount: number;
  narration?: string;
}

export interface Ledger extends BaseEntity {
  accountId: string;
  voucherId?: string;
  transactionDate: Date;
  debitAmount?: number;
  creditAmount?: number;
  narration?: string;
}

export interface JournalEntry extends BaseEntity {
  voucherId: string;
  accountId: string;
  debitAmount?: number;
  creditAmount?: number;
}

export interface CashBook extends BaseEntity {
  transactionDate: Date;
  receiptAmount?: number;
  paymentAmount?: number;
  balance: number;
  particulars?: string;
}

export interface BankAccount extends BaseEntity {
  bankName: string;
  accountNumber: string;
  ifscCode?: string;
  branchName?: string;
  currentBalance?: number;
}

export interface Expense extends BaseEntity {
  expenseCategory: string;
  amount: number;
  expenseDate: Date;
  paidTo?: string;
  description?: string;
  voucherId?: string;
}

export interface Income extends BaseEntity {
  incomeCategory: string;
  amount: number;
  incomeDate: Date;
  receivedFrom?: string;
  description?: string;
  voucherId?: string;
}

export interface Budget extends BaseEntity {
  financialYearId: string;
  department?: string;
  category: string;
  allocatedAmount: number;
  utilizedAmount?: number;
}

export interface Tax extends BaseEntity {
  taxName: string;
  percentage: number;
}

export interface GST extends BaseEntity {
  gstin: string;
  cgstPercentage?: number;
  sgstPercentage?: number;
  igstPercentage?: number;
}

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  studentId?: string;
  invoiceDate: Date;
  totalAmount: number;
  taxAmount?: number;
  netAmount: number;
}

export interface FeeReminder extends BaseEntity {
  studentId: string;
  studentFeeId?: string;
  reminderDate: Date;
  message?: string;
  isSent?: boolean;
}

export interface RevenueReport extends BaseEntity {
  reportDate: Date;
  totalCollection?: number;
  totalDue?: number;
  totalExpense?: number;
  netRevenue?: number;
}
