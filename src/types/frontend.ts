import React from 'react';
import { Role, Tenant } from './index';

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export interface ThemeConfig {
  mode: ThemeMode;
  direction: 'ltr' | 'rtl';
  fontSize: 'sm' | 'md' | 'lg';
}

// Localization Types
export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

// Dynamic Navigation & Permission Menu Types
export interface NavItem {
  id: string;
  title: string;
  hindiTitle?: string;
  path: string;
  icon: string;
  roles: Role[];
  permissions?: string[];
  children?: NavItem[];
  badge?: string;
  isFavorite?: boolean;
}

// State Stores Interface
export interface SessionState {
  user: {
    id: string;
    name: string;
    role: Role;
    email: string;
  } | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
}

export interface UIState {
  theme: ThemeMode;
  direction: 'ltr' | 'rtl';
  language: Language;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
}

// Micro Frontend types
export interface RemoteModule {
  id: string;
  name: string;
  url: string;
  version: string;
  status: 'loading' | 'loaded' | 'failed';
  entrypoint: string;
}

export interface MicroFrontendConfig {
  modules: RemoteModule[];
  sharedRegistry: Record<string, React.ComponentType<any>>;
}

// AI Assistant types
export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  promptText: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
