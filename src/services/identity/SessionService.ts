import { SessionRepository } from '../../core/database/repositories/SessionRepository';
import { UserSession } from '../../types/identity';

export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async getActiveSessions(userId: string): Promise<UserSession[]> {
    return this.sessionRepository.findActiveSessionsByUserId(userId);
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    return this.sessionRepository.invalidateSession(sessionId);
  }

  async revokeAllUserSessions(userId: string): Promise<boolean> {
    const sessions = await this.getActiveSessions(userId);
    let success = true;
    for (const session of sessions) {
      const revoked = await this.revokeSession(session.id);
      if (!revoked) success = false;
    }
    return success;
  }

  async recordActivity(sessionId: string): Promise<boolean> {
    const updated = await this.sessionRepository.update(sessionId, {
      last_activity_at: new Date().toISOString()
    } as Partial<UserSession>);
    return !!updated;
  }
}
