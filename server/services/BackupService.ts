import { TransactionManager } from '../database/transaction.js';
import { BackupJobRepository, RestoreRequestRepository } from '../repositories/BackupRepository.js';
import { BackupEngine } from './BackupEngine.js';

export class BackupService {
  constructor(private tenantId: string) {}

  async triggerBackup(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new BackupJobRepository(this.tenantId, tx);
      const job = await repo.insert({
        ...data,
        status: 'PENDING',
        created_by: userId
      });
      
      const engine = new BackupEngine(this.tenantId);
      const result = await engine.executeBackup(job.id, data.backup_type);
      
      await repo.update(job.id, {
        status: result.status,
        size_bytes: result.size_bytes,
        completed_at: new Date()
      }, job.version || 1);
      
      await tx.commit();
      return { ...job, status: result.status };
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async triggerRestore(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new RestoreRequestRepository(this.tenantId, tx);
      const request = await repo.insert({
        ...data,
        status: 'PENDING',
        requested_by: userId,
        created_by: userId
      });
      
      await repo.update(request.id, {
        status: 'COMPLETED'
      }, request.version || 1);
      
      await tx.commit();
      return { ...request, status: 'COMPLETED' };
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
