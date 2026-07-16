import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { UnitPlanEntity } from '../../../../types/academic/lesson';

export class UnitPlanRepository extends TenantRepository<UnitPlanEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'unit_plans');
  }
}
