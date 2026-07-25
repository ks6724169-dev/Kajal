import React, { useEffect } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { useNavigation } from '../hooks/useNavigation';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';
import { SidebarNavigation } from '../components/navigation/SidebarNavigation';
import { TopNavigation } from '../components/navigation/TopNavigation';
import { WorkspaceHeader } from '../components/navigation/WorkspaceHeader';
import { WorkspaceFooter } from '../components/navigation/WorkspaceFooter';
import { QuickLauncher } from '../components/navigation/QuickLauncher';
import { RouteResolver } from './RouteResolver';
import { BreadcrumbResolver } from './BreadcrumbResolver';
import { Tenant } from '../types';
import { OwnerDashboardPage } from '../pages/owner/OwnerDashboardPage';

interface RoleWorkspaceProps {
  language: string;
  onSelectLanguage: (lang: string) => void;
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
}

export const RoleWorkspace: React.FC<RoleWorkspaceProps> = ({
  language,
  onSelectLanguage,
  currentTenant,
  onSelectTenant
}) => {
  const { currentWorkspace, setRoleWorkspaces } = useWorkspace();
  const { activePath, setActivePath, setBreadcrumbs } = useNavigation();
  const { currentRole } = useRole();
  const { user } = useAuth();

  // Initialize or synchronize workspaces list on load or role change
  useEffect(() => {
    if (user?.role) {
      setRoleWorkspaces(user.role, [user.role]);
    }
  }, [user?.role]);

  // Synchronize active path and breadcrumbs dynamically on path change
  useEffect(() => {
    setBreadcrumbs(BreadcrumbResolver.resolveBreadcrumbs(activePath));
  }, [activePath]);

  const handleNavigationChange = (path: string) => {
    setActivePath(path);
  };

  // Render dedicated Owner Panel without sidebar
  if (user?.role === 'organization_owner' || currentRole === 'organization_owner') {
    return <OwnerDashboardPage tenant={currentTenant} activePath={activePath} onNavigate={handleNavigationChange} />;
  }

  return (
    <div id="enterprise-role-workspace-root" className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      {/* Dynamic Collapsible Sidebar */}
      <SidebarNavigation 
        language={language} 
        onNavigate={handleNavigationChange} 
      />

      {/* Main Structural Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Dynamic Top Navigation Header */}
        <TopNavigation
          language={language}
          onSelectLanguage={onSelectLanguage}
          onNavigate={handleNavigationChange}
        />

        {/* Scrollable Worksite Canvas Area */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between custom-scrollbar">
          <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
            {activePath === 'dashboard' ? (
              <div className="space-y-6 animate-fade-in">
                {/* Visual Greetings Banner */}
                <WorkspaceHeader 
                  workspace={currentWorkspace} 
                  language={language} 
                />

                {/* Direct Action Portal Trigger Keys */}
                <QuickLauncher 
                  language={language} 
                  onNavigate={handleNavigationChange} 
                />
              </div>
            ) : (
              <div className="animate-fade-in">
                {/* Dynamically Resolved Target Portal View */}
                {RouteResolver.renderRoute(activePath, currentTenant, handleNavigationChange)}
              </div>
            )}
          </main>

          {/* Secure Institutional Compliance Footer */}
          <WorkspaceFooter language={language} />
        </div>
      </div>
    </div>
  );
};
export default RoleWorkspace;
