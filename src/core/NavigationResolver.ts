import { NavItem } from '../types/frontend';
import { Role } from '../types';
import { PermissionResolver } from './PermissionResolver';

export class NavigationResolver {
  private static ALL_NAVIGATION_ITEMS: NavItem[] = [
    {
      id: 'dashboard',
      title: 'Command Center',
      hindiTitle: 'कमांड सेंटर',
      path: 'dashboard',
      icon: 'LayoutDashboard',
      roles: [
        'super_admin', 'organization_owner', 'school_admin', 'principal', 
        'vice_principal', 'teacher', 'class_teacher', 'accountant', 'hr', 
        'receptionist', 'transport_manager', 'hostel_manager', 'librarian', 
        'student', 'parent', 'driver', 'guest'
      ],
      isFavorite: true
    },
    {
      id: 'ai_hub',
      title: 'Galaxy AI Engine',
      hindiTitle: 'गैलेक्सी एआई इंजन',
      path: 'ai_hub',
      icon: 'Sparkles',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher'],
      badge: 'PRO'
    },
    {
      id: 'students',
      title: 'Student Module',
      hindiTitle: 'छात्र मॉड्यूल',
      path: 'students',
      icon: 'Users',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher', 'receptionist', 'student', 'parent']
    },
    {
      id: 'fees',
      title: 'Fiscal Catalog & Fees',
      hindiTitle: 'वित्तीय सूची और शुल्क',
      path: 'fees',
      icon: 'CreditCard',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'accountant', 'student', 'parent']
    },
    {
      id: 'attendance',
      title: 'Biometrics & Attendance',
      hindiTitle: 'बायोमेट्रिक्स और उपस्थिति',
      path: 'attendance',
      icon: 'Calendar',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher', 'student', 'parent']
    },
    {
      id: 'transport',
      title: 'Fleet & GPS Telemetry',
      hindiTitle: 'बेड़ा और जीपीएस ट्रैकिंग',
      path: 'transport',
      icon: 'Bus',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'transport_manager', 'student', 'parent', 'driver']
    },
    {
      id: 'exams',
      title: 'Assessment & Grades',
      hindiTitle: 'मूल्यांकन और ग्रेड',
      path: 'exams',
      icon: 'FileText',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher', 'student', 'parent']
    },
    {
      id: 'hrms',
      title: 'HRMS & Payroll',
      hindiTitle: 'मानव संसाधन और वेतन',
      path: 'hrms',
      icon: 'Briefcase',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'hr']
    },
    {
      id: 'library',
      title: 'Inventory, Library & Hostel',
      hindiTitle: 'इन्वेंटरी, लाइब्रेरी और हॉस्टल',
      path: 'library',
      icon: 'BookOpen',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'librarian', 'hostel_manager', 'student', 'parent']
    },
    {
      id: 'cctv',
      title: 'CCTV Security Guard',
      hindiTitle: 'सीसीटीवी सुरक्षा',
      path: 'cctv',
      icon: 'Video',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal'],
      badge: 'LIVE'
    },
    {
      id: 'mobile_apps',
      title: 'Mobile App Simulator',
      hindiTitle: 'मोबाइल ऐप सिम्युलेटर',
      path: 'mobile_apps',
      icon: 'Smartphone',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal', 'teacher', 'class_teacher', 'student', 'parent', 'driver']
    },
    {
      id: 'design_system',
      title: 'Design System',
      hindiTitle: 'डिजाइन सिस्टम',
      path: 'design_system',
      icon: 'Layers',
      roles: ['super_admin', 'organization_owner']
    },
    {
      id: 'settings',
      title: 'Sovereign Configuration',
      hindiTitle: 'संप्रभु विन्यास',
      path: 'settings',
      icon: 'Settings',
      roles: ['super_admin', 'organization_owner', 'school_admin', 'principal']
    }
  ];

  static resolveNavigationForRole(role: Role, userPermissions: string[] = []): NavItem[] {
    return this.ALL_NAVIGATION_ITEMS.filter(item => {
      // 1. Role-based filter
      const isRoleAllowed = item.roles.includes(role);
      if (!isRoleAllowed) return false;

      // 2. Permission-based filter
      if (item.permissions && item.permissions.length > 0) {
        return PermissionResolver.hasPermission(role, userPermissions, item.permissions);
      }

      return true;
    });
  }
}
