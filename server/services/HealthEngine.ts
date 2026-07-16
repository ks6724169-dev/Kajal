import { UnitOfWork } from '../database/unitOfWork.js';
import { HealthRecordRepository, MedicalVisitRepository } from '../repositories/LifecycleRepository.js';
import { HealthRecord, MedicalVisit } from '../entities/LifecycleDomain.js';

export class HealthEngine {
  public async upsertHealthProfile(tenantId: string, payload: Partial<HealthRecord>): Promise<HealthRecord> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const healthRepo = uow.getRepository(HealthRecordRepository);
      
      // For simplicity in this phase, assuming insert. A real upsert would check if exists.
      const record = await healthRepo.insert(payload);
      
      await uow.commit();
      return record;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }

  public async logMedicalVisit(tenantId: string, payload: Partial<MedicalVisit>): Promise<MedicalVisit> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const visitRepo = uow.getRepository(MedicalVisitRepository);
      
      const visit = await visitRepo.insert({
        ...payload,
        visit_date: payload.visit_date || new Date()
      });
      
      await uow.commit();
      return visit;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.dispose();
    }
  }
}

export const healthEngine = new HealthEngine();
