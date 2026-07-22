import { Role } from '../../types';

export const ROLE_DASHBOARD_MAPPING: Record<Role, string> = {
  super_admin: '/dashboard',
  organization_owner: '/owner/dashboard',
  school_admin: '/admin/dashboard',
  principal: '/principal/dashboard',
  vice_principal: '/principal/dashboard',
  teacher: '/teacher/dashboard',
  class_teacher: '/teacher/dashboard',
  student: '/student/dashboard',
  parent: '/parent/dashboard',
  accountant: '/accountant/dashboard',
  librarian: '/library/dashboard',
  hr: '/hr/dashboard',
  receptionist: '/reception/dashboard',
  hostel_manager: '/hostel/dashboard',
  transport_manager: '/transport/dashboard',
  exam_controller: '/exam/dashboard',
  inventory_manager: '/inventory/dashboard',
  guest: '/guest/dashboard',
  driver: '/driver/dashboard'
};

export const AUTH_ROUTES = {
  login: '/login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyOtp: '/auth/verify',
  dashboard: '/dashboard'
};
