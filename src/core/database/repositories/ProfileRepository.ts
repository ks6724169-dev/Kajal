import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../TenantRepository';
import { BaseProfile } from '../../../types/identity';

export class ProfileRepository<T extends BaseProfile> extends TenantRepository<T> {
  constructor(supabase: SupabaseClient, tableName: string) {
    super(supabase, tableName);
  }

  async findByUserId(userId: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .single();

    if (error) return null;
    return data as T;
  }
}
