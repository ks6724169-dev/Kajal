import { SupabaseClient } from '@supabase/supabase-js';
import { TenantRepository } from '../TenantRepository';
import { UserIdentity } from '../../../types/identity';

export class UserRepository extends TenantRepository<UserIdentity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'identities');
  }

  async findByEmail(email: string): Promise<UserIdentity | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .eq('is_deleted', false)
      .single();

    if (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
    return data as UserIdentity;
  }
}
