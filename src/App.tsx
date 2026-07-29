import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Tenant, Role } from './types/index';
import { TENANTS } from './constants/mockData';
import { CommandPalette } from './components/CommandPalette';
import { useStore } from './stores/StoreContext';
import { useAuth } from './hooks/useAuth';
import { RoleRouter } from './core/RoleRouter';
import { RoleWorkspace } from './core/RoleWorkspace';
import { ThemeProvider } from './core/theme/ThemeContext';
import { I18nProvider } from './core/i18n/I18nContext';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { SEO } from './components/seo/SEO';

// Lazy load pages for performance
const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./features/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterSchoolPage = lazy(() => import('./pages/auth/RegisterSchoolPage').then(m => ({ default: m.RegisterSchoolPage })));
const SchoolPaymentCheckoutPage = lazy(() => import('./pages/auth/SchoolPaymentCheckoutPage').then(m => ({ default: m.SchoolPaymentCheckoutPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const SchoolLookupPage = lazy(() => import('./pages/auth/SchoolLookupPage').then(m => ({ default: m.SchoolLookupPage })));
const LoginHelpPage = lazy(() => import('./pages/auth/LoginHelpPage').then(m => ({ default: m.LoginHelpPage })));
const AIFeaturesPage = lazy(() => import('./pages/public/ai/AIFeaturesPage').then(m => ({ default: m.AIFeaturesPage })));
const PricingPage = lazy(() => import('./pages/public/pricing/PricingPage').then(m => ({ default: m.PricingPage })));
const DocumentationPage = lazy(() => import('./pages/public/docs/DocumentationPage').then(m => ({ default: m.DocumentationPage })));
const ContactPage = lazy(() => import('./pages/public/contact/ContactPage').then(m => ({ default: m.ContactPage })));
const FeaturesPage = lazy(() => import('./pages/public/features/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const IntelligencePage = lazy(() => import('./pages/public/intelligence/IntelligencePage').then(m => ({ default: m.IntelligencePage })));
const SecurityPage = lazy(() => import('./pages/public/security/SecurityPage').then(m => ({ default: m.SecurityPage })));
const DemoPage = lazy(() => import('./pages/public/demo/DemoPage').then(m => ({ default: m.DemoPage })));
const HelpCenterPage = lazy(() => import('./pages/public/help/HelpCenterPage').then(m => ({ default: m.HelpCenterPage })));
const CommunityPage = lazy(() => import('./pages/public/community/CommunityPage').then(m => ({ default: m.CommunityPage })));
const StatusPage = lazy(() => import('./pages/public/status/StatusPage').then(m => ({ default: m.StatusPage })));
const AboutPage = lazy(() => import('./pages/public/about/AboutPage').then(m => ({ default: m.AboutPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/public/legal/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/public/legal/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));

export default function App() {
  const [route, setRoute] = useState<string>('/');
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>('landing');
  const [currentTenant, setCurrentTenant] = useState<Tenant>(TENANTS[0]);
  const [currentRole, setCurrentRole] = useState<Role>('super_admin');
  const [language, setLanguage] = useState('en');

  const { setCommandPaletteOpen } = useStore();
  const { isAuthenticated, user } = useAuth();

  const navigate = (path: string) => {
    const safePath = path || '';
    setRoute(safePath);
    if (window.location.pathname !== safePath && safePath.startsWith('/')) {
      window.history.pushState({}, '', safePath);
    }
    if (path === '/' || path === '/landing') {
      setCurrentView('landing');
    } else if (path === '/login' || path === '/auth/login') {
      setCurrentView('login');
    } else if (path === '/app' || path === '/dashboard' || path === '/workspace' || path === '/command-center') {
      setCurrentView('app');
      if (path === '/command-center') {
        setCommandPaletteOpen(true);
      }
    } else {
      setCurrentView('app');
    }
  };

  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        navigate(customEvent.detail);
      }
    };
    window.addEventListener('nav-to', handleNav);

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/owner/') || currentPath === '/app' || currentPath === '/dashboard') {
        setRoute(currentPath);
        setCurrentView('app');
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Initial Path Routing Verification
    const currentPath = window.location.pathname;
    const initialRoutes = ['/dashboard', '/workspace', '/command-center', '/login', '/auth/login', '/register', '/school-lookup', '/forgot-password', '/auth/forgot-password', '/reset-password', '/auth/reset-password', '/pricing', '/docs', '/contact', '/login-help', '/auth/login-help', '/features', '/intelligence', '/security', '/demo', '/help', '/community', '/status', '/about', '/privacy', '/terms'];
    if (initialRoutes.includes(currentPath) || currentPath.startsWith('/school-registration/') || currentPath.startsWith('/owner/')) {
      navigate(currentPath);
    }

    return () => {
      window.removeEventListener('nav-to', handleNav);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Synchronize authenticated state with current view
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('app');
      if (route === '/' || route === '/login' || route === '/auth/login') {
        setRoute('/app');
      }
    } else {
      setCurrentView('login');
      if (route === '/app' || route === '/dashboard' || route === '/workspace' || route === '/command-center' || route === '/') {
        setRoute('/login');
      }
    }
  }, [isAuthenticated]);

  const renderAuthLayout = (children: React.ReactNode) => {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-12 px-4 font-sans relative overflow-hidden selection:bg-indigo-600 selection:text-white">
        {/* Neon Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-900/10 blur-[100px]"></div>
        
        <div className="w-full max-w-2xl z-10 space-y-6">
          <div className="flex flex-col items-center space-y-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.795H13.62l1.317-7.3H9L6 11.23H10.5l-1.688 4.674z" />
              </svg>
            </div>
            <div className="text-center">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1 justify-center">
                GALAXY <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-semibold">ERP</span>
              </span>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Educational Operating System</p>
            </div>
          </div>

          {children}
        </div>
      </div>
    );
  };

  const renderAppBody = () => {
    const safeRoute = route || '';

    if (safeRoute === '/') {
      return (
        <LandingPage 
          onLogin={() => navigate('/login')} 
          onOpenTeacherPanel={() => {
            navigate('/login');
          }}
          onOpenRegistration={() => navigate('/register')}
          onNavigate={navigate}
        />
      );
    }

    if (safeRoute === '/register') {
      return <RegisterSchoolPage navigate={navigate} />;
    }

    if (safeRoute.startsWith('/school-registration/') && safeRoute.endsWith('/payment')) {
      const parts = safeRoute.split('/');
      const registrationId = parts[2];
      return <SchoolPaymentCheckoutPage registrationId={registrationId} navigate={navigate} />;
    }

    if (route === '/school-lookup') {
      return renderAuthLayout(<SchoolLookupPage navigate={navigate} />);
    }

    if (route === '/forgot-password' || route === '/auth/forgot-password') {
      return renderAuthLayout(<ForgotPasswordPage navigate={navigate} />);
    }

    if (route === '/reset-password' || route === '/auth/reset-password') {
      return renderAuthLayout(<ResetPasswordPage navigate={navigate} />);
    }

    if (route === '/login-help' || route === '/auth/login-help') {
      return renderAuthLayout(<LoginHelpPage navigate={navigate} />);
    }

    if (route === '/ai' || route === '/ai-features') {
      return <AIFeaturesPage navigate={navigate} />;
    }

    if (route === '/pricing') {
      return <PricingPage navigate={navigate} />;
    }

    if (route === '/docs') {
      return <DocumentationPage navigate={navigate} />;
    }

    if (route === '/contact') {
      return <ContactPage navigate={navigate} />;
    }

    if (route === '/features') {
      return <FeaturesPage navigate={navigate} />;
    }

    if (route === '/intelligence') {
      return <IntelligencePage navigate={navigate} />;
    }

    if (route === '/security') {
      return <SecurityPage navigate={navigate} />;
    }

    if (route === '/demo') {
      return <DemoPage navigate={navigate} />;
    }

    if (route === '/help') {
      return <HelpCenterPage navigate={navigate} />;
    }

    if (route === '/community') {
      return <CommunityPage navigate={navigate} />;
    }

    if (route === '/status') {
      return <StatusPage navigate={navigate} />;
    }

    if (route === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (route === '/privacy') {
      return <PrivacyPolicyPage navigate={navigate} />;
    }

    if (route === '/terms') {
      return <TermsOfServicePage navigate={navigate} />;
    }

    if (currentView === 'login' || !isAuthenticated) {
      return (
        <LoginPage 
          onBack={() => navigate('/')} 
          onLoginSuccess={(role) => {
            navigate('/app');
          }}
          onNavigate={navigate}
        />
      );
    }

    // Dynamic, secure multi-role enterprise workspace!
    return (
      <RoleWorkspace
        language={language}
        onSelectLanguage={setLanguage}
        currentTenant={currentTenant}
        onSelectTenant={setCurrentTenant}
      />
    );
  };

  return (
    <HelmetProvider>
      <ThemeProvider>
        <I18nProvider>
          <SEO />
          <RoleRouter
            route={route}
            navigate={navigate}
            language={language}
            onSelectLanguage={setLanguage}
            currentTenant={currentTenant}
            onSelectTenant={setCurrentTenant}
          >
            <Suspense fallback={<LoadingSkeleton />}>
              {renderAppBody()}
            </Suspense>
            <CommandPalette />
          </RoleRouter>
        </I18nProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}


