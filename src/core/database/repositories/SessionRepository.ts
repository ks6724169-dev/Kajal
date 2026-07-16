import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from '../BaseRepository';
import { UserSession } from '../../../types/identity';

export class SessionRepository extends BaseRepository<UserSession> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'user_sessions');
  }

  async findActiveSessionsByUserId(userId: string): Promise<UserSession[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());

    if (error) return [];
    return data as UserSession[];
  }

  async invalidateSession(sessionId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ is_active: false } as any)
      .eq('id', sessionId);
      
    return !error;
  }
}
