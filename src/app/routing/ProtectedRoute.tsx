import React from 'react';
import { AppModuleId } from '../navigation/modules';
import { useAuth } from '../../core/auth';
import { LoadingScreen } from '../../components/auth/LoadingScreen';
import { UnauthorizedPage } from '../../components/auth/UnauthorizedPage';

export const ProtectedRoute: React.FC<{ moduleId?: AppModuleId; children: React.ReactNode }> = ({ moduleId, children }) => {
  const auth = useAuth();

  if (auth.status === 'loading') return <LoadingScreen message="Restoring your secure session..." />;
  if (!auth.isAuthenticated) return <UnauthorizedPage reason="Please sign in to access the Enterprise ERP workspace." />;
  if (moduleId && !auth.canAccess(moduleId)) return <UnauthorizedPage reason="Your current role does not have access to this module." />;

  return <>{children}</>;
};
