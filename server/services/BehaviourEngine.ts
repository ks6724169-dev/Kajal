import { UnitOfWork } from '../database/unitOfWork.js';
import { BehaviourRepository } from '../repositories/LifecycleRepository.js';
import { BehaviourRecord, BehaviourType } from '../entities/LifecycleDomain.js';

export class BehaviourEngine {
  public async recordIncident(tenantId: string, payload: Partial<BehaviourRecord>): Promise<BehaviourRecord> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const behaviourRepo = uow.getRepository(BehaviourRepository);
      
      const record = await behaviourRepo.insert({
        ...payload,
        incident_date: payload.incident_date || new Date(),
        parent_notified: false
      });
      
      // Hook: notificationPlatform.notify(...) if payload.is_principal_review_required
      
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

export const behaviourEngine = new BehaviourEngine();
