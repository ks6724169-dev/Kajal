import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../../TenantRepository';
import { ResourceEntity } from '../../../../types/academic/resources';

export class ResourceRepository extends TenantRepository<ResourceEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'resources');
  }
}
