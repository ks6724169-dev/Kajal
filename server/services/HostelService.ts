import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  HostelRepository,
  HostelRoomRepository,
  HostelBedRepository,
  HostelLeaveRepository,
  VisitorRepository,
  VisitorPassRepository,
  GatePassRepository,
  HostelComplaintRepository,
  LaundryTransactionRepository
} from '../repositories/HostelRepository.js';
import { notificationEngine } from './NotificationEngine.js';

export class HostelService {
  
  public async registerHostel(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(HostelRepository);
      const hostel = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return hostel;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async registerRoom(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(HostelRoomRepository);
      const bedRepo = uow.getRepository(HostelBedRepository);
      
      const room = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });

      for (let i = 1; i <= room.capacity; i++) {
         await bedRepo.insert({
             roomId: room.id!,
             bedNumber: `${room.roomNumber}-${i}`,
             isOccupied: false,
             status: 'ACTIVE'
         });
      }

      await uow.commit();
      return room;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async applyLeave(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(HostelLeaveRepository);
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

  public async registerVisitor(tenantId: string, visitorData: any, visitData: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const visitorRepo = uow.getRepository(VisitorRepository);
      const passRepo = uow.getRepository(VisitorPassRepository);
      
      const visitor = await visitorRepo.insert({
         ...visitorData,
         status: 'ACTIVE'
      });

      const pass = await passRepo.insert({
         visitorId: visitor.id!,
         ...visitData,
         status: 'ACTIVE'
      });

      await uow.commit();
      
      try {
         await notificationEngine.sendInAppNotification(tenantId, visitData.studentId, 'Visitor Pass', `A visitor pass has been generated for ${visitor.visitorName}`);
      } catch (e) {}

      return { visitor, pass };
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async generateGatePass(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(GatePassRepository);
      const pass = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return pass;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async registerComplaint(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(HostelComplaintRepository);
      const complaint = await repo.insert({
        ...data,
        status: 'OPEN'
      });
      await uow.commit();
      return complaint;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async recordLaundry(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(LaundryTransactionRepository);
      const laundry = await repo.insert({
        ...data,
        status: 'PENDING'
      });
      await uow.commit();
      return laundry;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const hostelService = new HostelService();
