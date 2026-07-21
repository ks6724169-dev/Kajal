import { Role } from '../types';

export class PermissionResolver {
  private static ROLE_PERMISSIONS: Record<Role, string[]> = {
    super_admin: ['manage_all', 'configure_system', 'edit_finance', 'view_reports', 'delete_records'],
    organization_owner: ['manage_all', 'configure_system', 'edit_finance', 'view_reports', 'delete_records'],
    school_admin: ['manage_tenant', 'edit_academic', 'view_reports', 'manage_users', 'view_students'],
    principal: ['manage_tenant', 'edit_academic', 'view_reports', 'manage_users', 'view_students', 'view_teachers'],
    vice_principal: ['edit_academic', 'view_reports', 'view_students', 'view_teachers', 'take_attendance'],
    teacher: ['edit_academic', 'take_attendance', 'view_students', 'grade_exams'],
    class_teacher: ['edit_academic', 'take_attendance', 'view_students', 'grade_exams', 'counsel_students'],
    accountant: ['edit_finance', 'view_fees', 'generate_invoices'],
    hr: ['manage_payroll', 'edit_employees', 'view_staff'],
    receptionist: ['view_visitors', 'manage_visitors', 'take_queries'],
    transport_manager: ['manage_transport', 'view_transport', 'track_buses'],
    hostel_manager: ['manage_hostel', 'view_hostel', 'manage_residents'],
    librarian: ['manage_library', 'view_books', 'issue_books'],
    student: ['view_own_dashboard', 'view_academic_reports', 'view_fees'],
    parent: ['view_own_dashboard', 'view_academic_reports', 'view_fees', 'pay_fees', 'track_bus_ward'],
    driver: ['track_buses', 'view_bus_route'],
    exam_controller: ['manage_exams', 'grade_exams', 'view_students'],
    inventory_manager: ['manage_inventory', 'view_inventory'],
    guest: ['view_sandbox']
  };

  static getPermissionsForRole(role: Role): string[] {
    return this.ROLE_PERMISSIONS[role] || [];
  }

  static hasPermission(role: Role, userPermissions: string[], requiredPermissions: string[]): boolean {
    if (role === 'super_admin' || role === 'organization_owner') {
      return true;
    }
    
    const roleSpecificPerms = this.getPermissionsForRole(role);
    const combinedPerms = new Set([...userPermissions, ...roleSpecificPerms]);

    if (combinedPerms.has('manage_all')) {
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
