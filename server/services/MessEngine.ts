import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  MessRepository,
  MessPlanRepository,
  MealMenuRepository,
  MealAttendanceRepository
} from '../repositories/HostelRepository.js';
import { aiGateway } from '../ai/AIGateway.js';
import { dbManager } from '../database/dbClient.js';

export class MessEngine {
  public async createMessPlan(tenantId: string, messId: string, planName: string, dietType: string, monthlyFee: number): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(MessPlanRepository);
      const plan = await repo.insert({
        messId,
        planName,
        dietType,
        monthlyFee,
        status: 'ACTIVE'
      });
      await uow.commit();
      return plan;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async recordMealAttendance(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(MealAttendanceRepository);
      const attendance = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return attendance;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async getMealRecommendations(tenantId: string, messPlanId: string): Promise<any> {
      const menus = await dbManager.query(
          `SELECT day_of_week, meal_type, description FROM meal_menu WHERE tenant_id = $1 AND mess_plan_id = $2`,
          [tenantId, messPlanId]
      );
      const prompt = `Analyze this weekly mess menu and provide a nutritional breakdown and recommendation for improvement: ${JSON.stringify(menus.rows)}`;
      const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);
      
      return {
          currentMenu: menus.rows,
          aiFeedback: aiResponse.text
      };
  }
}

export const messEngine = new MessEngine();
