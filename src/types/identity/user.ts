import { TenantEntity } from '../database/base';

export type UserStatus = 'pending' | 'active' | 'inactive' | 'locked' | 'suspended';

export interface UserIdentity extends TenantEntity {
  email: string;
  phone?: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  status: UserStatus;
  last_login_at?: string | null;
  failed_login_attempts: number;
  locked_until?: string | null;
  force_password_change: boolean;
  password_changed_at?: string | null;
}
