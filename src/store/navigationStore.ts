export interface BreadcrumbItem {
  label: string;
  hindiLabel?: string;
  path?: string;
}

export interface NavigationState {
  sidebarOpen: boolean;
  activePath: string; // current sub-route or tab
  breadcrumbs: BreadcrumbItem[];
}

type Listener = (state: NavigationState) => void;

class NavigationStore {
  private state: NavigationState = {
    sidebarOpen: true,
    activePath: 'dashboard',
    breadcrumbs: [{ label: 'Dashboard', hindiLabel: 'डैशबोर्ड' }]
  };

  private listeners = new Set<Listener>();

  getState(): NavigationState {
    return this.state;
  }

  setState(newState: Partial<NavigationState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  toggleSidebar() {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  }

  setSidebarOpen(open: boolean) {
    this.setState({ sidebarOpen: open });
  }

  setActivePath(path: string) {
    this.setState({ activePath: path });
  }

  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
    this.setState({ breadcrumbs });
  }
}

export const navigationStore = new NavigationStore();
