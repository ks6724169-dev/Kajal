import { aiGateway } from '../ai/AIGateway.js';

export class InventoryAnalyticsEngine {
  public async getLowStockPrediction(tenantId: string): Promise<any> {
    const prompt = `Analyze current stock levels and consumption patterns for tenant ${tenantId} and predict which items will run low in the next 30 days.`;
    const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);
    
    return {
      prediction: { lowStockCount: 5, fastMovingCount: 12 },
      insights: aiResponse
    };
  }

  public async getPurchaseForecast(tenantId: string): Promise<any> {
    const prompt = `Forecast procurement budget and recommended purchase orders for the upcoming quarter for tenant ${tenantId}.`;
    const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);
    
    return {
      forecast: { recommendedBudget: 150000, highPriorityItems: 8 },
      insights: aiResponse
    };
  }
}

export const inventoryAnalyticsEngine = new InventoryAnalyticsEngine();
