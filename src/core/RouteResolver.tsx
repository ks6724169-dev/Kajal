import React from 'react';
import { Tenant } from '../types';
import { DashboardHome } from '../pages/dashboard/DashboardHome';
import { AiHub } from '../modules/super-admin/AiHub';
import { StudentsPortal } from '../modules/super-admin/StudentsPortal';
import { FeeManagement } from '../modules/super-admin/FeeManagement';
import { AttendancePortal } from '../modules/super-admin/AttendancePortal';
import { TransportPortal } from '../modules/super-admin/TransportPortal';
import { ExaminationPortal } from '../modules/super-admin/ExaminationPortal';
import { HrmsPayroll } from '../modules/super-admin/HrmsPayroll';
import { InventoryLibraryHostel } from '../modules/super-admin/InventoryLibraryHostel';
import { CctvSecurity } from '../modules/super-admin/CctvSecurity';
import { MobileAppSimulator } from '../modules/super-admin/MobileAppSimulator';
import { FrontendExperiencePlatform } from '../pages/FrontendExperiencePlatform';

// Owner Specific Pages
import { NotificationsCenter } from '../pages/owner/NotificationsCenter';
import { OwnerProfilePage } from '../pages/owner/OwnerProfilePage';
import { OwnerCommandMenu } from '../pages/owner/OwnerCommandMenu';
import { OwnerSettingsPage } from '../pages/owner/OwnerSettingsPage';
import { SecurityCenterPage } from '../pages/owner/SecurityCenterPage';
import { GlobalSearchPage } from '../pages/owner/GlobalSearchPage';
import { OwnerHelpSupportPage } from '../pages/owner/OwnerHelpSupportPage';
import { CreateNewCampusPage } from '../pages/owner/CreateNewCampusPage';
import { ModuleComingSoonPage } from '../pages/owner/ModuleComingSoonPage';
import { InstitutionManagementPage } from '../pages/owner/InstitutionManagementPage';
import { InstitutionWorkspaceLayout } from '../components/owner/workspace/InstitutionWorkspaceLayout';

export class RouteResolver {
  static renderRoute(
    path: string, 
    tenant: Tenant, 
    onNavigate: (path: string) => void
  ): React.ReactNode {
    const safePath = path || '';
    // 8 Core Workspaces Routing
    if (
      safePath.startsWith('/owner/workspaces/') || 
      safePath.startsWith('/owner/workspace/') || 
      safePath.startsWith('workspace_') ||
      safePath === '/owner/workspaces' ||
      safePath === 'workspaces'
    ) {
      return <InstitutionWorkspaceLayout tenant={tenant} activePath={safePath} onNavigate={onNavigate} />;
    }

    if (safePath === 'module_institution' || safePath === '/owner/institution-organization' || safePath.startsWith('/owner/institution-organization/')) {
      return <InstitutionManagementPage tenant={tenant} activePath={safePath} onNavigate={onNavigate} />;
    }

    switch (safePath) {
      case 'dashboard':
        return <DashboardHome tenant={tenant} onNavigate={onNavigate} />;
      case 'notifications':
        return <NotificationsCenter onNavigate={onNavigate} />;
      case 'profile':
        return <OwnerProfilePage onNavigate={onNavigate} />;
      case 'command_menu':
        return <OwnerCommandMenu onNavigate={onNavigate} />;
      case 'settings':
        return <OwnerSettingsPage tenant={tenant} onNavigate={onNavigate} />;
      case 'security':
        return <SecurityCenterPage onNavigate={onNavigate} />;
      case 'search':
        return <GlobalSearchPage onNavigate={onNavigate} />;
      case 'help':
        return <OwnerHelpSupportPage onNavigate={onNavigate} />;
      case 'create_campus':
      case 'create-campus':
        return <CreateNewCampusPage tenant={tenant} onNavigate={onNavigate} />;

      case 'ai_hub':
        return <AiHub />;
      case 'students':
        return <StudentsPortal />;
      case 'fees':
        return <FeeManagement />;
      case 'attendance':
        return <AttendancePortal />;
      case 'transport':
        return <TransportPortal />;
      case 'exams':
        return <ExaminationPortal />;
      case 'hrms':
        return <HrmsPayroll />;
      case 'library':
        return <InventoryLibraryHostel />;
      case 'cctv':
        return <CctvSecurity />;
      case 'mobile_apps':
        return <MobileAppSimulator />;
      case 'design_system':
        return <FrontendExperiencePlatform />;
      default:
        if (safePath.startsWith('module_')) {
          return <ModuleComingSoonPage modulePath={safePath} onNavigate={onNavigate} />;
        }
        return (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-4xl">🌌</div>
            <h3 className="text-lg font-bold text-slate-800">Operational Space Synchronizing</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              The workspace sub-module (<code>{safePath}</code>) is resolving in our educational operating system.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              Return to Command Center
            </button>
          </div>
        );
    }
  }
}
