import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  PayrollRunRepository, PayslipRepository, SalaryComponentRepository 
} from '../repositories/HRPayrollRepository.js';

export class PayrollEngine {
  public async generatePayroll(tenantId: string, cycleId: string, processedBy: string): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const runRepo = uow.getRepository(PayrollRunRepository);
      
      const run = await runRepo.insert({
        cycleId,
        processedBy,
        runDate: new Date(),
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        status: 'PROCESSED'
      });

      await uow.commit();
      return run;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async addSalaryComponent(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(SalaryComponentRepository);
      const comp = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return comp;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const payrollEngine = new PayrollEngine();
