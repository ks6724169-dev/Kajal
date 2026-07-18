import { aiGateway } from '../ai/AIGateway.js';
import { dbManager } from '../database/dbClient.js';

export class RouteOptimizationEngine {
  public async optimizeRoute(tenantId: string, routeId: string): Promise<any> {
    const stopsRes = await dbManager.query(
      `SELECT stop_name, stop_order, latitude, longitude FROM route_stop WHERE tenant_id = $1 AND route_id = $2 ORDER BY stop_order ASC`,
      [tenantId, routeId]
    );

    const prompt = `Optimize the following bus route stops for better fuel efficiency and less travel time: \${JSON.stringify(stopsRes.rows)}. Suggest a new ordering if applicable.`;
    const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);

    return {
      originalStops: stopsRes.rows,
      aiOptimization: aiResponse.text
    };
  }
}

export const routeOptimizationEngine = new RouteOptimizationEngine();
