import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  FeeStructureRepository, 
  FeeInstallmentRepository, 
  StudentFeeRepository,
  PaymentRepository,
  ReceiptRepository,
  ScholarshipRepository,
  ConcessionRepository,
  RefundRepository
} from '../repositories/FinanceRepository.js';
import { v4 as uuidv4 } from 'uuid';

export class FeeEngine {
  public async generateStudentFee(uow: UnitOfWork, studentId: string, structureId: string): Promise<any> {
    const structureRepo = uow.getRepository(FeeStructureRepository);
    const instRepo = uow.getRepository(FeeInstallmentRepository);
    const studentFeeRepo = uow.getRepository(StudentFeeRepository);
    
    const structure = await structureRepo.findOne(structureId);
    if (!structure) throw new Error('Fee Structure not found');
    
    const installments = await instRepo.findMany({ structureId, status: 'ACTIVE' } as any);
    
    const studentFees = [];
    for (const inst of installments) {
      const sf = await studentFeeRepo.insert({
        studentId,
        structureId,
        installmentId: inst.id,
        totalAmount: inst.amount,
        netAmount: inst.amount,
        balanceAmount: inst.amount,
        dueDate: inst.dueDate,
        isPaid: false,
        status: 'ACTIVE'
      });
      studentFees.push(sf);
    }
    return studentFees;
  }

  public async generateReceipt(uow: UnitOfWork, paymentId: string, studentId: string, amount: number): Promise<any> {
    const receiptRepo = uow.getRepository(ReceiptRepository);
    const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return await receiptRepo.insert({
      paymentId,
      receiptNumber,
      studentId,
      amount,
      status: 'ACTIVE'
    });
  }

  public async processRefund(uow: UnitOfWork, studentId: string, amount: number, reason: string, paymentId?: string): Promise<any> {
    const refundRepo = uow.getRepository(RefundRepository);
    return await refundRepo.insert({
      studentId,
      paymentId,
      amount,
      reason,
      refundDate: new Date(),
      isProcessed: true,
      status: 'ACTIVE'
    });
  }
}

export const feeEngine = new FeeEngine();
