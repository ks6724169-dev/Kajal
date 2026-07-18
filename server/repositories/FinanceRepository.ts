import { BaseRepository } from './BaseRepository.js';
import {
  FinancialYear, FeeCategory, FeeHead, FeeStructure, FeeInstallment,
  StudentFee, Payment, Receipt, FeeCollection, Refund, Scholarship, Concession,
  Account, Voucher, Ledger, JournalEntry, CashBook, BankAccount, Expense, Income,
  Budget, Tax, GST, Invoice, FeeReminder, RevenueReport
} from '../entities/FinanceDomain.js';

export class FinancialYearRepository extends BaseRepository<FinancialYear> {
  protected tableName = 'financial_year';
}
export class FeeCategoryRepository extends BaseRepository<FeeCategory> {
  protected tableName = 'fee_category';
}
export class FeeHeadRepository extends BaseRepository<FeeHead> {
  protected tableName = 'fee_head';
}
export class FeeStructureRepository extends BaseRepository<FeeStructure> {
  protected tableName = 'fee_structure';
}
export class FeeInstallmentRepository extends BaseRepository<FeeInstallment> {
  protected tableName = 'fee_installment';
}
export class StudentFeeRepository extends BaseRepository<StudentFee> {
  protected tableName = 'student_fee';
}
export class PaymentRepository extends BaseRepository<Payment> {
  protected tableName = 'payment';
}
export class ReceiptRepository extends BaseRepository<Receipt> {
  protected tableName = 'receipt';
}
export class FeeCollectionRepository extends BaseRepository<FeeCollection> {
  protected tableName = 'fee_collection';
}
export class RefundRepository extends BaseRepository<Refund> {
  protected tableName = 'refund';
}
export class ScholarshipRepository extends BaseRepository<Scholarship> {
  protected tableName = 'scholarship';
}
export class ConcessionRepository extends BaseRepository<Concession> {
  protected tableName = 'concession';
}
export class AccountRepository extends BaseRepository<Account> {
  protected tableName = 'account';
}
export class VoucherRepository extends BaseRepository<Voucher> {
  protected tableName = 'voucher';
}
export class LedgerRepository extends BaseRepository<Ledger> {
  protected tableName = 'ledger';
}
export class JournalEntryRepository extends BaseRepository<JournalEntry> {
  protected tableName = 'journal_entry';
}
export class CashBookRepository extends BaseRepository<CashBook> {
  protected tableName = 'cash_book';
}
export class BankAccountRepository extends BaseRepository<BankAccount> {
  protected tableName = 'bank_account';
}
export class ExpenseRepository extends BaseRepository<Expense> {
  protected tableName = 'expense';
}
export class IncomeRepository extends BaseRepository<Income> {
  protected tableName = 'income';
}
export class BudgetRepository extends BaseRepository<Budget> {
  protected tableName = 'budget';
}
export class TaxRepository extends BaseRepository<Tax> {
  protected tableName = 'tax';
}
export class GSTRepository extends BaseRepository<GST> {
  protected tableName = 'gst';
}
export class InvoiceRepository extends BaseRepository<Invoice> {
  protected tableName = 'invoice';
}
export class FeeReminderRepository extends BaseRepository<FeeReminder> {
  protected tableName = 'fee_reminder';
}
export class RevenueReportRepository extends BaseRepository<RevenueReport> {
  protected tableName = 'revenue_report';
}
