import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from '../BaseRepository';
import { Organization } from '../../../types/database/entities';

export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'organizations');
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('slug', slug)
      .eq('is_deleted', false)
      .single();

    if (error) {
      console.error('Error finding organization by slug:', error);
      return null;
    }

    return data as Organization;
  }
}
