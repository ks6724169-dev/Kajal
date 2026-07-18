import { dbManager } from '../database/dbClient.js';
import { aiGateway } from '../ai/AIGateway.js';

export class RevenueAnalyticsEngine {
  public async getRevenueReport(tenantId: string): Promise<any> {
    const totalPayments = await dbManager.query(
      `SELECT SUM(amount) as total FROM payment WHERE tenant_id = $1 AND status = 'ACTIVE'`,
      [tenantId]
    );
    const totalDue = await dbManager.query(
      `SELECT SUM(balance_amount) as total FROM student_fee WHERE tenant_id = $1 AND status = 'ACTIVE' AND is_paid = false`,
      [tenantId]
    );

    return {
      totalCollected: parseFloat(totalPayments.rows[0].total || '0'),
      totalDue: parseFloat(totalDue.rows[0].total || '0')
    };
  }

  public async getRevenueForecast(tenantId: string): Promise<any> {
    const report = await this.getRevenueReport(tenantId);
    const prompt = `Analyze the following revenue data and provide a brief forecast: Collection: ${report.totalCollected}, Due: ${report.totalDue}`;
    const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);
    return {
       report,
       forecast: aiResponse.text
    };
  }
}

export const revenueAnalyticsEngine = new RevenueAnalyticsEngine();
