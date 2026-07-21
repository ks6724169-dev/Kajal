import { Role } from '../types';

export interface RoleMeta {
  role: Role;
  label: string;
  hindiLabel: string;
  category: 'Platform' | 'Academic' | 'Administrative' | 'Logistical' | 'Constituent';
  level: number; // 100 for Super, 50 for admins, 30 for teachers, 10 for students
}

export const ROLE_METADATA: Record<Role, RoleMeta> = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    hindiLabel: 'सुपर एडमिन',
    category: 'Platform',
    level: 100
  },
  organization_owner: {
    role: 'organization_owner',
    label: 'Organization Owner',
    hindiLabel: 'संगठन मालिक',
    category: 'Platform',
    level: 90
  },
  school_admin: {
    role: 'school_admin',
    label: 'School Admin',
    hindiLabel: 'स्कूल व्यवस्थापक',
    category: 'Administrative',
    level: 80
  },
  principal: {
    role: 'principal',
    label: 'Principal',
    hindiLabel: 'प्राचार्य',
    category: 'Academic',
    level: 80
  },
  vice_principal: {
    role: 'vice_principal',
    label: 'Vice Principal',
    hindiLabel: 'उप-प्राचार्य',
    category: 'Academic',
    level: 70
  },
  teacher: {
    role: 'teacher',
    label: 'Teacher',
    hindiLabel: 'शिक्षक',
    category: 'Academic',
    level: 50
  },
  class_teacher: {
    role: 'class_teacher',
    label: 'Class Teacher',
    hindiLabel: 'कक्षा शिक्षक',
    category: 'Academic',
    level: 55
  },
  accountant: {
    role: 'accountant',
    label: 'Accountant',
    hindiLabel: 'लेखाकार',
    category: 'Administrative',
    level: 50
  },
  hr: {
    role: 'hr',
    label: 'HR Manager',
    hindiLabel: 'मानव संसाधन प्रबंधक',
    category: 'Administrative',
    level: 50
  },
  receptionist: {
    role: 'receptionist',
    label: 'Receptionist',
    hindiLabel: 'रिसेप्शनिस्ट',
    category: 'Administrative',
    level: 20
  },
  transport_manager: {
    role: 'transport_manager',
    label: 'Transport Manager',
    hindiLabel: 'परिवहन प्रबंधक',
    category: 'Logistical',
    level: 40
  },
  hostel_manager: {
    role: 'hostel_manager',
    label: 'Hostel Manager',
    hindiLabel: 'हॉस्टल प्रबंधक',
    category: 'Logistical',
    level: 40
  },
  librarian: {
    role: 'librarian',
    label: 'Librarian',
    hindiLabel: 'पुस्तकालय अध्यक्ष',
    category: 'Administrative',
    level: 40
  },
  student: {
    role: 'student',
    label: 'Student',
    hindiLabel: 'विद्यार्थी',
    category: 'Constituent',
    level: 10
  },
  parent: {
    role: 'parent',
    label: 'Parent',
    hindiLabel: 'अभिभावक',
    category: 'Constituent',
    level: 10
  },
  exam_controller: {
    role: 'exam_controller',
    label: 'Exam Controller',
    hindiLabel: 'परीक्षा नियंत्रक',
    category: 'Academic',
    level: 60
  },
  inventory_manager: {
    role: 'inventory_manager',
    label: 'Inventory Manager',
    hindiLabel: 'इन्वेंटरी प्रबंधक',
    category: 'Administrative',
    level: 40
  },
  guest: {
    role: 'guest',
    label: 'Guest',
    hindiLabel: 'अतिथि',
    category: 'Constituent',
    level: 1
  },
  driver: {
    role: 'driver',
    label: 'Driver',
    hindiLabel: 'चालक',
    category: 'Logistical',
    level: 20
  }
};

export class RoleResolver {
  static getMeta(role: Role): RoleMeta {
    return ROLE_METADATA[role] || {
      role,
      label: role,
      hindiLabel: role,
      category: 'Constituent',
      level: 0
    };
  }

  static getRolesByCategory(category: RoleMeta['category']): Role[] {
    return Object.values(ROLE_METADATA)
      .filter(meta => meta.category === category)
      .map(meta => meta.role);
  }

  static isHigherOrEqual(roleA: Role, roleB: Role): boolean {
    return this.getMeta(roleA).level >= this.getMeta(roleB).level;
  }

  static canSwitchTo(userRole: Role, targetRole: Role): boolean {
    if (userRole === 'super_admin') return true;
    if (userRole === 'organization_owner') return targetRole !== 'super_admin';
    if (userRole === 'school_admin' || userRole === 'principal') {
      const restricted = ['super_admin', 'organization_owner'];
      return !restricted.includes(targetRole);
    }
    return false;
  }

  static getSwitchableRoles(userRole: Role): Role[] {
    return (Object.keys(ROLE_METADATA) as Role[]).filter(target => 
      this.canSwitchTo(userRole, target)
    );
  }
}
