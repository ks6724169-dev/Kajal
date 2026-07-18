import { dbManager } from '../database/dbClient.js';
import { aiGateway } from '../ai/AIGateway.js';

export class HostelAnalyticsEngine {
  public async getOccupancyReport(tenantId: string): Promise<any> {
    const beds = await dbManager.query(
      `SELECT count(*) as total, sum(case when is_occupied then 1 else 0 end) as occupied FROM hostel_bed WHERE tenant_id = $1 AND status = 'ACTIVE'`,
      [tenantId]
    );
    const total = parseInt(beds.rows[0].total) || 0;
    const occupied = parseInt(beds.rows[0].occupied) || 0;
    const vacant = total - occupied;

    return {
      totalBeds: total,
      occupiedBeds: occupied,
      vacantBeds: vacant,
      occupancyRate: total > 0 ? ((occupied / total) * 100).toFixed(2) : 0
    };
  }

  public async getMaintenanceAnalytics(tenantId: string): Promise<any> {
     const res = await dbManager.query(
         `SELECT status, count(*) as count FROM hostel_maintenance WHERE tenant_id = $1 GROUP BY status`,
         [tenantId]
     );
     return res.rows;
  }

  public async getOccupancyForecast(tenantId: string): Promise<any> {
     const report = await this.getOccupancyReport(tenantId);
     const prompt = `Based on the current occupancy data: ${JSON.stringify(report)}, forecast the trend for the next semester and suggest room capacity planning.`;
     const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);
     return {
         report,
         forecast: aiResponse.text
     };
  }
}

export const hostelAnalyticsEngine = new HostelAnalyticsEngine();
