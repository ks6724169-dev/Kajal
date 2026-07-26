import { supabase } from './supabase';
import { Role } from '../types';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

export type ScopeType = 'INSTITUTION' | 'CAMPUS' | 'DEPARTMENT';

export interface InstitutionUser {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  scope_type: ScopeType;
  campus_id?: string;
  campus_name?: string;
  department_id?: string;
  department_name?: string;
  permissions: string[];
  assigned_by?: string;
  status: 'ACTIVE' | 'PENDING' | 'REVOKED';
  created_at: string;
}

export interface ProvisionUserRequest {
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  scopeType: ScopeType;
  campusId?: string;
  campusName?: string;
  departmentId?: string;
  departmentName?: string;
  permissions?: string[];
  assignedBy?: string;
}

export interface GovernanceSettings {
  allow_principal_assign_vp: boolean;
  strict_campus_isolation: boolean;
  require_owner_approval_for_vp: boolean;
}

// In-memory fallback for environments without localStorage or Supabase table
const memoryUserStore = new Map<string, InstitutionUser[]>();
const memoryGovStore = new Map<string, GovernanceSettings>();

export class UserService {
  static async searchUsers(query: string, tenantId: string): Promise<UserProfile[]> {
    if (query.length < 2) return [];

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('tenant_id', tenantId)
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(5);

    if (error) {
      const isPlaceholder = (supabase as any).supabaseUrl?.includes('placeholder.supabase.co');
      if (error.code !== '42P01' && !isPlaceholder) console.error('Error searching users:', error);
      return [];
    }

    return data || [];
  }

  static async getUserById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Fetch all provisioned users for a tenant with roles and scopes
   */
  static async getInstitutionUsers(tenantId: string): Promise<InstitutionUser[]> {
    try {
      const { data, error } = await supabase
        .from('institution_users')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as InstitutionUser[];
      }
    } catch (e) {
      console.warn('Supabase institution_users table query fallback:', e);
    }

    // Local Storage or memory fallback for offline/preview resilience
    if (memoryUserStore.has(tenantId)) {
      return memoryUserStore.get(tenantId)!;
    }

