import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../TenantRepository';
import { RoleEntity } from '../../../types/identity';

export class RoleRepository extends TenantRepository<RoleEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'roles');
  }

  async findByCode(code: string, organizationId: string): Promise<RoleEntity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('code', code)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .single();

    if (error) return null;
    return data as RoleEntity;
  }
}
