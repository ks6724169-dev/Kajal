import { AssessmentRepository, CBTExamRepository, AssessmentQuestionPaperRepository } from '../repositories/AssessmentRepository';
import { TransactionManager } from '../database/transaction';
import { QuestionBank, QuestionPaper, CBTExam, CBTSession } from '../entities/AssessmentDomain';

export class AssessmentService {
  constructor(private tenantId: string) {}

  async createQuestion(questionData: Partial<QuestionBank>, userId: string): Promise<QuestionBank> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new AssessmentRepository(this.tenantId, tx);
      const newQuestion = await repo.insert({
        ...questionData,
        created_by: userId,
        ai_generated: questionData.ai_generated || false
      });
      await tx.commit();
      return newQuestion;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async generateQuestionPaper(paperData: Partial<QuestionPaper>, userId: string): Promise<QuestionPaper> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new AssessmentQuestionPaperRepository(this.tenantId, tx);
      const newPaper = await repo.insert({
        ...paperData,
        created_by: userId,
        is_published: false
      });
      await tx.commit();
      return newPaper;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async publishQuestionPaper(paperId: string, currentVersion: number, userId: string): Promise<QuestionPaper> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new AssessmentQuestionPaperRepository(this.tenantId, tx);
      const updated = await repo.update(paperId, { is_published: true, updated_by: userId }, currentVersion);
      if (!updated) throw new Error('Failed to publish paper');
      await tx.commit();
      return updated;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async scheduleCBT(examData: Partial<CBTExam>, userId: string): Promise<CBTExam> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new CBTExamRepository(this.tenantId, tx);
      const newExam = await repo.insert({
        ...examData,
        start_time: new Date(examData.start_time as unknown as string),
        end_time: new Date(examData.end_time as unknown as string),
        created_by: userId
      });
      await tx.commit();
      return newExam;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async startCBTSession(examId: string, studentId: string): Promise<CBTSession> {
    const tx = new TransactionManager();
    await tx.begin();
    try {
      const repo = new AssessmentRepository(this.tenantId, tx);
      
      const exam = await repo.findCBTExam(examId);
      if (!exam) throw new Error('Exam not found');

      const session = await repo.createCBTSession({
        cbt_exam_id: examId,
        student_id: studentId,
        tenant_id: this.tenantId
      });

      await tx.commit();
      return session;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  // Stubs for other operations to be extended
  async submitCBT(sessionId: string): Promise<void> { /* ... */ }
  async processOMR(omrId: string): Promise<void> { /* ... */ }
  async processResults(examId: string): Promise<void> { /* ... */ }
  async applyModeration(rule: any): Promise<void> { /* ... */ }
  async addGraceMarks(marks: any): Promise<void> { /* ... */ }
  async publishResults(examId: string): Promise<void> { /* ... */ }
}
