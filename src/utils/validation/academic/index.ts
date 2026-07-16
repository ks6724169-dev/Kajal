import { z } from 'zod';

export const ClassSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  order_sequence: z.number().int().nonnegative('Order sequence must be positive'),
});

export const SectionSchema = z.object({
  class_id: z.string().uuid('Invalid class ID'),
  name: z.string().min(1, 'Name is required'),
  room_number: z.string().optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
});

export const SubjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  type: z.enum(['theory', 'practical', 'both']),
  is_elective: z.boolean().default(false),
});

export const LessonPlanSchema = z.object({
  class_id: z.string().uuid('Invalid class ID'),
  section_id: z.string().uuid('Invalid section ID'),
  subject_id: z.string().uuid('Invalid subject ID'),
  topic: z.string().min(1, 'Topic is required'),
  learning_outcomes: z.string().optional().nullable(),
  methodology: z.string().optional().nullable(),
  resources_needed: z.string().optional().nullable(),
  date_planned: z.string().datetime({ message: 'Invalid date format' }),
  status: z.enum(['draft', 'submitted', 'approved', 'rejected', 'completed']).default('draft'),
  ai_generated: z.boolean().default(false),
});

export const HomeworkSchema = z.object({
  class_id: z.string().uuid('Invalid class ID'),
  section_id: z.string().uuid('Invalid section ID'),
  subject_id: z.string().uuid('Invalid subject ID'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['homework', 'assignment', 'project', 'practical']),
  issue_date: z.string().datetime(),
  due_date: z.string().datetime(),
  total_marks: z.number().nonnegative().optional().nullable(),
  ai_generated: z.boolean().default(false),
});
