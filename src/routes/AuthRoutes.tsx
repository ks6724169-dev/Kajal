import React from 'react';
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { MFAChallengePage } from '../pages/auth/MFAChallengePage';
import { TenantSelectorPage } from '../pages/auth/TenantSelectorPage';
import { SessionManagementPage } from '../pages/auth/SessionManagementPage';
import { ProfileCompletionPage } from '../pages/auth/ProfileCompletionPage';

interface AuthRoutesProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const AuthRoutes: React.FC<AuthRoutesProps> = ({ currentPath, navigate }) => {
  // Simple layout switch corresponding to auth routes paths
  const renderRoute = () => {
    switch (currentPath) {
      case '/auth/login':
        return <LoginPage navigate={navigate} />;
      case '/auth/forgot-password':
        return <ForgotPasswordPage navigate={navigate} />;
      case '/auth/reset-password':
        return <ResetPasswordPage navigate={navigate} />;
      case '/auth/mfa':
        return <MFAChallengePage navigate={navigate} />;
      case '/auth/tenant-selector':
        return <TenantSelectorPage navigate={navigate} />;
      case '/auth/sessions':
        return <SessionManagementPage navigate={navigate} />;
      case '/auth/profile-completion':
        return <ProfileCompletionPage navigate={navigate} />;
      default:
        return <LoginPage navigate={navigate} />;
    }
  };

  return (
    <div id="auth-routes-viewport" className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      {renderRoute()}
    </div>
  );
};
