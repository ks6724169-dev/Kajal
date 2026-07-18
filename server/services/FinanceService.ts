import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  FeeStructureRepository,
  FeeInstallmentRepository,
  PaymentRepository,
  ScholarshipRepository,
  ConcessionRepository,
  ExpenseRepository,
  StudentFeeRepository
} from '../repositories/FinanceRepository.js';
import { feeEngine } from './FeeEngine.js';
import { accountingEngine } from './AccountingEngine.js';
import { revenueAnalyticsEngine } from './RevenueAnalyticsEngine.js';
import { notificationEngine } from './NotificationEngine.js'; // Assuming we have this exported similarly to Phase 03.2H

export class FinanceService {

  public async createFeeStructure(tenantId: string, data: any, installments: any[]): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(FeeStructureRepository);
      const instRepo = uow.getRepository(FeeInstallmentRepository);

      const structure = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });

      if (installments && installments.length > 0) {
        for (const inst of installments) {
           await instRepo.insert({
              structureId: structure.id!,
              ...inst,
              status: 'ACTIVE'
           });
        }
      }
      
      await uow.commit();
      return structure;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async receivePayment(tenantId: string, studentId: string, amount: number, paymentMode: string, referenceNumber?: string): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(PaymentRepository);
      const payment = await repo.insert({
         studentId,
         amount,
         paymentMode,
         referenceNumber,
         isVerified: true,
         status: 'ACTIVE'
      });

      // Simple implementation: automatically generate receipt
      const receipt = await feeEngine.generateReceipt(uow, payment.id!, studentId, amount);
      
      // Update student fees sequentially (simple FIFO logic)
      const sfRepo = uow.getRepository(StudentFeeRepository);
      const dueFees = await sfRepo.findMany({ studentId, isPaid: false, status: 'ACTIVE' } as any);
      let remainingAmount = amount;
      
      for (const fee of dueFees) {
         if (remainingAmount <= 0) break;
         let balance = Number(fee.balanceAmount);
         const paid = Math.min(balance, remainingAmount);
         balance -= paid;
         remainingAmount -= paid;
         
         await sfRepo.update(fee.id!, { 
            paidAmount: Number(fee.paidAmount || 0) + paid,
            balanceAmount: balance,
            isPaid: balance <= 0
         }, fee.version);
      }

      await uow.commit();
      
      // Attempt to notify (catch error to avoid breaking payment flow if notification fails)
      try {
         await notificationEngine.sendInAppNotification(tenantId, studentId, 'Payment Received', `Received payment of ${amount} successfully. Receipt ${receipt.receiptNumber}`);
      } catch (err) {}

      return { payment, receipt };
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async applyScholarship(tenantId: string, studentId: string, name: string, amount: number): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(ScholarshipRepository);
      const scholarship = await repo.insert({
         studentId,
         name,
         amount,
         status: 'ACTIVE'
      });
      await uow.commit();
      return scholarship;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async generateVoucher(tenantId: string, voucherType: string, voucherDate: Date, totalAmount: number, narration: string, entries: any[]): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const voucher = await accountingEngine.postVoucher(uow, voucherType, voucherDate, totalAmount, narration, entries);
      await uow.commit();
      return voucher;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async getRevenueAnalytics(tenantId: string): Promise<any> {
     return await revenueAnalyticsEngine.getRevenueForecast(tenantId);
  }

}

export const financeService = new FinanceService();
