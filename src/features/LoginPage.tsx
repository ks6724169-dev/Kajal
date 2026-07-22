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
    if (path === '/auth/login' || path === 'login') {
      setAuthRoute('login');
    } else if (path === '/auth/forgot-password' || path === 'forgot-password') {
      setAuthRoute('forgot-password');
    } else if (path === '/auth/reset-password' || path === 'reset-password') {
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
    }
  };

  return (
    <div 
      id="full-auth-system-portal" 
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-hidden selection:bg-indigo-600 selection:text-white"
    >
      {/* Premium Ambient Background Spheres */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-200/40 via-blue-100/30 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-violet-200/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none -z-10"></div>
      
      {/* Global Toast Overlay Notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
                t.type === 'success' 
                  ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' 
                  : t.type === 'error'
                  ? 'bg-rose-50/95 border-rose-200 text-rose-800'
                  : t.type === 'warning'
                  ? 'bg-amber-50/95 border-amber-200 text-amber-800'
                  : 'bg-indigo-50/95 border-indigo-200 text-indigo-800'
              }`}
            >
              {t.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />}
              {t.type === 'warning' && <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />}
              {t.type === 'info' && <Sparkles className="h-5 w-5 shrink-0 text-indigo-600" />}
              
              <div className="text-xs font-semibold">{t.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10">
        <button 
          id="auth-global-back-btn"
          onClick={() => {
            if (authRoute !== 'login') {
              setAuthRoute('login');
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-full shadow-xs hover:shadow-sm transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>{authRoute === 'login' ? 'Back to Marketing' : 'Return to Login'}</span>
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            SLA ACTIVE
          </span>
        </div>
      </header>

      {/* Main Dual-Panel Layout Container */}
      <main className="max-w-7xl w-full mx-auto px-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 z-10">
        
        {/* Left Side: Modern Enterprise ERP Visual Showcase Panel */}
        <div className="lg:col-span-6 hidden lg:flex flex-col justify-center space-y-8 pr-6 select-none">
          <div className="space-y-4">
            <div className="mb-2">
              <GalaxyLogo size="lg" subtitle="GALAXY Sovereign Operating Platform" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Next-Gen Academic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600">
                Enterprise Cloud OS
              </span>
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
              Securely access your active academic tenant. Experience zero-trust protection over student information systems, payroll, financial catalogs, and administrative workflows.
            </p>
          </div>

          {/* Interactive Live Service Dashboard Mockup */}
          <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-indigo-600" />
                <span className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Active Module Gateway</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                <Wifi className="w-3 h-3 animate-pulse" />
                <span>ALL SENSORS ONLINE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50/50 border border-slate-150 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">Biometric Gateway</span>
                  <span className="text-xs font-extrabold text-slate-700">99.98% Handshake</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
              </div>

              <div className="p-3.5 bg-slate-50/50 border border-slate-150 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">GPS Bus Telemetry</span>
                  <span className="text-xs font-extrabold text-slate-700">42 Transits Active</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              </div>

              <div className="p-3.5 bg-slate-50/50 border border-slate-150 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">Parent Comm Fabric</span>
                  <span className="text-xs font-extrabold text-slate-700">2.4k Deliveries/min</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              </div>

              <div className="p-3.5 bg-slate-50/50 border border-slate-150 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">Database Replication</span>
                  <span className="text-xs font-extrabold text-slate-700">SSL Sync Complete</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              </div>
            </div>
          </div>

          {/* Trusted Security Compliance Indicators */}
          <div className="grid grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-white/40 border border-slate-200/60 rounded-xl space-y-1 flex flex-col items-center text-center shadow-xs">
              <Shield className="w-5 h-5 text-indigo-600" />
              <h4 className="text-[10px] font-bold text-slate-700 uppercase leading-none mt-1">SOC 2 Type II</h4>
              <p className="text-[9px] text-slate-400">Security Certified</p>
            </div>
            <div className="p-3 bg-white/40 border border-slate-200/60 rounded-xl space-y-1 flex flex-col items-center text-center shadow-xs">
              <Lock className="w-5 h-5 text-violet-600" />
              <h4 className="text-[10px] font-bold text-slate-700 uppercase leading-none mt-1">AES-256 Storage</h4>
              <p className="text-[9px] text-slate-400">Secure Encryption</p>
            </div>
            <div className="p-3 bg-white/40 border border-slate-200/60 rounded-xl space-y-1 flex flex-col items-center text-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="text-[10px] font-bold text-slate-700 uppercase leading-none mt-1">ISO 27001</h4>
              <p className="text-[9px] text-slate-400">Process Audited</p>
            </div>
            <div className="p-3 bg-white/40 border border-slate-200/60 rounded-xl space-y-1 flex flex-col items-center text-center shadow-xs">
              <Database className="w-5 h-5 text-blue-600" />
              <h4 className="text-[10px] font-bold text-slate-700 uppercase leading-none mt-1">GDPR Standard</h4>
              <p className="text-[9px] text-slate-400">Data Sovereignty</p>
            </div>
          </div>
        </div>

        {/* Right Side: Clean High-Contrast Auth Panel */}
        <div className="col-span-1 lg:col-span-6 flex items-center justify-center w-full">
          <div className="w-full max-w-xl relative transition-all">
            {isOAuthSyncing && (
              <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center space-y-4 rounded-3xl p-6 shadow-xl border border-slate-200">
                <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
                <div className="text-center">
                  <h3 className="text-sm font-bold text-slate-800">Establishing Workspace Session</h3>
                  <p className="text-xs text-slate-400 mt-1">Synchronizing institutional security tokens...</p>
                </div>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={authRoute}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
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

      {/* Modern High-Contrast Footer */}
      <footer className="w-full bg-white border-t border-slate-200/60 py-6 text-xs text-slate-400 mt-auto z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>GALAXY SECURE INGRESS OS • ACTIVE WORKSPACE PROTOCOLS</span>
          </div>
          <span className="text-[11px]">© 2026 GALAXY ERP SOLUTIONS INC. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
};
