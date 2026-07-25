import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

export class UserService {
  static async searchUsers(query: string, tenantId: string): Promise<UserProfile[]> {
    if (query.length < 2) return [];

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('tenant_id', tenantId)
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(5);

    if (error) {
      const isPlaceholder = (supabase as any).supabaseUrl?.includes('placeholder.supabase.co');
      if (error.code !== '42P01' && !isPlaceholder) console.error('Error searching users:', error);
      return [];
    }

    return data || [];
  }

  static async getUserById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  }
}
