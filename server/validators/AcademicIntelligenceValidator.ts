import { z } from 'zod';

export const AnalyzeStudentSchema = z.object({
  studentId: z.string().uuid(),
  academicYear: z.string().min(1),
  term: z.string().optional()
});

export const AnalyzeClassSchema = z.object({
  classId: z.string().uuid(),
  academicYear: z.string().min(1),
  term: z.string().optional()
});

export const AnalyzeSubjectSchema = z.object({
  subjectId: z.string().uuid(),
  academicYear: z.string().min(1),
  term: z.string().optional()
});

export const GenerateStudyPlanSchema = z.object({
  studentId: z.string().uuid(),
  planType: z.enum(['WEEKLY', 'DAILY', 'REVISION'])
});

export const PredictPromotionSchema = z.object({
  studentId: z.string().uuid(),
  academicYear: z.string().min(1)
});

export const PredictDropoutSchema = z.object({
  studentId: z.string().uuid()
});

export const PredictAttendanceSchema = z.object({
  studentId: z.string().uuid()
});

export const GenerateAIRecommendationSchema = z.object({
  studentId: z.string().uuid(),
  context: z.string().min(1)
});

export const BenchmarkAnalysisSchema = z.object({
  entityId: z.string().uuid(),
  entityType: z.enum(['STUDENT', 'CLASS', 'SUBJECT']),
  benchmarkName: z.string().min(1)
});

export const LearningStyleAnalysisSchema = z.object({
  studentId: z.string().uuid(),
  responses: z.record(z.string(), z.string())
});
