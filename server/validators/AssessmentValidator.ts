import { z } from 'zod';

export const QuestionSchema = z.object({
  subject_id: z.string().uuid(),
  topic_id: z.string().uuid().optional(),
  question_type: z.enum(['MCQ', 'SUBJECTIVE', 'TRUE_FALSE', 'FILL_BLANKS', 'MATCHING']),
  content: z.string().min(5),
  options: z.any().optional(),
  correct_answer: z.any().optional(),
  explanation: z.string().optional(),
  difficulty_level: z.enum(['EASY', 'MEDIUM', 'HARD', 'VERY_HARD']),
  bloom_taxonomy: z.enum(['REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE']).optional(),
  marks: z.number().positive(),
  negative_marks: z.number().min(0).optional(),
  tags: z.array(z.string()).optional()
});

export const QuestionPaperSchema = z.object({
  title: z.string().min(3),
  subject_id: z.string().uuid(),
  total_marks: z.number().positive(),
  duration_minutes: z.number().positive(),
  instructions: z.string().optional(),
  is_published: z.boolean().default(false)
});

export const CBTExamSchema = z.object({
  question_paper_id: z.string().uuid(),
  name: z.string().min(3),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  passing_marks: z.number().positive(),
  strict_browser: z.boolean().default(false),
  allow_resume: z.boolean().default(true),
  shuffle_questions: z.boolean().default(false),
  shuffle_options: z.boolean().default(false),
  show_results_immediately: z.boolean().default(false)
});

export const OMRUploadSchema = z.object({
  exam_id: z.string().uuid(),
  student_id: z.string().uuid(),
  scanned_image_url: z.string().url()
});

export const ResultApprovalSchema = z.object({
  exam_id: z.string().uuid(),
  comments: z.string().optional()
});
