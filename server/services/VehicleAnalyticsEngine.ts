import { dbManager } from '../database/dbClient.js';
import { aiGateway } from '../ai/AIGateway.js';

export class VehicleAnalyticsEngine {
  public async getVehicleAnalytics(tenantId: string, vehicleId: string): Promise<any> {
    const fuelRes = await dbManager.query(
      `SELECT SUM(quantity_liters) as total_fuel, SUM(cost) as total_cost FROM fuel_log WHERE tenant_id = $1 AND vehicle_id = $2`,
      [tenantId, vehicleId]
    );

    const tripRes = await dbManager.query(
      `SELECT COUNT(*) as total_trips FROM trip_master WHERE tenant_id = $1 AND vehicle_id = $2`,
      [tenantId, vehicleId]
    );

    const report = {
      fuelConsumed: fuelRes.rows[0].total_fuel || 0,
      fuelCost: fuelRes.rows[0].total_cost || 0,
      totalTrips: tripRes.rows[0].total_trips || 0
    };

    const prompt = `Analyze the vehicle data: Fuel Consumed: \${report.fuelConsumed} L, Total Cost: \${report.fuelCost}, Total Trips: \${report.totalTrips}. Provide a brief health check.`;
    const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);

    return {
      report,
      aiAnalysis: aiResponse.text
    };
  }
}

export const vehicleAnalyticsEngine = new VehicleAnalyticsEngine();
