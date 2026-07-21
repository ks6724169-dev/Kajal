import { Role } from '../types';

export interface AuthState {
  user: { 
    id: string; 
    name: string; 
    role: Role; 
    email: string;
    tenantId?: string;
    schoolCode?: string;
    campus?: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  mfaType: 'otp_email' | 'otp_sms' | 'totp' | null;
  mfaTicket: string | null;
  permissions: string[];
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
    permissions: []
  };

  private listeners = new Set<Listener>();

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    try {
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

  logout() {
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
    switch (role) {
      case 'super_admin':
      case 'organization_owner':
        return ['manage_all', 'configure_system', 'edit_finance', 'view_reports', 'delete_records'];
      case 'school_admin':
      case 'principal':
        return ['manage_tenant', 'edit_academic', 'view_reports', 'manage_users'];
      case 'teacher':
        return ['edit_academic', 'take_attendance', 'view_students', 'grade_exams'];
      case 'accountant':
        return ['edit_finance', 'view_fees', 'generate_invoices'];
      case 'librarian':
        return ['manage_library', 'view_books'];
      case 'student':
      case 'parent':
        return ['view_own_dashboard', 'view_academic_reports', 'view_fees'];
      default:
        return ['view_own_dashboard'];
    }
  }
}

export const authStore = new AuthStore();
