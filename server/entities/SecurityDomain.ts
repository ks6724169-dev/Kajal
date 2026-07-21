import { BaseEntity } from './BaseEntity.js';

export interface UserIdentity extends BaseEntity {
  user_id: string;
  identity_type: 'USERNAME' | 'EMAIL' | 'MOBILE' | 'SCHOOL_ID' | 'EMPLOYEE_ID' | 'STUDENT_ID';
  identity_value: string;
  is_verified: boolean;
}

export interface UserCredential extends BaseEntity {
  user_id: string;
  credential_type: 'PASSWORD' | 'PIN' | 'BIOMETRIC';
  credential_hash: string;
  salt?: string;
  expires_at?: Date;
  is_compromised: boolean;
}

export interface Role extends BaseEntity {
  name: string;
  description?: string;
  is_system: boolean;
}

export interface Permission extends BaseEntity {
  name: string;
  module: string;
  action: string;
  description?: string;
}

export interface RolePermission extends BaseEntity {
  role_id: string;
  permission_id: string;
}

export interface UserRole extends BaseEntity {
  user_id: string;
  role_id: string;
  scope?: string;
}

export interface Session extends BaseEntity {
  user_id: string;
  device_id: string;
  ip_address: string;
  user_agent: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  expires_at: Date;
}

export interface TrustedDevice extends BaseEntity {
  user_id: string;
  device_identifier: string;
  device_name?: string;
  trusted_at: Date;
  last_used_at: Date;
  is_revoked: boolean;
}

export interface LoginHistory extends BaseEntity {
  user_id: string;
  login_method: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  status: 'SUCCESS' | 'FAILED' | 'CHALLENGED';
  failure_reason?: string;
  risk_score?: number;
}

export interface SecurityPolicy extends BaseEntity {
  name: string;
  policy_type: 'PASSWORD' | 'MFA' | 'SESSION' | 'ACCESS';
  configuration: any;
  is_active: boolean;
}

export interface PasswordPolicy extends BaseEntity {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special: boolean;
  expiry_days: number;
  history_count: number;
}

export interface MFAConfiguration extends BaseEntity {
  user_id: string;
  mfa_type: 'TOTP' | 'EMAIL' | 'SMS';
  secret_key?: string;
  is_enabled: boolean;
}

export interface OTPVerification extends BaseEntity {
  user_id: string;
  otp_code_hash: string;
  otp_type: 'EMAIL' | 'SMS';
  expires_at: Date;
  is_used: boolean;
}

export interface OAuthClient extends BaseEntity {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  grant_types: string[];
  is_active: boolean;
}

export interface SSOProvider extends BaseEntity {
  name: string;
  provider_type: 'GOOGLE' | 'MICROSOFT' | 'APPLE' | 'LDAP' | 'SAML' | 'OIDC';
  configuration: any;
  is_active: boolean;
}

export interface RefreshToken extends BaseEntity {
  user_id: string;
  token_hash: string;
  expires_at: Date;
  is_revoked: boolean;
  replaced_by?: string;
}

export interface BlockedIP extends BaseEntity {
  ip_address: string;
  reason: string;
  blocked_at: Date;
  expires_at?: Date;
}

export interface BlockedDevice extends BaseEntity {
  device_identifier: string;
  reason: string;
  blocked_at: Date;
}

export interface SecurityIncident extends BaseEntity {
  incident_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affected_user_id?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface AccessAudit extends BaseEntity {
  user_id: string;
  resource_type: string;
  resource_id: string;
  action: string;
  status: 'GRANTED' | 'DENIED';
  ip_address: string;
  timestamp: Date;
}
