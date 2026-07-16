import { TenantEntity } from '../database/base';

export interface SubjectEntity extends TenantEntity {
  name: string;
  code: string;
  type: 'theory' | 'practical' | 'both';
  is_elective: boolean;
}

export interface ClassSubjectEntity extends TenantEntity {
  class_id: string;
  section_id?: string | null;
  subject_id: string;
  teacher_id?: string | null;
  weekly_periods?: number | null;
}
