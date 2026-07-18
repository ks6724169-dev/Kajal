import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  DigitalResourceRepository,
  EbookRepository,
  ResearchPaperRepository,
  JournalRepository,
  PreviousYearPaperRepository,
  LibraryQuestionBankRepository,
  StudyMaterialRepository
} from '../repositories/LibraryRepository.js';

export class DigitalKnowledgeEngine {
  public async uploadDigitalResource(tenantId: string, resourceData: any, specificDetails: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      
      const resourceRepo = uow.getRepository(DigitalResourceRepository);
      const resource = await resourceRepo.insert({
        ...resourceData,
        status: 'ACTIVE'
      });

      switch (resource.resourceType) {
        case 'EBOOK':
          const ebookRepo = uow.getRepository(EbookRepository);
          await ebookRepo.insert({ resourceId: resource.id!, ...specificDetails, status: 'ACTIVE' });
          break;
        case 'RESEARCH_PAPER':
          const researchRepo = uow.getRepository(ResearchPaperRepository);
          await researchRepo.insert({ resourceId: resource.id!, ...specificDetails, status: 'ACTIVE' });
          break;
        case 'JOURNAL':
          const journalRepo = uow.getRepository(JournalRepository);
          await journalRepo.insert({ resourceId: resource.id!, ...specificDetails, status: 'ACTIVE' });
          break;
        case 'PREVIOUS_PAPER':
          const prevPaperRepo = uow.getRepository(PreviousYearPaperRepository);
          await prevPaperRepo.insert({ resourceId: resource.id!, ...specificDetails, status: 'ACTIVE' });
          break;
        case 'QUESTION_BANK':
          const qbRepo = uow.getRepository(LibraryQuestionBankRepository);
          await qbRepo.insert({ resourceId: resource.id!, ...specificDetails, status: 'ACTIVE' });
          break;
        case 'STUDY_MATERIAL':
          const smRepo = uow.getRepository(StudyMaterialRepository);
          await smRepo.insert({ resourceId: resource.id!, ...specificDetails, status: 'ACTIVE' });
          break;
      }

      await uow.commit();
      return resource;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const digitalKnowledgeEngine = new DigitalKnowledgeEngine();
