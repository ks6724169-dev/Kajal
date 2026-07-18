import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  VoucherRepository, 
  LedgerRepository, 
  JournalEntryRepository,
  AccountRepository
} from '../repositories/FinanceRepository.js';

export class AccountingEngine {
  public async postVoucher(uow: UnitOfWork, voucherType: string, voucherDate: Date, totalAmount: number, narration: string, entries: any[]): Promise<any> {
    const voucherRepo = uow.getRepository(VoucherRepository);
    const journalRepo = uow.getRepository(JournalEntryRepository);
    const ledgerRepo = uow.getRepository(LedgerRepository);
    const accountRepo = uow.getRepository(AccountRepository);

    let totalDebit = 0;
    let totalCredit = 0;
    for (const entry of entries) {
      totalDebit += entry.debitAmount || 0;
      totalCredit += entry.creditAmount || 0;
    }
    if (totalDebit !== totalCredit) {
      throw new Error('Debit and Credit must be equal');
    }

    const voucherNumber = `VCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const voucher = await voucherRepo.insert({
      voucherNumber,
      voucherDate,
      voucherType,
      totalAmount,
      narration,
      status: 'ACTIVE'
    });

    for (const entry of entries) {
      await journalRepo.insert({
        voucherId: voucher.id!,
        accountId: entry.accountId,
        debitAmount: entry.debitAmount || 0,
        creditAmount: entry.creditAmount || 0,
        status: 'ACTIVE'
      });

      await ledgerRepo.insert({
        accountId: entry.accountId,
        voucherId: voucher.id!,
        transactionDate: voucherDate,
        debitAmount: entry.debitAmount || 0,
        creditAmount: entry.creditAmount || 0,
        narration,
        status: 'ACTIVE'
      });

      // Update account balance
      const acc = await accountRepo.findOne(entry.accountId);
      if (acc) {
         let currentBalance = Number(acc.currentBalance || 0);
         if (acc.balanceType === 'DEBIT') {
            currentBalance = currentBalance + (entry.debitAmount || 0) - (entry.creditAmount || 0);
         } else {
            currentBalance = currentBalance + (entry.creditAmount || 0) - (entry.debitAmount || 0);
         }
         await accountRepo.update(entry.accountId, { currentBalance }, acc.version);
      }
    }

    return voucher;
  }
}

export const accountingEngine = new AccountingEngine();
