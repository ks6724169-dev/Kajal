import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Sparkles, Cpu, Shield, Lock, CheckCircle, AlertCircle, RefreshCw, Layers, Database, Compass, Wifi } from 'lucide-react';
import { GalaxyLogo } from '../components/common/GalaxyLogo';
import { LoginPage as NewLoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { SessionManagementPage } from '../pages/auth/SessionManagementPage';
import { ProfileCompletionPage } from '../pages/auth/ProfileCompletionPage';
import { Role } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../services/supabase';
import { authStore } from '../store/authStore';
import { Navigation } from '../pages/public/landing/Navigation';
import { FooterSection } from '../pages/public/landing/FooterSection';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (role: Role) => void;
  onNavigate?: (path: string) => void;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess, onNavigate }) => {
  // Simple internal route tracker: 'login' | 'forgot-password' | 'reset-password' | 'sessions' | 'profile-completion'
  const [authRoute, setAuthRoute] = useState<'login' | 'forgot-password' | 'reset-password' | 'sessions' | 'profile-completion'>('login');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isOAuthSyncing, setIsOAuthSyncing] = useState(false);

  // Expose a helper to add toast notifications
  const addToast = (text: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Listen to global galaxy-toast event
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string; type: 'success' | 'error' | 'info' | 'warning' }>;
      if (customEvent && customEvent.detail) {
        addToast(customEvent.detail.text, customEvent.detail.type);
      }
    };
    window.addEventListener('galaxy-toast', handleToastEvent);
    return () => window.removeEventListener('galaxy-toast', handleToastEvent);
  }, []);

  // Listen for Supabase OAuth login completion and establish local session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth State Event:', event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setIsOAuthSyncing(true);
        addToast('✓ SSO Authentication Confirmed!', 'success');
        
        try {
          const email = session.user.email || '';
          // Resolve standard enterprise roles based on email domain or metadata
          let resolvedRole: Role = 'student';
          let userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
          
          if (email === 'superadmin@galaxy.edu' || email.includes('admin')) {
            resolvedRole = 'super_admin';
          } else if (email.includes('principal')) {
            resolvedRole = 'principal';
          } else if (email.includes('teacher') || email.includes('prof')) {
            resolvedRole = 'teacher';
          } else if (email.includes('finance') || email.includes('billing')) {
            resolvedRole = 'accountant';
          } else if (email.includes('parent')) {
            resolvedRole = 'parent';
          }
          
          const userObj = {
            id: session.user.id,
            name: userName,
            role: resolvedRole,
            email: email
          };

          // Synchronize local auth store
          authStore.login(userObj, true);
          
          addToast('✓ Session Synced Successfully!', 'success');
          
          setTimeout(() => {
            onLoginSuccess(resolvedRole);
            setIsOAuthSyncing(false);
          }, 1500);
        } catch (err) {
          console.error('Error synchronizing session:', err);
          addToast('SSO Synchronization Failed', 'error');
          setIsOAuthSyncing(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onLoginSuccess]);

  const handleNavigate = (path: string) => {
    if (path === '/auth/login' || path === '/login' || path === 'login') {
      setAuthRoute('login');
    } else if (path === '/auth/forgot-password' || path === '/forgot-password' || path === 'forgot-password') {
      setAuthRoute('forgot-password');
    } else if (path === '/auth/reset-password' || path === '/reset-password' || path === 'reset-password') {
      setAuthRoute('reset-password');
    } else if (path === '/auth/sessions' || path === 'sessions') {
      setAuthRoute('sessions');
    } else if (path === '/auth/profile-completion' || path === 'profile-completion') {
      setAuthRoute('profile-completion');
    } else if (path === '/dashboard') {
      onLoginSuccess('super_admin');
    } else if (path === 'school-lookup' || path === '/school-lookup') {
      if (onNavigate) onNavigate('/school-lookup');
    } else if (path === 'register' || path === '/register') {
      if (onNavigate) onNavigate('/register');
    } else if (path === 'verify-otp' || path === '/verify-otp') {
      if (onNavigate) onNavigate('/verify-otp');
    } else if (path === 'contact' || path === '/contact' || path === 'login-help' || path === '/login-help' || path === '/auth/login-help') {
      if (onNavigate) onNavigate('/login-help');
    } else if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div 
      id="full-auth-system-portal" 
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-hidden selection:bg-indigo-600 selection:text-white"
    >
      {/* Apple-style minimalist background */}
      <div className="absolute inset-0 bg-[#F5F5F7] -z-10"></div>
      <div className="absolute top-[-25%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-white blur-[120px] opacity-60 pointer-events-none -z-10"></div>
      
      {/* Global Toast Overlay Notifications */}
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border flex items-start gap-4 backdrop-blur-xl ${
                t.type === 'success' 
                  ? 'bg-white/90 border-emerald-100 text-emerald-900' 
                  : t.type === 'error'
                  ? 'bg-white/90 border-rose-100 text-rose-900'
                  : t.type === 'warning'
                  ? 'bg-white/90 border-amber-100 text-amber-900'
                  : 'bg-white/90 border-slate-100 text-slate-900'
              }`}
            >
              <div className="mt-0.5">
                {t.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />}
                {t.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />}
                {t.type === 'warning' && <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />}
                {t.type === 'info' && <Sparkles className="h-5 w-5 shrink-0 text-indigo-500" />}
              </div>
              
              <div className="text-sm font-semibold tracking-tight">{t.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Navigation onNavigate={handleNavigate} />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center pt-40 pb-48 min-h-[110vh] z-10">
        
        {/* Left Side: Refined Typography & Visuals */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-center space-y-10 select-none">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <GalaxyLogo size="lg" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-bold text-slate-900 tracking-tight leading-[1.05]"
            >
              The power to <br />
              <span className="text-indigo-600">transform</span> education.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium leading-relaxed max-w-md"
            >
              Securely access your institution's central intelligence hub. Engineered for precision, designed for humans.
            </motion.p>
          </div>

          {/* Security & Trust Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { icon: Shield, label: 'SOC 2 compliant' },
              { icon: Lock, label: 'End-to-end encrypted' },
              { icon: Database, label: 'Data sovereignty' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-slate-200/60 rounded-full text-[11px] font-bold text-slate-600 backdrop-blur-sm shadow-sm">
                <item.icon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side: Centered Auth Panel */}
        <div className="col-span-1 lg:col-span-7 flex items-center justify-center w-full">
          <div className="w-full max-w-lg relative">
            {isOAuthSyncing && (
              <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center space-y-6 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
                <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900">Establishing Session</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Synchronizing institutional security tokens...</p>
                </div>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={authRoute}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="w-full"
              >
                {authRoute === 'login' && (
                  <NewLoginPage navigate={handleNavigate} />
                )}
                {authRoute === 'forgot-password' && (
                  <ForgotPasswordPage navigate={handleNavigate} />
                )}
                {authRoute === 'reset-password' && (
                  <ResetPasswordPage navigate={handleNavigate} />
                )}
                {authRoute === 'sessions' && (
                  <SessionManagementPage navigate={handleNavigate} />
                )}
                {authRoute === 'profile-completion' && (
                  <ProfileCompletionPage navigate={handleNavigate} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </main>

      <FooterSection onNavigate={handleNavigate} />
    </div>
  );
};
