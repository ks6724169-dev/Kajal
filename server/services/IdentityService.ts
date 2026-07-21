import { UserIdentityRepository, UserCredentialRepository } from '../repositories/SecurityRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class IdentityService {
  constructor(private tenantId: string) {}

  async registerIdentity(data: any, userId: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new UserIdentityRepository(this.tenantId, tx);
      const identity = await repo.insert({
        user_id: userId,
        identity_type: data.identity_type,
        identity_value: data.identity_value,
        is_verified: false
      });
      await tx.commit();
      return identity;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
