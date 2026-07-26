import React from 'react';
import { Tenant } from '../../../types';
import { InstitutionManagementPage } from '../../../pages/owner/InstitutionManagementPage';
import { StudentsPortal } from '../../../modules/super-admin/StudentsPortal';
import { FeeManagement } from '../../../modules/super-admin/FeeManagement';
import { AttendancePortal } from '../../../modules/super-admin/AttendancePortal';
import { TransportPortal } from '../../../modules/super-admin/TransportPortal';
import { ExaminationPortal } from '../../../modules/super-admin/ExaminationPortal';
import { HrmsPayroll } from '../../../modules/super-admin/HrmsPayroll';
import { InventoryLibraryHostel } from '../../../modules/super-admin/InventoryLibraryHostel';
import { CctvSecurity } from '../../../modules/super-admin/CctvSecurity';
import { AiHub } from '../../../modules/super-admin/AiHub';
import { NotificationsCenter } from '../../../pages/owner/NotificationsCenter';
import { WorkspaceComingSoon } from './WorkspaceComingSoon';

interface WorkspaceViewResolverProps {
  workspaceId: string;
  tenant: Tenant;
  activePath: string;
  onNavigate: (path: string) => void;
  userRole?: string;
}

export const WorkspaceViewResolver: React.FC<WorkspaceViewResolverProps> = ({
  workspaceId,
  tenant,
  activePath,
  onNavigate,
  userRole
}) => {
  switch (workspaceId) {
    case 'admin-governance':
      return <InstitutionManagementPage tenant={tenant} activePath={activePath} onNavigate={onNavigate} />;

    case 'academic-curriculum':
      if (activePath === 'students' || activePath.endsWith('/students')) {
        return <StudentsPortal />;
      }
      if (activePath === 'attendance' || activePath.endsWith('/attendance')) {
        return <AttendancePortal />;
      }
      return <WorkspaceComingSoon workspaceId="academic-curriculum" onNavigate={onNavigate} />;

    case 'student-lifecycle':
      if (activePath === 'students' || activePath.endsWith('/students')) {
        return <StudentsPortal />;
      }
      if (activePath === 'attendance' || activePath.endsWith('/attendance')) {
        return <AttendancePortal />;
      }
      return <WorkspaceComingSoon workspaceId="student-lifecycle" onNavigate={onNavigate} />;

    case 'assessment-exams':
      if (activePath === 'exams' || activePath.endsWith('/exams')) {
        return <ExaminationPortal />;
      }
      return <WorkspaceComingSoon workspaceId="assessment-exams" onNavigate={onNavigate} />;

    case 'finance-hr':
      if (activePath === 'fees' || activePath.endsWith('/fees')) {
        return <FeeManagement />;
      }
      if (activePath === 'hrms' || activePath.endsWith('/hrms')) {
        return <HrmsPayroll />;
      }
      return <WorkspaceComingSoon workspaceId="finance-hr" onNavigate={onNavigate} />;

    case 'campus-services':
      if (activePath === 'transport' || activePath.endsWith('/transport')) {
        return <TransportPortal />;
      }
      if (activePath === 'library' || activePath.endsWith('/library')) {
        return <InventoryLibraryHostel />;
      }
      if (activePath === 'cctv' || activePath.endsWith('/cctv')) {
        return <CctvSecurity />;
      }
      return <WorkspaceComingSoon workspaceId="campus-services" onNavigate={onNavigate} />;

    case 'communication-collaboration':
      if (activePath === 'notifications' || activePath.endsWith('/notifications')) {
        return <NotificationsCenter onNavigate={onNavigate} />;
      }
      return <WorkspaceComingSoon workspaceId="communication-collaboration" onNavigate={onNavigate} />;

    case 'intelligence-analytics':
      if (activePath === 'ai_hub' || activePath.endsWith('/ai_hub')) {
        return <AiHub />;
      }
      return <WorkspaceComingSoon workspaceId="intelligence-analytics" onNavigate={onNavigate} />;

    default:
      return <InstitutionManagementPage tenant={tenant} activePath={activePath} onNavigate={onNavigate} />;
  }
};
