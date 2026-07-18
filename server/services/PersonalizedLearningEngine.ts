import { aiGateway } from '../ai/AIGateway.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { AIStudyPlanRepository, AIRecommendationRepository } from '../repositories/AcademicIntelligenceRepository.js';
import { AIStudyPlan, AIRecommendation } from '../entities/AcademicIntelligenceDomain.js';

export class PersonalizedLearningEngine {
  public async generateStudyPlan(
    tenantId: string,
    studentId: string,
    planType: 'WEEKLY' | 'DAILY' | 'REVISION',
    context: string
  ): Promise<AIStudyPlan> {
    const prompt = `Generate a ${planType} study plan for a student given this context: ${context}. Output JSON with tasks, subjects, and estimated duration.`;
    
    const aiResponse = await aiGateway.generateJSON<any>(
      tenantId,
      prompt,
      '{"tasks": [{"subject": "string", "topic": "string", "durationMins": number, "description": "string"}]}'
    );

    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(AIStudyPlanRepository);
      const plan = await repo.insert({
        studentId,
        planType,
        planData: aiResponse,
        generatedDate: new Date(),
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

  public async generateRecommendation(
    tenantId: string,
    studentId: string,
    context: string
  ): Promise<AIRecommendation> {
    const prompt = `Generate an academic recommendation for a student given this context: ${context}. Output JSON with recommendationType and recommendationText.`;
    
    const aiResponse = await aiGateway.generateJSON<{ recommendationType: string; recommendationText: string }>(
      tenantId,
      prompt,
      '{"recommendationType": "string", "recommendationText": "string"}'
    );

    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(AIRecommendationRepository);
      const rec = await repo.insert({
        studentId,
        recommendationType: aiResponse.recommendationType,
        recommendationText: aiResponse.recommendationText,
        generatedBy: 'AI_GATEWAY',
        status: 'ACTIVE'
      });
      await uow.commit();
      return rec;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const personalizedLearningEngine = new PersonalizedLearningEngine();
