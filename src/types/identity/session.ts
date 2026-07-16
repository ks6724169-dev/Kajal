import { BaseEntity } from '../database/base';

export interface UserSession extends BaseEntity {
  user_id: string;
  device_id: string;
  device_name?: string | null;
  browser?: string | null;
  os?: string | null;
  ip_address?: string | null;
  is_active: boolean;
  expires_at: string;
  last_activity_at: string;
  created_at: string;
}

export interface LoginHistory extends BaseEntity {
  user_id: string;
  session_id?: string | null;
  login_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
  status: 'success' | 'failed';
  failure_reason?: string | null;
}
