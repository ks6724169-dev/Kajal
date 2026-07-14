import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Role, Tenant } from '../../types';
import { AuthSession, LoginCredentials, authService } from './supabaseAuth';
import { canAccessModule } from './rbac';
import { AppModuleId } from '../../app/navigation/modules';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'unauthorized';

type AuthContextValue = {
  status: AuthStatus;
  session: AuthSession | null;
  role: Role | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (accessToken: string, password: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  canAccess: (moduleId: AppModuleId) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);

  const hydrateSession = useCallback(async () => {
    const persistedSession = authService.loadSession();
    if (!persistedSession) {
      setStatus('anonymous');
      return;
    }

    const refreshedSession = await authService.refreshSession(persistedSession);
    setSession(refreshedSession);
    setStatus(refreshedSession ? 'authenticated' : 'anonymous');
  }, []);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (!session) return;
    const refreshTimer = window.setInterval(() => {
      authService.refreshSession(session).then((nextSession) => {
        setSession(nextSession);
        setStatus(nextSession ? 'authenticated' : 'anonymous');
      });
    }, 10 * 60 * 1000);

    return () => window.clearInterval(refreshTimer);
  }, [session]);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    session,
    role: session?.user.role ?? null,
    tenant: session?.user.tenant ?? null,
    isAuthenticated: status === 'authenticated' && Boolean(session),
    login: async (credentials) => {
      setStatus('loading');
      const result = await authService.login(credentials);
      setSession(result.session);
      setStatus('authenticated');
    },
    logout: async () => {
      setStatus('loading');
      await authService.logout(session);
      setSession(null);
      setStatus('anonymous');
    },
    forgotPassword: authService.forgotPassword,
    resetPassword: authService.resetPassword,
    resendVerification: authService.resendVerification,
    refreshSession: async () => {
      const refreshedSession = await authService.refreshSession(session);
      setSession(refreshedSession);
      setStatus(refreshedSession ? 'authenticated' : 'anonymous');
    },
    canAccess: (moduleId) => Boolean(session?.user.role && canAccessModule(session.user.role, moduleId))
  }), [session, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
};
