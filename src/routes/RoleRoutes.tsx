import React from 'react';
import { Role } from '../types';
import { WorkspaceRoute } from './WorkspaceRoute';

// Map of route paths to system Roles
export const RouteToRoleMap: Record<string, Role> = {
  '/student': 'student',
  '/teacher': 'teacher',
  '/parent': 'parent',
  '/principal': 'principal',
  '/admin': 'school_admin',
  '/super-admin': 'super_admin',
  '/hr': 'hr',
  '/accounting': 'accountant',
  '/library': 'librarian',
  '/transport': 'transport_manager',
  '/hostel': 'hostel_manager',
  '/examination': 'exam_controller',
  '/inventory': 'inventory_manager',
  '/reception': 'receptionist'
};

interface RoleRoutesProps {
  currentPath: string;
  children: React.ReactNode;
}

export const RoleRoutes: React.FC<RoleRoutesProps> = ({ currentPath, children }) => {
  const role = RouteToRoleMap[currentPath];

  if (!role) {
    return <>{children}</>;
  }

  return (
    <WorkspaceRoute role={role}>
      {children}
    </WorkspaceRoute>
  );
};
export default RoleRoutes;
