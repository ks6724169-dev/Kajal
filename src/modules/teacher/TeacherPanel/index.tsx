import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TeacherHeader } from './TeacherHeader';
import { TeacherDashboard } from './TeacherDashboard';
import { TeacherModuleView } from './TeacherModuleView';
import { GalaxyAIChat } from './GalaxyAIChat';
import { teacherModules } from './modulesData';

interface TeacherPanelProps {
  onLogout: () => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ onLogout }) => {
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [initialSubModule, setInitialSubModule] = useState<string | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const handleNavigateHome = () => {
    setCurrentModuleId(null);
    setInitialSubModule(null);
    setIsAiChatOpen(false);
  };

  const handleOpenProfile = () => {
    setCurrentModuleId('workspace');
    setInitialSubModule('profile');
    setIsAiChatOpen(false);
  };

  const handleOpenNotifications = () => {
    setCurrentModuleId('workspace');
    setInitialSubModule('notifications');
    setIsAiChatOpen(false);
  };

  const activeModule = teacherModules.find(m => m.id === currentModuleId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 h-screen overflow-hidden">
      {/* Persistent Top Header with built-in Module Launcher */}
      <TeacherHeader 
        onLogout={onLogout} 
        onNavigateHome={handleNavigateHome} 
        onAiClick={() => setIsAiChatOpen(true)}
        onOpenProfile={handleOpenProfile}
        onOpenNotifications={handleOpenNotifications}
        currentModuleId={currentModuleId}
        onSelectModule={(id) => {
          setCurrentModuleId(id);
          setInitialSubModule(null);
          setIsAiChatOpen(false);
        }}
      />

      {/* Global Breadcrumb Navigation & Back Button bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5">
          { (currentModuleId || isAiChatOpen) && (
            <button 
              onClick={handleNavigateHome}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition mr-2 pr-2 border-r border-slate-200 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}
          <span className="hover:text-slate-800 cursor-pointer" onClick={handleNavigateHome}>Galaxy ERP</span>
          <span className="text-slate-300">/</span>
          {isAiChatOpen ? (
            <span className="text-slate-800 font-bold">Galaxy AI Copilot</span>
          ) : activeModule ? (
            <>
              <span className="hover:text-slate-800 cursor-pointer" onClick={handleNavigateHome}>{activeModule.title}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-bold">Workspace Area</span>
            </>
          ) : (
            <span className="text-slate-800 font-bold">Dashboard & Summary</span>
          )}
        </div>
        <div className="text-[10px] text-slate-400 hidden sm:block">
          Enterprise ERP System • Delhi Public School
        </div>
      </div>
      
      {/* Workspace Area: Everything opens inside this container */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {isAiChatOpen ? (
          <GalaxyAIChat 
            onBack={() => setIsAiChatOpen(false)} 
            onOpenProfile={handleOpenProfile} 
          />
        ) : currentModuleId ? (
          <TeacherModuleView 
            moduleId={currentModuleId} 
            onBack={handleNavigateHome} 
            onLogout={onLogout}
            initialSubModule={initialSubModule}
          />
        ) : (
          <TeacherDashboard onSelectModule={(id) => { setCurrentModuleId(id); setInitialSubModule(null); }} />
        )}
      </main>
    </div>
  );
};
