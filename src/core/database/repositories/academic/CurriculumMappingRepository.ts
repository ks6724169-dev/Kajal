import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { CurriculumMappingEntity } from '../../../../types/academic/lesson';

export class CurriculumMappingRepository extends TenantRepository<CurriculumMappingEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'curriculum_mappings');
  }
}
