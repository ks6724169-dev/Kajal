import { BaseRepository } from './BaseRepository.js';
import { 
  UserIdentity,
  UserCredential,
  Session,
  TrustedDevice,
  LoginHistory,
  SecurityPolicy,
  MFAConfiguration,
  SSOProvider,
  RefreshToken,
  SecurityIncident
} from '../entities/SecurityDomain.js';

export class UserIdentityRepository extends BaseRepository<UserIdentity> {
  protected tableName = 'user_identity';
}

export class UserCredentialRepository extends BaseRepository<UserCredential> {
  protected tableName = 'user_credential';
}

export class SessionRepository extends BaseRepository<Session> {
  protected tableName = 'session';
}

export class TrustedDeviceRepository extends BaseRepository<TrustedDevice> {
  protected tableName = 'trusted_device';
}

export class LoginHistoryRepository extends BaseRepository<LoginHistory> {
  protected tableName = 'login_history';
}

export class SecurityPolicyRepository extends BaseRepository<SecurityPolicy> {
  protected tableName = 'security_policy';
}

export class MFAConfigurationRepository extends BaseRepository<MFAConfiguration> {
  protected tableName = 'mfa_configuration';
}

export class SSOProviderRepository extends BaseRepository<SSOProvider> {
  protected tableName = 'sso_provider';
}

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  protected tableName = 'refresh_token';
}

export class SecurityIncidentRepository extends BaseRepository<SecurityIncident> {
  protected tableName = 'security_incident';
}
