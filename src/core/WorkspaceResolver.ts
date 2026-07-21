import { Role, Tenant } from '../types';
import { workspaceStore, WorkspaceConfig } from '../store/workspaceStore';

export class WorkspaceResolver {
  static getWorkspaceForRole(role: Role): WorkspaceConfig {
    // Access the private/public configs from workspaceStore by instantiating or querying the lookup directly.
    // To make this robust, we invoke workspaceStore's config resolver or fallback safely.
    const state = workspaceStore.getState();
    const found = state.availableWorkspaces.find(w => w.role === role);
    if (found) return found;

    // Use a fresh lookup if not loaded
    return (workspaceStore as any).getWorkspaceConfigForRole(role);
  }

  static getBrandingForTenant(tenant: Tenant): { name: string; logo: string; themeColor: string } {
    return {
      name: tenant.name,
      logo: tenant.logo || '🌌',
      themeColor: tenant.themeColor || 'indigo'
    };
  }

  static getTenantWorkspaceDashboardStats(role: Role, tenant: Tenant) {
    const ws = this.getWorkspaceForRole(role);
    return ws.stats;
  }
}
