import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';

export abstract class TenantRepository<T extends { id: string, organization_id: string }> extends BaseRepository<T> {
  protected constructor(
    supabase: SupabaseClient,
    tableName: string
  ) {
    super(supabase, tableName);
  }

  async findAllByTenant(organizationId: string): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_deleted', false);

    if (error) {
      console.error(`Error finding all by tenant from ${this.tableName}:`, error);
      return [];
    }

    return data as T[];
  }

  async findByIdAndTenant(id: string, organizationId: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .eq('is_deleted', false)
      .single();

    if (error) {
      console.error(`Error finding ${this.tableName} by id and tenant:`, error);
      return null;
    }

    return data as T;
  }
}
