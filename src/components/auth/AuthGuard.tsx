import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthSkeleton } from './AuthSkeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If not loaded yet, or check finished
    if (!isLoading && !isAuthenticated) {
      console.log('User is not authenticated. Redirecting or showing login prompt.');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div id="auth-guard-loading" className="min-h-[60vh] flex items-center justify-center p-6">
        <AuthSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div id="auth-guard-unauthorized" className="w-full">
        {fallback || (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Access Restricted
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              Please sign in to your enterprise tenant to view this workspace.
            </p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
