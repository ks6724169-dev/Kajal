import { UnitOfWork } from '../database/unitOfWork.js';
import { AttendanceRepository } from '../repositories/LifecycleRepository.js';
import { AttendanceStatus, AttendanceSource, Attendance } from '../entities/LifecycleDomain.js';
import { EmployeeAttendanceRepository, GPSAttendanceRepository } from '../repositories/HRPayrollRepository.js';

export class AttendanceEngine {
  public async markDailyAttendance(tenantId: string, payload: Partial<Attendance>): Promise<Attendance> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const attendanceRepo = uow.getRepository(AttendanceRepository);
      
      const record = await attendanceRepo.insert({
        ...payload,
        is_locked: false
      });
      
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async lockAttendance(tenantId: string, attendanceId: string, approvedBy: string): Promise<Attendance> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const attendanceRepo = uow.getRepository(AttendanceRepository);
      const attendance = await attendanceRepo.findOne(attendanceId);
      
      if (!attendance) throw new Error('Attendance record not found');
      
      const updated = await attendanceRepo.update(attendanceId, { 
        is_locked: true, 
        approved_by: approvedBy 
      }, attendance.version);
      
      await uow.commit();
      return updated!;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async markEmployeeAttendance(tenantId: string, payload: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(EmployeeAttendanceRepository);
      const record = await repo.insert({
        ...payload,
        status: payload.status || 'PRESENT',
        source: payload.source || 'MANUAL',
        recordStatus: 'ACTIVE'
      });
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async markEmployeeGPSAttendance(tenantId: string, payload: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(GPSAttendanceRepository);
      const record = await repo.insert({
        ...payload,
        status: 'ACTIVE'
      });
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
}

export const attendanceEngine = new AttendanceEngine();
