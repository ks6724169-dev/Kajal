import { TransactionManager } from './transaction.js';
import { BaseRepository } from '../repositories/BaseRepository.js';
import { logger } from '../telemetry/logger.js';

export class UnitOfWork {
  private txManager: TransactionManager;
  private repositories: Map<string, any> = new Map();
  private isCommitted: boolean = false;

  constructor(private readonly tenantId: string) {
    this.txManager = new TransactionManager();
  }

  public async begin(): Promise<void> {
    await this.txManager.begin();
  }

  public getRepository<T extends BaseRepository<any>>(repoClass: new (tenantId: string, txManager: TransactionManager) => T): T {
    const repoName = repoClass.name;
    if (!this.repositories.has(repoName)) {
      this.repositories.set(repoName, new repoClass(this.tenantId, this.txManager));
    }
    return this.repositories.get(repoName);
  }

  public async commit(): Promise<void> {
    if (this.isCommitted) return;
    try {
      await this.txManager.commit();
      this.isCommitted = true;
    } catch (error) {
      logger.error('UnitOfWork commit failed, rolling back...', error);
      await this.rollback();
      throw error;
    }
  }

  public async rollback(): Promise<void> {
    if (this.isCommitted) return;
    await this.txManager.rollback();
    this.isCommitted = true;
  }

  public async dispose(): Promise<void> {
    if (!this.isCommitted) {
      await this.rollback();
    }
    this.repositories.clear();
  }
}
