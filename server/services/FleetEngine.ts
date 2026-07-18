import { dbManager } from '../database/dbClient.js';

export class FleetEngine {
  public async getFleetHealthScore(tenantId: string): Promise<any> {
    // Analytics logic: compute fleet health based on maintenance and breakdown logs
    const vehiclesRes = await dbManager.query(`SELECT COUNT(*) FROM vehicle_master WHERE tenant_id = $1 AND status = 'ACTIVE'`, [tenantId]);
    const maintenanceRes = await dbManager.query(`SELECT COUNT(*) FROM vehicle_maintenance WHERE tenant_id = $1`, [tenantId]);
    
    const vehicles = parseInt(vehiclesRes.rows[0].count);
    const maintenance = parseInt(maintenanceRes.rows[0].count);
    
    const healthScore = vehicles > 0 ? Math.max(0, 100 - (maintenance / vehicles) * 10) : 100;

    return {
      totalVehicles: vehicles,
      maintenanceRecords: maintenance,
      fleetHealthScore: healthScore
    };
  }
}

export const fleetEngine = new FleetEngine();