    if (typeof localStorage !== 'undefined') {
      const localKey = `galaxy_users_${tenantId}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          memoryUserStore.set(tenantId, parsed);
          return parsed;
        } catch (e) {
          console.error('Error parsing stored users:', e);
        }
      }
    }

    // Initial default seed users
    const defaultSeed: InstitutionUser[] = [
      {
        id: 'usr_owner_01',
        tenant_id: tenantId,
        name: 'Dr. Arthur Pendelton',
        email: 'owner@galaxy.edu',
        phone: '+1 (555) 019-2831',
        role: 'organization_owner',
        scope_type: 'INSTITUTION',
        permissions: ['FULL_CONTROL', 'MANAGE_USERS', 'MANAGE_SETTINGS', 'MANAGE_FINANCE', 'APPROVE_GOVERNANCE'],
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 'usr_principal_01',
        tenant_id: tenantId,
        name: 'Prof. Sarah Jenkins',
        email: 's.jenkins@galaxy.edu',
        phone: '+1 (555) 019-8821',
        role: 'principal',
        scope_type: 'CAMPUS',
        campus_id: 'cmp_main',
        campus_name: 'Main Campus',
        permissions: ['CAMPUS_MANAGE', 'ACADEMIC_MANAGE', 'STUDENT_MANAGE', 'ATTENDANCE_MANAGE', 'REPORTS_VIEW'],
        assigned_by: 'Dr. Arthur Pendelton',
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 15 * 86400000).toISOString()
      },
      {
        id: 'usr_vp_01',
        tenant_id: tenantId,
        name: 'Dr. Marcus Vance',
        email: 'm.vance@galaxy.edu',
        phone: '+1 (555) 019-9942',
        role: 'vice_principal',
        scope_type: 'CAMPUS',
        campus_id: 'cmp_main',
        campus_name: 'Main Campus',
        department_id: 'dept_sci',
        department_name: 'Sciences',
        permissions: ['DEPT_MANAGE', 'ACADEMIC_VIEW', 'STUDENT_MANAGE', 'ATTENDANCE_MANAGE'],
        assigned_by: 'Prof. Sarah Jenkins',
        status: 'ACTIVE',
        created_at: new Date(Date.now() - 7 * 86400000).toISOString()
      }
    ];

    const localKey = `galaxy_users_${tenantId}`;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(defaultSeed));
    }
    return defaultSeed;
  }

  /**
   * Provision / Invite a new user with Role, Permission & Scope
   */
  static async provisionUser(req: ProvisionUserRequest): Promise<InstitutionUser> {
    const newUser: InstitutionUser = {
      id: `usr_${Date.now()}`,
      tenant_id: req.tenantId,
      name: req.name,
      email: req.email.toLowerCase().trim(),
      phone: req.phone || '',
      role: req.role,
      scope_type: req.scopeType,
      campus_id: req.campusId,
      campus_name: req.campusName,
      department_id: req.departmentId,
      department_name: req.departmentName,
      permissions: req.permissions || this.getDefaultPermissionsForRole(req.role),
      assigned_by: req.assignedBy || 'Institution Owner',
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    // Try Supabase insert first
    try {
      const { error } = await supabase
        .from('institution_users')
        .insert({
          id: newUser.id,
          tenant_id: newUser.tenant_id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          scope_type: newUser.scope_type,
          campus_id: newUser.campus_id,
          campus_name: newUser.campus_name,
          department_id: newUser.department_id,
          department_name: newUser.department_name,
          permissions: newUser.permissions,
          assigned_by: newUser.assigned_by,
          status: newUser.status,
          created_at: newUser.created_at
        });

      if (error) {
        console.warn('Supabase DB user insertion notice:', error.message);
      }
    } catch (err) {
      console.warn('Supabase DB error during user provisioning:', err);
    }

    // Persist to memory store and local storage list
    const existing = await this.getInstitutionUsers(req.tenantId);
    const updated = [newUser, ...existing.filter(u => u.id !== newUser.id)];
    memoryUserStore.set(req.tenantId, updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`galaxy_users_${req.tenantId}`, JSON.stringify(updated));
    }

    return newUser;
  }

  /**
   * Revoke or change user status
   */
  static async updateUserStatus(userId: string, tenantId: string, status: 'ACTIVE' | 'PENDING' | 'REVOKED'): Promise<boolean> {
    try {
      await supabase
        .from('institution_users')
        .update({ status })
        .eq('id', userId)
        .eq('tenant_id', tenantId);
    } catch (e) {
      console.warn('Supabase user status update notice:', e);
    }

    const existing = await this.getInstitutionUsers(tenantId);
    const updated = existing.map(u => u.id === userId ? { ...u, status } : u);
    memoryUserStore.set(tenantId, updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`galaxy_users_${tenantId}`, JSON.stringify(updated));
    }
    return true;
  }

  /**
   * Governance Settings for Tenant (e.g. Can Principal assign Vice Principal)
   */
  static async getGovernanceSettings(tenantId: string): Promise<GovernanceSettings> {
    if (memoryGovStore.has(tenantId)) {
      return memoryGovStore.get(tenantId)!;
    }

    const key = `galaxy_gov_settings_${tenantId}`;
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) {
        try { 
          const parsed = JSON.parse(stored);
          memoryGovStore.set(tenantId, parsed);
          return parsed;
        } catch (e) {}
      }
    }

    const defaultSettings: GovernanceSettings = {
      allow_principal_assign_vp: true,
      strict_campus_isolation: true,
      require_owner_approval_for_vp: false
    };

    memoryGovStore.set(tenantId, defaultSettings);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(defaultSettings));
    }
    return defaultSettings;
  }

  static async updateGovernanceSettings(tenantId: string, settings: Partial<GovernanceSettings>): Promise<GovernanceSettings> {
    const current = await this.getGovernanceSettings(tenantId);
    const updated = { ...current, ...settings };
    memoryGovStore.set(tenantId, updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`galaxy_gov_settings_${tenantId}`, JSON.stringify(updated));
    }

    try {
      await supabase
        .from('tenant_governance_settings')
        .upsert({ tenant_id: tenantId, ...updated });
    } catch (e) {
      // Local fallback handled above
    }

    return updated;
  }

  /**
   * Default permissions helper per role
   */
  static getDefaultPermissionsForRole(role: Role): string[] {
    switch (role) {
      case 'organization_owner':
        return ['FULL_CONTROL', 'MANAGE_USERS', 'MANAGE_SETTINGS', 'MANAGE_FINANCE', 'APPROVE_GOVERNANCE', 'ALL_CAMPUSES'];
      case 'principal':
        return ['CAMPUS_MANAGE', 'ACADEMIC_MANAGE', 'STUDENT_MANAGE', 'ATTENDANCE_MANAGE', 'REPORTS_VIEW', 'ASSIGN_VICE_PRINCIPAL'];
      case 'vice_principal':
        return ['DEPT_MANAGE', 'ACADEMIC_VIEW', 'STUDENT_MANAGE', 'ATTENDANCE_MANAGE', 'REPORTS_VIEW'];
      case 'school_admin':
        return ['ADMIN_MANAGE', 'STUDENT_MANAGE', 'ATTENDANCE_MANAGE', 'FEES_MANAGE'];
      default:
        return ['VIEW_SCOPED_DATA'];
    }
  }
}

