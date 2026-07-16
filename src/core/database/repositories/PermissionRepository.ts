import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from '../BaseRepository';
import { PermissionEntity } from '../../../types/identity';

export class PermissionRepository extends BaseRepository<PermissionEntity> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'permissions');
  }

  async findPermissionsByRole(roleId: string): Promise<PermissionEntity[]> {
    const { data, error } = await this.supabase
      .from('role_permissions')
      .select('permissions(*)')
      .eq('role_id', roleId);

    if (error) return [];
    
    // Type assertion based on expected Supabase join result
    const items = data as unknown as Array<{ permissions: PermissionEntity | PermissionEntity[] }>;
    
    return items.flatMap(item => 
      Array.isArray(item.permissions) ? item.permissions : [item.permissions]
    ).filter(Boolean);
  }
}
