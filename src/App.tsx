import React, { useState } from 'react';
import { Tenant, Role } from './types/index';
import { TENANTS } from './constants/mockData';
import { Navbar } from './layouts/Navbar';
import { Dashboard } from './modules/super-admin/Dashboard';
import { AiHub } from './modules/super-admin/AiHub';
import { StudentsPortal } from './modules/super-admin/StudentsPortal';
import { FeeManagement } from './modules/super-admin/FeeManagement';
import { AttendancePortal } from './modules/super-admin/AttendancePortal';
import { TransportPortal } from './modules/super-admin/TransportPortal';
import { ExaminationPortal } from './modules/super-admin/ExaminationPortal';
import { HrmsPayroll } from './modules/super-admin/HrmsPayroll';
import { InventoryLibraryHostel } from './modules/super-admin/InventoryLibraryHostel';
import { CctvSecurity } from './modules/super-admin/CctvSecurity';
import { MobileAppSimulator } from './modules/super-admin/MobileAppSimulator';
import { SettingsModal } from './modules/super-admin/SettingsModal';
import { LandingPage } from './features/LandingPage';
import { LoginPage } from './features/LoginPage';
import { TeacherPanel } from './modules/teacher/TeacherPanel';
import { SchoolRegistrationModal } from './features/SchoolRegistrationModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>('landing');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(TENANTS[0]);
  const [currentRole, setCurrentRole] = useState<Role>('super_admin');
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('dashboard');

  if (currentView === 'landing') {
    return (
      <div className="relative">
        <LandingPage 
          onLogin={() => setCurrentView('login')} 
          onOpenTeacherPanel={() => {
            setCurrentRole('teacher');
            setCurrentView('app');
          }}
          onOpenRegistration={() => setIsRegistrationOpen(true)}
        />
        {isRegistrationOpen && (
          <SchoolRegistrationModal 
            onClose={() => setIsRegistrationOpen(false)}
            onSuccess={(data) => {
              setIsRegistrationOpen(false);
              setCurrentView('app');
            }}
          />
        )}
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <LoginPage 
        onBack={() => setCurrentView('landing')} 
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          setCurrentView('app');
        }}
      />
    );
  }

  if (currentRole === 'teacher') {
    return <TeacherPanel onLogout={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <Navbar
        currentTenant={currentTenant}
        onSelectTenant={setCurrentTenant}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        language={language}
        onSelectLanguage={setLanguage}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMobileApp={() => setActiveTab('mobile_apps')}
        onOpenSettings={() => setActiveTab('settings')}
      />

      <div className="flex flex-1">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
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
        </main>
      </div>
    </div>
  );
}


