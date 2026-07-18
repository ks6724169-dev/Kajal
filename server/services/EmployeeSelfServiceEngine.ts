import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  EmployeeBankAccountRepository, ReimbursementRepository 
} from '../repositories/HRPayrollRepository.js';

export class EmployeeSelfServiceEngine {
  public async addBankAccount(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(EmployeeBankAccountRepository);
      const account = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return account;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async applyReimbursement(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(ReimbursementRepository);
      const claim = await repo.insert({
        ...data,
        status: 'PENDING'
      });
      await uow.commit();
      return claim;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const employeeSelfServiceEngine = new EmployeeSelfServiceEngine();
