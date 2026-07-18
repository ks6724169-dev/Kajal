import { UnitOfWork } from '../database/unitOfWork.js';
import { InternalMessageRepository, ConversationRepository } from '../repositories/CommunicationRepository.js';
import { InternalMessage } from '../entities/CommunicationDomain.js';
import { aiGateway } from '../ai/AIGateway.js';

export class MessagingEngine {
  public async sendMessage(tenantId: string, conversationId: string, senderId: string, content: string): Promise<InternalMessage> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      
      const convRepo = uow.getRepository(ConversationRepository);
      const conv = await convRepo.findOne(conversationId);
      if (conv) {
        await convRepo.update(conversationId, { lastMessageAt: new Date() }, conv.version);
      }

      const msgRepo = uow.getRepository(InternalMessageRepository);
      const msg = await msgRepo.insert({
        conversationId,
        senderId,
        content,
        isEdited: false,
        status: 'ACTIVE'
      });
      
      await uow.commit();
      return msg;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
  
  public async improveMessageTone(tenantId: string, content: string): Promise<string> {
    const prompt = `Rewrite the following message to sound more professional and polite: ${content}`;
    const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);
    return aiResponse.text;
  }
}

export const messagingEngine = new MessagingEngine();
