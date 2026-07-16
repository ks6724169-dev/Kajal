import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { AnnualPlannerEntity } from '../../../../types/academic/lesson';

export class AnnualPlannerRepository extends TenantRepository<AnnualPlannerEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'annual_planners');
  }
}
