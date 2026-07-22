import { Role } from '../../types';

export interface LoginCredentials {
  schoolId: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
  tenantId?: string;
  campus?: string;
  avatar?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  session?: AuthSession;
  error?: string;
  mfaRequired?: boolean;
}

export interface AuthErrorResponse {
  code: string;
  message: string;
  field?: 'schoolId' | 'email' | 'password';
}
