import { BaseRepository } from './BaseRepository';
import { 
  QuestionBank, 
  QuestionPaper, 
  CBTExam, 
  OMRSheet, 
  CBTSession, 
  CandidateAttendance 
} from '../entities/AssessmentDomain';
import { TransactionManager } from '../database/transaction';
import { QuerySpecification } from './QuerySpecification';

export class AssessmentRepository extends BaseRepository<QuestionBank> {
  protected tableName = 'question_bank';
  
  constructor(tenantId: string, txManager?: TransactionManager) {
    super(tenantId, txManager);
  }

  // Question Filters & Specification Pattern
  async findQuestions(filters: Record<string, any>): Promise<QuestionBank[]> {
    const spec = new QuerySpecification();
    
    if (filters.subject_id) {
      spec.and('subject_id', filters.subject_id);
    }
    if (filters.difficulty_level) {
      spec.and('difficulty_level', filters.difficulty_level);
    }
    if (filters.bloom_taxonomy) {
      spec.and('bloom_taxonomy', filters.bloom_taxonomy);
    }
    if (filters.tags && filters.tags.length > 0) {
      spec.and('tags', filters.tags); 
    }

    return this.findMany(spec);
  }

  async saveQuestionPaper(paper: Partial<QuestionPaper>): Promise<QuestionPaper> {
    const paperRepo = new AssessmentQuestionPaperRepository(this.tenantId, this.txManager);
    if (paper.id) {
      return paperRepo.update(paper.id, paper, paper.version || 1) as Promise<QuestionPaper>;
    } else {
      return paperRepo.insert(paper);
    }
  }

  async findCBTExam(examId: string): Promise<CBTExam | null> {
    const examRepo = new CBTExamRepository(this.tenantId, this.txManager);
    return examRepo.findOne(examId);
  }

  async createCBTSession(session: Partial<CBTSession>): Promise<CBTSession> {
    const sessionRepo = new CBTSessionRepository(this.tenantId, this.txManager);
    return sessionRepo.insert({
      ...session,
      session_status: 'STARTED',
      start_time: new Date()
    });
  }
}

export class CBTExamRepository extends BaseRepository<CBTExam> {
  protected tableName = 'cbt_exam';
}

export class AssessmentQuestionPaperRepository extends BaseRepository<QuestionPaper> {
  protected tableName = 'question_paper';
}

export class CBTSessionRepository extends BaseRepository<CBTSession> {
  protected tableName = 'cbt_session';
}

export class OMRSheetRepository extends BaseRepository<OMRSheet> {
  protected tableName = 'omr_sheet';
}

export class CandidateAttendanceRepository extends BaseRepository<CandidateAttendance> {
  protected tableName = 'candidate_attendance';
}

