import { UnitOfWork } from '../database/unitOfWork.js';
import { LiveLocationRepository } from '../repositories/TransportRepository.js';
import { dbManager } from '../database/dbClient.js';

export class GPSEngine {
  public async updateLiveLocation(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(LiveLocationRepository);
      const loc = await repo.insert({
        ...data,
        timestamp: new Date(),
        status: 'ACTIVE'
      });
      await uow.commit();
      return loc;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async getLatestLocation(tenantId: string, vehicleId: string): Promise<any> {
    const res = await dbManager.query(
      `SELECT * FROM live_location WHERE tenant_id = $1 AND vehicle_id = $2 ORDER BY timestamp DESC LIMIT 1`,
      [tenantId, vehicleId]
    );
    return res.rows[0];
  }
}

export const gpsEngine = new GPSEngine();
