import { Request, Response } from 'express';
import { AssessmentService } from '../services/AssessmentService';
import { AIQuestionGenerator } from '../services/AIQuestionGenerator';
import { z } from 'zod';
import { 
  QuestionSchema, 
  QuestionPaperSchema, 
  CBTExamSchema, 
  OMRUploadSchema 
} from '../validators/AssessmentValidator';

export class AssessmentController {
  
  static async createQuestion(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const userId = (req as any).user.id;
      
      const validatedData = QuestionSchema.parse(req.body);
      
      const service = new AssessmentService(tenantId);
      const question = await service.createQuestion(validatedData, userId);
      
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async generateAIQuestions(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const { subject, topic, count, difficulty } = req.body;
      
      const generator = new AIQuestionGenerator(tenantId);
      const questions = await generator.generateQuestions(subject, topic, count, difficulty);
      
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async createQuestionPaper(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const userId = (req as any).user.id;
      
      const validatedData = QuestionPaperSchema.parse(req.body);
      
      const service = new AssessmentService(tenantId);
      const paper = await service.generateQuestionPaper(validatedData, userId);
      
      res.status(201).json(paper);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async scheduleCBT(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const userId = (req as any).user.id;
      
      const validatedData = CBTExamSchema.parse(req.body);
      
      const service = new AssessmentService(tenantId);
      const exam = await service.scheduleCBT({
        ...validatedData,
        start_time: new Date(validatedData.start_time),
        end_time: new Date(validatedData.end_time)
      }, userId);
      
      res.status(201).json(exam);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async startCBTSession(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const studentId = (req as any).user.id;
      const examId = req.params.examId;
      
      const service = new AssessmentService(tenantId);
      const session = await service.startCBTSession(examId, studentId);
      
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Analytics endpoint
  static async getExamAnalytics(req: Request, res: Response) {
    res.status(200).json({ status: 'Analytics Data Pending' });
  }
}
