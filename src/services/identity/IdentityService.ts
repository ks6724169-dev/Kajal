import { SupabaseClient } from '@supabase/supabase-js';
import { UserService } from './UserService';
import { UserSession } from '../../types/identity';
import { SessionService } from './SessionService';

export class IdentityService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  async resetPassword(email: string): Promise<boolean> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    return !error;
  }

  async recordLoginAttempt(userId: string, success: boolean): Promise<void> {
    // Audit implementation
    console.log(`Login attempt for ${userId}. Success: ${success}`);
  }
  
  async getMySessions(userId: string): Promise<UserSession[]> {
    return this.sessionService.getActiveSessions(userId);
  }
}
