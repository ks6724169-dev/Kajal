import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { SyllabusTrackerEntity } from '../../../../types/academic/lesson';

export class SyllabusTrackerRepository extends TenantRepository<SyllabusTrackerEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'syllabus_trackers');
  }
}
