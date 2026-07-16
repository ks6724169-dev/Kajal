import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { ClassTimetableEntity } from '../../../../types/academic/timetable';

export class TimetableRepository extends TenantRepository<ClassTimetableEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'class_timetables');
  }
}
