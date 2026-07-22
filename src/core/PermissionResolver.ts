import { Role } from '../types';
import { getPermissionsForRole } from './rbac';

export class PermissionResolver {
  static getPermissionsForRole(role: Role): string[] {
    return getPermissionsForRole(role);
  }

  static hasPermission(role: Role, userPermissions: string[], requiredPermissions: string[]): boolean {
    if (role === 'super_admin' || role === 'organization_owner') {
      return true;
    }
    
    const roleSpecificPerms = this.getPermissionsForRole(role);
    const combinedPerms = new Set([...userPermissions, ...roleSpecificPerms]);

    if (combinedPerms.has('*') || combinedPerms.has('manage_all')) {
      return true;
    }

    return requiredPermissions.every(perm => combinedPerms.has(perm));
  }

  static hasAccessToModule(role: Role, moduleName: string): boolean {
    // Super admins & owners have access to all modules
    if (role === 'super_admin' || role === 'organization_owner') {
      return true;
    }

    const modulePermissions: Record<string, Role[]> = {
      dashboard: ['school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher', 'accountant', 'hr', 'receptionist', 'transport_manager', 'hostel_manager', 'librarian', 'student', 'parent'],
      ai_hub: ['school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher'],
      students: ['school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher', 'receptionist', 'student', 'parent'],
      fees: ['school_admin', 'principal', 'accountant', 'parent', 'student'],
      attendance: ['school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher', 'student', 'parent'],
      transport: ['school_admin', 'principal', 'transport_manager', 'parent', 'student', 'driver'],
      exams: ['school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher', 'student', 'parent'],
      hrms: ['school_admin', 'principal', 'hr'],
      library: ['school_admin', 'principal', 'librarian', 'student', 'parent'],
      cctv: ['super_admin', 'organization_owner', 'school_admin', 'principal'],
      mobile_apps: ['student', 'parent', 'teacher', 'driver'],
      settings: ['school_admin', 'principal']
    };

    const allowedRoles = modulePermissions[moduleName];
    if (!allowedRoles) return true; // modules not listed are public by default
    return allowedRoles.includes(role);
  }
}
