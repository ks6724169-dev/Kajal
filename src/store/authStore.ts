import { Role } from '../types';
import { getPermissionsForRole } from '../core/rbac';

export interface PreviewConfig {
  isPreview: boolean;
  role: Role;
  roleTitle: string;
  scopeType: 'INSTITUTION' | 'CAMPUS' | 'DEPARTMENT';
  scopeName: string;
  userName: string;
  email: string;
  campusId?: string;
  campusName?: string;
  departmentId?: string;
  departmentName?: string;
  permissions: string[];
}

export interface AuthState {
  user: { 
    id: string; 
    name: string; 
    role: Role; 
    email: string;
    tenantId?: string;
    schoolCode?: string;
    campus?: string;
    scopeType?: 'INSTITUTION' | 'CAMPUS' | 'DEPARTMENT';
    campusName?: string;
    departmentName?: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  mfaType: 'otp_email' | 'otp_sms' | 'totp' | null;
  mfaTicket: string | null;
  permissions: string[];
  previewConfig: PreviewConfig | null;
}

type Listener = (state: AuthState) => void;

class AuthStore {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    mfaRequired: false,
    mfaType: null,
    mfaTicket: null,
    permissions: [],
    previewConfig: null
  };

  private listeners = new Set<Listener>();

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    try {
      const savedPreview = sessionStorage.getItem('galaxy_preview');
      if (savedPreview) {
        const previewConfig: PreviewConfig = JSON.parse(savedPreview);
        this.state = {
          ...this.state,
          user: {
            id: `prev-${previewConfig.role}`,
            name: previewConfig.userName,
            role: previewConfig.role,
            email: previewConfig.email,
            scopeType: previewConfig.scopeType,
            campusName: previewConfig.campusName,
            departmentName: previewConfig.departmentName
          },
          isAuthenticated: true,
          permissions: previewConfig.permissions,
          previewConfig,
          isLoading: false
        };
        return;
      }

      const savedUser = localStorage.getItem('galaxy_user') || sessionStorage.getItem('galaxy_user');
      const isAuthenticated = localStorage.getItem('galaxy_auth') === 'true' || sessionStorage.getItem('galaxy_auth') === 'true';
      const savedPermissions = localStorage.getItem('galaxy_permissions');

      if (savedUser && isAuthenticated) {
        this.state = {
          ...this.state,
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          permissions: savedPermissions ? JSON.parse(savedPermissions) : ['manage_all'],
          isLoading: false
        };
      } else {
        this.state.isLoading = false;
      }
    } catch (e) {
      console.error('Error restoring auth store state:', e);
      this.state.isLoading = false;
    }
  }

  getState(): AuthState {
    return this.state;
  }

  setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  login(user: { id: string; name: string; role: Role; email: string }, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('galaxy_user', JSON.stringify(user));
    storage.setItem('galaxy_auth', 'true');

    // Default permissions based on role
    const permissions = this.getDefaultPermissionsForRole(user.role);
    storage.setItem('galaxy_permissions', JSON.stringify(permissions));

    this.setState({
      user,
      isAuthenticated: true,
      mfaRequired: false,
      mfaType: null,
      mfaTicket: null,
      permissions,
      isLoading: false
    });
  }

  updateProfile(updates: Partial<NonNullable<AuthState['user']>>) {
    if (!this.state.user) return;
    const updatedUser = { ...this.state.user, ...updates };
    
    if (localStorage.getItem('galaxy_user')) {
      localStorage.setItem('galaxy_user', JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem('galaxy_user')) {
      sessionStorage.setItem('galaxy_user', JSON.stringify(updatedUser));
    }

    this.setState({ user: updatedUser });
  }

  startRolePreview(role: 'organization_owner' | 'principal' | 'vice_principal') {
    let previewConfig: PreviewConfig;

    if (role === 'organization_owner') {
      previewConfig = {
        isPreview: true,
        role: 'organization_owner',
        roleTitle: 'Institution Owner',
        scopeType: 'INSTITUTION',
        scopeName: 'All Campuses (Global Institution)',
        userName: 'Dr. Arthur Pendelton (Owner)',
        email: 'owner.preview@galaxy-edu.org',
        permissions: ['FULL_CONTROL', 'MANAGE_USERS', 'MANAGE_SETTINGS', 'MANAGE_FINANCE', 'APPROVE_GOVERNANCE', 'ALL_CAMPUSES']
      };
    } else if (role === 'principal') {
      previewConfig = {
        isPreview: true,
        role: 'principal',
        roleTitle: 'Principal',
        scopeType: 'CAMPUS',
        scopeName: 'Main Heritage Campus',
        campusId: 'cmp_main',
        campusName: 'Main Heritage Campus',
        userName: 'Prof. Sarah Jenkins (Principal)',
        email: 'principal.preview@galaxy-edu.org',
        permissions: ['CAMPUS_MANAGE', 'ACADEMIC_MANAGE', 'STUDENT_MANAGE', 'ATTENDANCE_MANAGE', 'REPORTS_VIEW', 'ASSIGN_VICE_PRINCIPAL']
      };
    } else {
      previewConfig = {
        isPreview: true,
        role: 'vice_principal',
        roleTitle: 'Vice Principal',
        scopeType: 'DEPARTMENT',
        scopeName: 'Main Heritage Campus (Sciences Dept)',
        campusId: 'cmp_main',
        campusName: 'Main Heritage Campus',
        departmentId: 'dept_sci',
        departmentName: 'Sciences Department',
        userName: 'Dr. Marcus Vance (Vice Principal)',
        email: 'vp.preview@galaxy-edu.org',
        permissions: ['DEPT_MANAGE', 'ACADEMIC_VIEW', 'STUDENT_MANAGE', 'ATTENDANCE_MANAGE', 'REPORTS_VIEW']
      };
    }

    sessionStorage.setItem('galaxy_preview', JSON.stringify(previewConfig));

    const user = {
      id: `preview-${role}-001`,
      name: previewConfig.userName,
      role: previewConfig.role,
      email: previewConfig.email,
      scopeType: previewConfig.scopeType,
      campusName: previewConfig.campusName,
      departmentName: previewConfig.departmentName
    };

    this.setState({
      user,
      isAuthenticated: true,
      mfaRequired: false,
      mfaType: null,
      mfaTicket: null,
      permissions: previewConfig.permissions,
      previewConfig,
      isLoading: false
    });
  }

  exitPreviewMode() {
    sessionStorage.removeItem('galaxy_preview');
    this.logout();
  }

  logout() {
    sessionStorage.removeItem('galaxy_preview');
    localStorage.removeItem('galaxy_user');
    localStorage.removeItem('galaxy_auth');
    localStorage.removeItem('galaxy_permissions');
    sessionStorage.removeItem('galaxy_user');
    sessionStorage.removeItem('galaxy_auth');
    sessionStorage.removeItem('galaxy_permissions');

    this.setState({
      user: null,
      isAuthenticated: false,
      mfaRequired: false,
      mfaType: null,
      mfaTicket: null,
      permissions: [],
      isLoading: false
    });
  }

  setMfaRequired(required: boolean, type: 'otp_email' | 'otp_sms' | 'totp' | null, ticket: string | null) {
    this.setState({
      mfaRequired: required,
      mfaType: type,
      mfaTicket: ticket
    });
  }

  setPermissions(permissions: string[]) {
    localStorage.setItem('galaxy_permissions', JSON.stringify(permissions));
    this.setState({ permissions });
  }

  private getDefaultPermissionsForRole(role: Role): string[] {
    return getPermissionsForRole(role);
  }
}

export const authStore = new AuthStore();
