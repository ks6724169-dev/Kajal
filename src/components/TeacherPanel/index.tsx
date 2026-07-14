import React, { useState } from 'react';
import { TeacherHeader } from './TeacherHeader';
import { TeacherDashboard } from './TeacherDashboard';
import { TeacherModuleView } from './TeacherModuleView';
import { GalaxyAIChat } from './GalaxyAIChat';

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 h-screen overflow-hidden">
      {(!currentModuleId && !isAiChatOpen) && (
        <TeacherHeader 
          onLogout={onLogout} 
          onNavigateHome={handleNavigateHome} 
          onAiClick={() => setIsAiChatOpen(true)}
          onOpenProfile={handleOpenProfile}
          onOpenNotifications={handleOpenNotifications}
        />
      )}
      
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
