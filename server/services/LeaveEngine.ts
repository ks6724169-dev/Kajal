import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  LeaveApplicationRepository, LeaveApprovalRepository, LeaveBalanceRepository 
} from '../repositories/HRPayrollRepository.js';

export class LeaveEngine {
  public async applyLeave(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(LeaveApplicationRepository);
      const leave = await repo.insert({
        ...data,
        status: 'PENDING'
      });
      await uow.commit();
      return leave;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async approveLeave(tenantId: string, leaveApplicationId: string, approverId: string, approvalStatus: string, comments?: string): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const approvalRepo = uow.getRepository(LeaveApprovalRepository);
      const appRepo = uow.getRepository(LeaveApplicationRepository);
      
      const application = await appRepo.findOne(leaveApplicationId);
      if (!application) throw new Error('Leave application not found');

      const approval = await approvalRepo.insert({
        leaveApplicationId,
        approverId,
        approvalStatus,
        comments,
        approvalDate: new Date(),
        status: 'ACTIVE'
      });

      await appRepo.update(leaveApplicationId, { status: approvalStatus }, application.version);

      await uow.commit();
      return approval;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const leaveEngine = new LeaveEngine();
