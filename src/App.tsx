import React, { useEffect, useState } from 'react';
import { Tenant, Role } from './types';
import { TENANTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AiHub } from './components/AiHub';
import { StudentsPortal } from './components/StudentsPortal';
import { FeeManagement } from './components/FeeManagement';
import { AttendancePortal } from './components/AttendancePortal';
import { TransportPortal } from './components/TransportPortal';
import { ExaminationPortal } from './components/ExaminationPortal';
import { HrmsPayroll } from './components/HrmsPayroll';
import { InventoryLibraryHostel } from './components/InventoryLibraryHostel';
import { CctvSecurity } from './components/CctvSecurity';
import { MobileAppSimulator } from './components/MobileAppSimulator';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { TeacherPanel } from './components/TeacherPanel';
import { SchoolRegistrationModal } from './components/SchoolRegistrationModal';
import { EnterpriseShell } from './app/layouts/EnterpriseShell';
import { AppModuleId, DEFAULT_MODULE_ID } from './app/navigation/modules';
import { useAuth } from './core/auth';
import { ProtectedRoute } from './app/routing/ProtectedRoute';
import { LoadingScreen } from './components/auth/LoadingScreen';
import { UnauthorizedPage } from './components/auth/UnauthorizedPage';
import { NotFoundPage } from './components/auth/NotFoundPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { EmailVerificationPage } from './components/auth/EmailVerificationPage';

export default function App() {
  const auth = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>(() => window.location.pathname === '/login' ? 'login' : window.location.pathname === '/app' ? 'app' : 'landing');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(TENANTS[0]);
  const [currentRole, setCurrentRole] = useState<Role>('super_admin');
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState<AppModuleId>(DEFAULT_MODULE_ID);
  const [routePath, setRoutePath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setRoutePath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated && auth.role) {
      setCurrentRole(auth.role);
      if (auth.tenant) setCurrentTenant(auth.tenant);
      if (currentView === 'login') setCurrentView('app');
    }
  }, [auth.isAuthenticated, auth.role, auth.tenant, currentView]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoutePath(path);
  };

  const handleLogout = async () => {
    await auth.logout();
    setCurrentView('landing');
    setActiveTab(DEFAULT_MODULE_ID);
    navigate('/');
  };

  if (auth.status === 'loading') return <LoadingScreen message="Preparing secure ERP workspace..." />;

  if (routePath === '/reset-password') {
    return <ResetPasswordPage onComplete={() => { setCurrentView('login'); navigate('/login'); }} />;
  }

  if (routePath === '/verify-email') {
    return <EmailVerificationPage onContinue={() => { setCurrentView(auth.isAuthenticated ? 'app' : 'login'); navigate(auth.isAuthenticated ? '/app' : '/login'); }} />;
  }

  if (routePath === '/unauthorized') {
    return <UnauthorizedPage onBack={() => navigate('/')} />;
  }

  const knownRoutes = ['/', '/login', '/app', '/reset-password', '/verify-email', '/unauthorized'];
  if (!knownRoutes.includes(routePath)) {
    return <NotFoundPage onHome={() => { setCurrentView('landing'); navigate('/'); }} />;
  }

  if (currentView === 'landing') {
    return (
      <div className="relative">
        <LandingPage
          onLogin={() => { setCurrentView('login'); navigate('/login'); }}
          onOpenTeacherPanel={() => {
            setCurrentRole('teacher');
            setCurrentView('login');
            navigate('/login');
          }}
          onOpenRegistration={() => setIsRegistrationOpen(true)}
        />
        {isRegistrationOpen && (
          <SchoolRegistrationModal
            onClose={() => setIsRegistrationOpen(false)}
            onSuccess={() => {
              setIsRegistrationOpen(false);
              setCurrentRole('super_admin');
              setCurrentView('login');
              navigate('/login');
            }}
          />
        )}
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <LoginPage
        onBack={() => { setCurrentView('landing'); navigate('/'); }}
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          setCurrentView('app');
          navigate('/app');
        }}
      />
    );
  }

  if (currentRole === 'teacher') {
    return <ProtectedRoute><TeacherPanel onLogout={handleLogout} /></ProtectedRoute>;
  }

  return (
    <EnterpriseShell
      currentTenant={currentTenant}
      onSelectTenant={setCurrentTenant}
      currentRole={currentRole}
      onSelectRole={setCurrentRole}
      language={language}
      onSelectLanguage={setLanguage}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onLogout={handleLogout}
    >
      <ProtectedRoute moduleId={activeTab}>
      {activeTab === 'dashboard' && <Dashboard tenant={currentTenant} onNavigate={setActiveTab} />}
      {activeTab === 'ai_hub' && <AiHub />}
      {activeTab === 'students' && <StudentsPortal />}
      {activeTab === 'fees' && <FeeManagement />}
      {activeTab === 'attendance' && <AttendancePortal />}
      {activeTab === 'transport' && <TransportPortal />}
      {activeTab === 'exams' && <ExaminationPortal />}
      {activeTab === 'hrms' && <HrmsPayroll />}
      {activeTab === 'library' && <InventoryLibraryHostel />}
      {activeTab === 'cctv' && <CctvSecurity />}
      {activeTab === 'mobile_apps' && <MobileAppSimulator />}
      {activeTab === 'settings' && <SettingsModal tenant={currentTenant} />}
      </ProtectedRoute>
    </EnterpriseShell>
  );
}


