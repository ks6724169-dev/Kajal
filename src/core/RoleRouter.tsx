import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../hooks/useNavigation';
import { useWorkspace } from '../hooks/useWorkspace';
import { Tenant } from '../types';

interface RoleRouterProps {
  route: string;
  navigate: (path: string) => void;
  language: string;
  onSelectLanguage: (lang: string) => void;
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  children: React.ReactNode;
}

export const RoleRouter: React.FC<RoleRouterProps> = ({
  route,
  navigate,
  language,
  onSelectLanguage,
  currentTenant,
  onSelectTenant,
  children
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { setActivePath } = useNavigation();
  const { setRoleWorkspaces } = useWorkspace();

  useEffect(() => {
    if (isLoading) return;

    const publicRoutes = [
      '/', 
      '/landing', 
      '/login', 
      '/register', 
      '/verify-otp', 
      '/school-lookup', 
      '/forgot-password', 
      '/reset-password',
      '/ai',
      '/ai-features',
      '/pricing',
      '/docs',
      '/contact',
      '/login-help',
      '/features',
      '/intelligence',
      '/security',
      '/demo',
      '/help',
      '/community',
      '/status',
      '/about',
      '/privacy',
      '/terms'
    ];

    const isPublic = publicRoutes.includes(route) || route.startsWith('/auth/') || route.startsWith('/school-registration/');

    if (!isAuthenticated && !isPublic) {
      // Force non-authenticated users back to login
      navigate('/login');
      
      const toastEvent = new CustomEvent('galaxy-toast', {
        detail: {
          text: '⚠️ Unauthorized Access Attempt. Please log in first.',
          type: 'warning'
        }
      });
      window.dispatchEvent(toastEvent);
    } else if (isAuthenticated && isPublic) {
      // Authenticated users trying to access landing/login are auto-sent to their workspace
      navigate('/app');
      setActivePath('dashboard');
      
      if (user?.role) {
        setRoleWorkspaces(user.role, [user.role]);
      }

      const toastEvent = new CustomEvent('galaxy-toast', {
        detail: {
          text: `🔐 Session Confirmed. Welcome back to Galaxy, ${user?.name || 'Agent'}!`,
          type: 'success'
        }
      });
      window.dispatchEvent(toastEvent);
    }
  }, [isAuthenticated, route, isLoading, user?.role]);

  // Render a clean loading indicator while state is restoring
  if (isLoading) {
    return (
      <div id="route-restoration-loading" className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 animate-spin">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-xs text-slate-400 font-extrabold tracking-widest uppercase">
          Replicating Security Handshakes...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
