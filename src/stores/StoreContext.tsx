import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Tenant } from '../types/index';
import { ThemeMode, Language, NavItem } from '../types/frontend';
import { TENANTS } from '../constants/mockData';

// Notification interface
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

// Global Store State interface
interface StoreState {
  // Session Store
  user: { id: string; name: string; role: Role; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, role: Role) => void;
  logout: () => void;

  // Theme Store
  theme: ThemeMode;
  direction: 'ltr' | 'rtl';
  setTheme: (theme: ThemeMode) => void;
  setDirection: (dir: 'ltr' | 'rtl') => void;

  // Tenant Store
  currentTenant: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;

  // Language Store
  language: Language;
  setLanguage: (lang: Language) => void;

  // Notification Store
  notifications: AppNotification[];
  addNotification: (noti: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Permission Store
  permissions: string[];
  hasPermission: (perm: string) => boolean;
  setPermissions: (perms: string[]) => void;

  // Cache Store
  cache: Record<string, { value: any; expiry: number }>;
  setCacheItem: (key: string, value: any, ttlSeconds?: number) => void;
  getCacheItem: (key: string) => any;

  // Favorites & Recents Store
  favorites: string[];
  toggleFavorite: (path: string) => void;
  recentPages: string[];
  addRecentPage: (path: string) => void;

  // General States
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session State
  const [user, setUser] = useState<{ id: string; name: string; role: Role; email: string } | null>(() => {
    const saved = localStorage.getItem('galaxy_user');
    return saved ? JSON.parse(saved) : { id: 'usr-1', name: 'Dr. Rajesh Sharma', role: 'super_admin', email: 'superadmin@galaxy.edu' };
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('galaxy_auth') === 'true' || true;
  });

  // Theme State
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('galaxy_theme') as ThemeMode) || 'light';
  });
  const [direction, setDirectionState] = useState<'ltr' | 'rtl'>(() => {
    return (localStorage.getItem('galaxy_dir') as 'ltr' | 'rtl') || 'ltr';
  });

  // Tenant State
  const [currentTenant, setCurrentTenantState] = useState<Tenant>(() => {
    const saved = localStorage.getItem('galaxy_tenant');
    return saved ? JSON.parse(saved) : TENANTS[0];
  });

  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('galaxy_lang') as Language) || 'en';
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Permissions State
  const [permissions, setPermissionsState] = useState<string[]>(['manage_all', 'edit_finance', 'view_reports', 'delete_records']);

  // Cache State
  const [cache, setCache] = useState<Record<string, { value: any; expiry: number }>>({});

  // Navigation Extras
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('galaxy_favorites');
    return saved ? JSON.parse(saved) : ['/dashboard', '/ai-hub'];
  });
  const [recentPages, setRecentPages] = useState<string[]>(() => {
    const saved = localStorage.getItem('galaxy_recents');
    return saved ? JSON.parse(saved) : ['/dashboard', '/ai-hub', '/settings'];
  });

  // Sidebar and Command Palette states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Sync state with Tailwind and body classes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    localStorage.setItem('galaxy_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.dir = direction;
    localStorage.setItem('galaxy_dir', direction);
  }, [direction]);

  const login = (email: string, role: Role) => {
    const newUser = { id: 'usr-' + Date.now(), name: 'User Name', role, email };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('galaxy_user', JSON.stringify(newUser));
    localStorage.setItem('galaxy_auth', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('galaxy_user');
    localStorage.removeItem('galaxy_auth');
  };

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const setDirection = (d: 'ltr' | 'rtl') => setDirectionState(d);
  
  const setCurrentTenant = (t: Tenant) => {
    setCurrentTenantState(t);
    localStorage.setItem('galaxy_tenant', JSON.stringify(t));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('galaxy_lang', lang);
  };

  const addNotification = (noti: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNoti: AppNotification = {
      ...noti,
      id: 'n-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications((prev) => [newNoti, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const hasPermission = (perm: string) => {
    if (permissions.includes('manage_all')) return true;
    return permissions.includes(perm);
  };

  const setPermissions = (perms: string[]) => {
    setPermissionsState(perms);
  };

  const setCacheItem = (key: string, value: any, ttlSeconds: number = 300) => {
    const expiry = Date.now() + ttlSeconds * 1000;
    setCache((prev) => ({ ...prev, [key]: { value, expiry } }));
  };

  const getCacheItem = (key: string) => {
    const item = cache[key];
    if (!item) return null;
    if (Date.now() > item.expiry) {
      // cache expired
      const newCache = { ...cache };
      delete newCache[key];
      setCache(newCache);
      return null;
    }
    return item.value;
  };

  const toggleFavorite = (path: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path];
      localStorage.setItem('galaxy_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const addRecentPage = (path: string) => {
    setRecentPages((prev) => {
      const filtered = prev.filter((p) => p !== path);
      const updated = [path, ...filtered].slice(0, 8); // Keep last 8
      localStorage.setItem('galaxy_recents', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        theme,
        direction,
        setTheme,
        setDirection,
        currentTenant,
        setCurrentTenant,
        language,
        setLanguage,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        permissions,
        hasPermission,
        setPermissions,
        cache,
        setCacheItem,
        getCacheItem,
        favorites,
        toggleFavorite,
        recentPages,
        addRecentPage,
        sidebarOpen,
        setSidebarOpen,
        commandPaletteOpen,
        setCommandPaletteOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
