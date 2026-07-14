import React, { useState } from 'react';
import { Tenant, Role } from './types';
import { TENANTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
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
        onOpenMobileApp={() => setActiveTab('mobile_apps')}
        onOpenSettings={() => setActiveTab('settings')}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

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


