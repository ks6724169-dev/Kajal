import { useState, useEffect } from 'react';
import { navigationStore, NavigationState, BreadcrumbItem } from '../store/navigationStore';

export function useNavigation() {
  const [state, setState] = useState<NavigationState>(navigationStore.getState());

  useEffect(() => {
    const unsubscribe = navigationStore.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    navigationStore.toggleSidebar();
  };

  const setSidebarOpen = (open: boolean) => {
    navigationStore.setSidebarOpen(open);
  };

  const setActivePath = (path: string) => {
    navigationStore.setActivePath(path);
  };

  const setBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
    navigationStore.setBreadcrumbs(breadcrumbs);
  };

  return {
    sidebarOpen: state.sidebarOpen,
    activePath: state.activePath,
    breadcrumbs: state.breadcrumbs,
    toggleSidebar,
    setSidebarOpen,
    setActivePath,
    setBreadcrumbs
  };
}
