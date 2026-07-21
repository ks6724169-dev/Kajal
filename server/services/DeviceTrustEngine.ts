import { TrustedDeviceRepository } from '../repositories/SecurityRepository.js';
import { TransactionManager } from '../database/transaction.js';

export class DeviceTrustEngine {
  constructor(private tenantId: string) {}

  async trustDevice(userId: string, deviceIdentifier: string, deviceName?: string) {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new TrustedDeviceRepository(this.tenantId, tx);
      const device = await repo.insert({
        user_id: userId,
        device_identifier: deviceIdentifier,
        device_name: deviceName,
        trusted_at: new Date(),
        last_used_at: new Date(),
        is_revoked: false
      });
      await tx.commit();
      return device;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
