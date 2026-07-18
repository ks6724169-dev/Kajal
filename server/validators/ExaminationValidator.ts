import { z } from 'zod';

export const CreateExaminationSchema = z.object({
  name: z.string().min(2),
  term: z.string().min(1),
  academicYear: z.string().min(4),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val))
});

export const UpdateExaminationSchema = CreateExaminationSchema.partial();

export const CreateExaminationScheduleSchema = z.object({
  examinationId: z.string().uuid(),
  subjectId: z.string().uuid(),
  examDate: z.string().transform((val) => new Date(val)),
  startTime: z.string().min(2),
  endTime: z.string().min(2),
  maxMarks: z.number().positive(),
  passingMarks: z.number().positive()
});

export const UpdateExaminationScheduleSchema = CreateExaminationScheduleSchema.partial();

export const CreateMarksEntrySchema = z.object({
  scheduleId: z.string().uuid(),
  studentId: z.string().uuid(),
  obtainedMarks: z.number().nonnegative(),
  practicalMarks: z.number().nonnegative().optional().default(0),
  vivaMarks: z.number().nonnegative().optional().default(0),
  isAbsent: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  verifiedBy: z.string().uuid().optional(),
  isApproved: z.boolean().default(false),
  approvedBy: z.string().uuid().optional(),
  remarks: z.string().optional()
});

export const UpdateMarksEntrySchema = CreateMarksEntrySchema.partial();

export const CreateGradeBookSchema = z.object({
  studentId: z.string().uuid(),
  term: z.string().min(1),
  academicYear: z.string().min(4),
  subjectId: z.string().uuid(),
  internalMarks: z.number().nonnegative(),
  externalMarks: z.number().nonnegative(),
  totalMarks: z.number().nonnegative(),
  grade: z.string().min(1),
  points: z.number().nonnegative()
});

export const UpdateGradeBookSchema = CreateGradeBookSchema.partial();

export const CreateResultSchema = z.object({
  studentId: z.string().uuid(),
  examinationId: z.string().uuid(),
  totalObtained: z.number().nonnegative(),
  totalMax: z.number().positive(),
  percentage: z.number().nonnegative().max(100),
  gpa: z.number().nonnegative().optional(),
  cgpa: z.number().nonnegative().optional(),
  overallGrade: z.string().min(1),
  resultStatus: z.enum(['PASS', 'FAIL', 'WITHHELD', 'SUPPLEMENTARY']),
  rank: z.number().int().positive().optional()
});

export const UpdateResultSchema = CreateResultSchema.partial();
