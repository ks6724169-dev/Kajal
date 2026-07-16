import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { SubjectEntity } from '../../../../types/academic/subject';

export class SubjectRepository extends TenantRepository<SubjectEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'subjects');
  }
}
