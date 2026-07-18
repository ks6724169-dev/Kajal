import { UnitOfWork } from '../database/unitOfWork.js';
import { aiGateway } from '../ai/AIGateway.js';
import { AIBookRecommendationRepository, ReadingHistoryRepository, LibraryBookRepository, DigitalResourceRepository } from '../repositories/LibraryRepository.js';

export class AIKnowledgeEngine {
  public async getBookRecommendation(tenantId: string, memberId: string): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      
      const historyRepo = uow.getRepository(ReadingHistoryRepository);
      const history = await historyRepo.findMany({ memberId, status: 'ACTIVE' } as any); // Type cast for simplicity
      
      const prompt = `Based on the following reading history, recommend 3 new book titles or subjects:\n${JSON.stringify(history)}`;
      const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);
      
      const recRepo = uow.getRepository(AIBookRecommendationRepository);
      const recommendation = await recRepo.insert({
        memberId,
        recommendedBooks: { summary: aiResponse.text },
        reasoning: 'AI generated based on reading history',
        status: 'ACTIVE'
      });
      
      await uow.commit();
      return recommendation;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async generateResourceSummary(tenantId: string, content: string): Promise<string> {
    return await aiGateway.summarize(tenantId, content);
  }
}

export const aiKnowledgeEngine = new AIKnowledgeEngine();
