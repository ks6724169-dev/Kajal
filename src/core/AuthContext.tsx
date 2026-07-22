import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Role } from '../types';
import { authStore } from '../store/authStore';
import { resolveUserTenantAndRole } from './auth/supabaseAuthResolver';

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  role: Role | null;
  setRole: (role: Role) => void;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  setRole: () => {},
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRoleState] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize authenticated role
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const refreshProfile = async () => {
    try {
      const { data: { user: verifiedUser } } = await supabase.auth.getUser();
      if (verifiedUser) {
        setUser(verifiedUser);
        const savedUserStr = localStorage.getItem('galaxy_user') || sessionStorage.getItem('galaxy_user');
        const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
        const schoolCode = savedUser?.schoolCode || savedUser?.schoolId || '';

        const resolved = await resolveUserTenantAndRole(verifiedUser.id, verifiedUser.email || '', schoolCode);
        if (resolved.success && resolved.data) {
          setRoleState(resolved.data.role);
          const updatedUserObj = {
            id: resolved.data.id,
            name: resolved.data.name,
            role: resolved.data.role,
            email: resolved.data.email,
            tenantId: resolved.data.tenantId,
            schoolCode: resolved.data.schoolId,
            campus: resolved.data.campus
          };
          authStore.login(updatedUserObj, true);
        }
      }
    } catch (e) {
      console.error('Error refreshing Supabase Auth profile:', e);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error during Supabase signout:', e);
    } finally {
      setSession(null);
      setUser(null);
      setRoleState(null);
      authStore.logout();
    }
  };

  useEffect(() => {
    let mounted = true;

    // Restore active session on application startup
    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted && initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);

          // Verify token and resolve user profile/role from DB
          const { data: { user: verifiedUser } } = await supabase.auth.getUser();
          if (verifiedUser) {
            const savedUserStr = localStorage.getItem('galaxy_user') || sessionStorage.getItem('galaxy_user');
            const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
            const schoolCode = savedUser?.schoolCode || savedUser?.schoolId || '';

            const resolved = await resolveUserTenantAndRole(verifiedUser.id, verifiedUser.email || '', schoolCode);
            if (resolved.success && resolved.data) {
              setRoleState(resolved.data.role);
              const updatedUserObj = {
                id: resolved.data.id,
                name: resolved.data.name,
                role: resolved.data.role,
                email: resolved.data.email,
                tenantId: resolved.data.tenantId,
                schoolCode: resolved.data.schoolId,
                campus: resolved.data.campus
              };
              authStore.login(updatedUserObj, true);
            } else {
              // Forced signout if user/tenant account is inactive or suspended
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              setRoleState(null);
              authStore.logout();
            }
          }
        }
      } catch (err) {
        console.error('Error initializing Supabase session:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    // Listen for Auth State Changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          const savedUserStr = localStorage.getItem('galaxy_user') || sessionStorage.getItem('galaxy_user');
          const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
          const schoolCode = savedUser?.schoolCode || savedUser?.schoolId || '';

          const resolved = await resolveUserTenantAndRole(currentSession.user.id, currentSession.user.email || '', schoolCode);
          if (resolved.success && resolved.data) {
            setRoleState(resolved.data.role);
          } else {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setRoleState(null);
            authStore.logout();
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setRoleState(null);
        authStore.logout();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, role, setRole, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
