import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { OnlineClassEntity } from '../../../../types/academic/resources';

export class OnlineClassRepository extends TenantRepository<OnlineClassEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'online_classes');
  }
}
