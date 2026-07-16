import { UserRepository } from '../../core/database/repositories/UserRepository';
import { UserIdentity } from '../../types/identity';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async inviteUser(email: string, organizationId: string): Promise<UserIdentity | null> {
    return this.userRepository.create({
      email,
      organization_id: organizationId,
      status: 'pending',
      email_verified: false,
      phone_verified: false,
      failed_login_attempts: 0,
      force_password_change: true
    } as Partial<UserIdentity>);
  }

  async activateUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.update(userId, { status: 'active' } as Partial<UserIdentity>);
    return !!user;
  }

  async deactivateUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.update(userId, { status: 'inactive' } as Partial<UserIdentity>);
    return !!user;
  }

  async lockAccount(userId: string, lockedUntil?: Date): Promise<boolean> {
    const user = await this.userRepository.update(userId, { 
      status: 'locked',
      locked_until: lockedUntil?.toISOString() || null
    } as Partial<UserIdentity>);
    return !!user;
  }

  async unlockAccount(userId: string): Promise<boolean> {
    const user = await this.userRepository.update(userId, {
      status: 'active',
      locked_until: null,
      failed_login_attempts: 0
    } as Partial<UserIdentity>);
    return !!user;
  }

  async markEmailVerified(userId: string): Promise<boolean> {
    const user = await this.userRepository.update(userId, { email_verified: true } as Partial<UserIdentity>);
    return !!user;
  }

  async markPhoneVerified(userId: string): Promise<boolean> {
    const user = await this.userRepository.update(userId, { phone_verified: true } as Partial<UserIdentity>);
    return !!user;
  }

  async requirePasswordChange(userId: string): Promise<boolean> {
    const user = await this.userRepository.update(userId, { force_password_change: true } as Partial<UserIdentity>);
    return !!user;
  }
}
