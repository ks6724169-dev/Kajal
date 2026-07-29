import React, { useState } from 'react';
import { Tenant } from '../../../types';
import { OwnerHeader } from '../OwnerHeader';
import { WorkspaceNavStrip, CORE_WORKSPACES } from './WorkspaceNavStrip';
import { WorkspaceViewResolver } from './WorkspaceViewResolver';
import { useAuth } from '../../../hooks/useAuth';
import { ShieldCheck, ChevronRight, LayoutGrid, Building2, ArrowLeft, UserCheck } from 'lucide-react';
import { useOwnerDashboard } from '../../../hooks/useOwnerDashboard';

interface InstitutionWorkspaceLayoutProps {
  tenant: Tenant;
  activePath: string;
  onNavigate: (path: string) => void;
  initialWorkspaceId?: string;
}

export const InstitutionWorkspaceLayout: React.FC<InstitutionWorkspaceLayoutProps> = ({
  tenant,
  activePath,
  onNavigate,
  initialWorkspaceId = 'admin-governance'
}) => {
  const { user } = useAuth();
  const [currentCampus, setCurrentCampus] = useState('All Campuses');
  const { campuses } = useOwnerDashboard(currentCampus, tenant?.id);

  // Extract active workspace ID from path if present e.g. /owner/workspaces/academic-curriculum or workspace_academic-curriculum
  const extractWorkspaceId = (): string => {
    const safePath = activePath || '';
    if (safePath.startsWith('/owner/workspaces/')) {
      return safePath.replace('/owner/workspaces/', '');
    }
    if (safePath.startsWith('workspace_')) {
      return safePath.replace('workspace_', '');
    }
    if (initialWorkspaceId) {
      return initialWorkspaceId;
    }
    return 'admin-governance';
  };

  const activeWorkspaceId = extractWorkspaceId();
  const currentWorkspace = CORE_WORKSPACES.find(w => w.id === activeWorkspaceId) || CORE_WORKSPACES[0];

  const handleSelectWorkspace = (workspaceId: string) => {
    onNavigate(`/owner/workspaces/${workspaceId}`);
  };

  // Determine user role badge label
  const getRoleBadgeLabel = () => {
    switch (user?.role) {
      case 'principal':
        return 'Principal Workspace Context';
      case 'vice_principal':
        return 'Vice Principal Workspace Context';
      default:
        return 'Institution Owner Control';
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] font-sans text-slate-900 flex flex-col">
      {/* Primary Galaxy ERP Top Header */}
      <OwnerHeader
        tenantName={tenant?.name || 'Galaxy International School'}
        tenantType={tenant?.type || 'K-12 School'}
        currentCampus={currentCampus}
        onCampusChange={setCurrentCampus}
        onNavigate={onNavigate}
        campuses={campuses}
      />

      {/* Sub-Header: Contextual Breadcrumb & Role Badge */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 overflow-x-auto text-slate-300">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Executive Dashboard</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="text-white font-semibold flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentWorkspace.title}</span>
            </span>
          </div>

          {/* Contextual Role Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[11px] font-medium text-indigo-300">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{getRoleBadgeLabel()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Core Workspaces Navigation Strip */}
      <WorkspaceNavStrip
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={handleSelectWorkspace}
        activeRole={user?.role}
      />

      {/* Main Active Workspace Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-y-auto">
        <WorkspaceViewResolver
          workspaceId={activeWorkspaceId}
          tenant={tenant}
          activePath={activePath}
          onNavigate={onNavigate}
          userRole={user?.role}
        />
      </main>
    </div>
  );
};
