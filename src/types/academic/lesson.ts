import { TenantEntity } from '../database/base';

export interface AnnualPlannerEntity extends TenantEntity {
  academic_session_id: string;
  class_id: string;
  subject_id: string;
  title: string;
  description?: string | null;
}

export interface UnitPlanEntity extends TenantEntity {
  annual_planner_id: string;
  title: string;
  duration_weeks: number;
  start_date?: string | null;
  end_date?: string | null;
}

export interface SyllabusTrackerEntity extends TenantEntity {
  unit_plan_id: string;
  topic: string;
  sub_topics?: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_date?: string | null;
}

export interface LessonPlanEntity extends TenantEntity {
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  topic: string;
  learning_outcomes?: string | null;
  methodology?: string | null;
  resources_needed?: string | null;
  date_planned: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed';
  ai_generated: boolean;
}

export interface CurriculumMappingEntity extends TenantEntity {
  class_id: string;
  subject_id: string;
  standard_id?: string | null;
  learning_objective: string;
  mapped_topics: string[];
}
