import { Tenant } from '../types';
import { TenantBranding, TenantManager } from '../services/TenantManager';
import { TENANTS } from '../constants/mockData';

export interface TenantState {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  branding: TenantBranding | null;
  isLoading: boolean;
}

type Listener = (state: TenantState) => void;

class TenantStore {
  private state: TenantState = {
    tenants: [],
    currentTenant: null,
    branding: null,
    isLoading: true
  };

  private listeners = new Set<Listener>();

  constructor() {
    this.initializeFromStorage();
  }

  private async initializeFromStorage() {
    try {
      const tenants = await TenantManager.getTenants();
      const savedTenantStr = localStorage.getItem('galaxy_tenant');
      let currentTenant: Tenant | null = null;

      if (savedTenantStr) {
        currentTenant = JSON.parse(savedTenantStr);
      } else {
        // Fallback to domain-based resolution
        currentTenant = await TenantManager.discoverTenantFromDomain(window.location.hostname);
        if (!currentTenant && tenants.length > 0) {
          currentTenant = tenants[0]; // Default fallback
        }
      }

      const branding = currentTenant ? TenantManager.getTenantBranding(currentTenant) : null;

      this.setState({
        tenants,
        currentTenant,
        branding,
        isLoading: false
      });
    } catch (e) {
      console.error('Failed to initialize tenant store:', e);
      this.setState({ tenants: TENANTS, currentTenant: TENANTS[0], isLoading: false });
    }
  }

  getState(): TenantState {
    return this.state;
  }

  setState(newState: Partial<TenantState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async selectTenant(tenantId: string) {
    this.setState({ isLoading: true });
    try {
      const tenant = await TenantManager.findTenantById(tenantId);
      if (tenant) {
        localStorage.setItem('galaxy_tenant', JSON.stringify(tenant));
        const branding = TenantManager.getTenantBranding(tenant);
        this.setState({
          currentTenant: tenant,
          branding,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (e) {
      console.error('Failed to select tenant:', e);
      this.setState({ isLoading: false });
    }
  }

  async selectTenantByCode(code: string): Promise<boolean> {
    this.setState({ isLoading: true });
    try {
      const tenant = await TenantManager.discoverTenantFromSchoolCode(code);
      if (tenant) {
        localStorage.setItem('galaxy_tenant', JSON.stringify(tenant));
        const branding = TenantManager.getTenantBranding(tenant);
        this.setState({
          currentTenant: tenant,
          branding,
          isLoading: false
        });
        return true;
      }
      this.setState({ isLoading: false });
      return false;
    } catch (e) {
      console.error('Failed to select tenant by code:', e);
      this.setState({ isLoading: false });
      return false;
    }
  }
}

export const tenantStore = new TenantStore();
