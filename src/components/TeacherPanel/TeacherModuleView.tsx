import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Info, FileBadge, Briefcase, FileSignature, Calendar, Bell, ListTodo, CalendarDays, Zap, Folder, Star, Bot, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { teacherModules } from './modulesData';
import { SubModuleRenderer } from './SubModuleRenderer';
import { StudentLifecycleDashboard } from './StudentLifecycle/StudentLifecycleDashboard';

interface TeacherModuleViewProps {
  moduleId: string;
  onBack: () => void;
  onLogout: () => void;
  initialSubModule?: string | null;
}

const subModuleIcons: Record<string, any> = {
  profile: User,
  teacher_info: Info,
  qualifications: FileBadge,
  experience: Briefcase,
  digital_signature: FileSignature,
  calendar: Calendar,
  notifications: Bell,
  tasks: ListTodo,
  timetable: CalendarDays,
  quick_actions: Zap,
  documents: Folder,
  favorites: Star,
  ai_workspace: Bot,
  logout: LogOut,
};

export const TeacherModuleView: React.FC<TeacherModuleViewProps> = ({ moduleId, onBack, onLogout, initialSubModule = null }) => {
  const moduleData = teacherModules.find(m => m.id === moduleId);
  const [activeSubModule, setActiveSubModule] = useState<string | null>(initialSubModule);
  const [isNavOpen, setIsNavOpen] = useState(false);

  if (!moduleData) return null;
  const Icon = moduleData.icon;

  const handleBack = () => {
    if (activeSubModule) {
      setActiveSubModule(null);
    } else {
      onBack();
    }
  };

  const handleSubModuleClick = (subId: string) => {
    if (subId === 'logout') {
      onLogout();
      return;
    }
    setActiveSubModule(subId);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <AnimatePresence mode="wait">
        {!activeSubModule ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col w-full h-full"
          >
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleBack}
                    className="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${moduleData.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-tight">
                      {moduleData.title}
                    </h1>
                    <p className="text-xs text-slate-500">{moduleData.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-8 items-center">
              
              {/* Navigation Dropdown */}
              <div className="w-full max-w-2xl flex-shrink-0 relative z-20">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <button 
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 hover:text-slate-600 transition-colors"
                  >
                    <span>Navigation</span>
                    {isNavOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {isNavOpen && (
                    <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {moduleData.subModules.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubModuleClick(sub.id)}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 group"
                        >
                          <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                            {React.createElement(subModuleIcons[sub.id] || Folder, { className: "w-3.5 h-3.5" })}
                          </div>
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Welcome Section or Student Lifecycle Dashboard */}
              <div className="flex-1 min-w-0 w-full relative z-10">
                {moduleId === 'student_lifecycle' ? (
                  <StudentLifecycleDashboard onSelectSubModule={(subId) => handleSubModuleClick(subId)} />
                ) : (
                  <div className={`bg-gradient-to-br ${moduleData.color} rounded-3xl p-8 sm:p-12 shadow-2xl min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden text-white`}>
                  {/* Background Decorative element */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white opacity-20 blur-3xl mix-blend-overlay"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-yellow-300 opacity-20 blur-3xl mix-blend-overlay"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50"></div>
                  
                  <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-inner border border-white/30 relative z-10">
                    <Icon className="w-12 h-12 text-white drop-shadow-md" />
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md relative z-10">
                    Welcome to {moduleData.title}
                  </h2>
                  
                  <blockquote className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed font-serif italic drop-shadow-sm relative z-10">
                    "The art of teaching is the art of assisting discovery."
                  </blockquote>

                  <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-10 relative z-10">
                    Manage your {moduleData.title.toLowerCase()} operations efficiently from this centralized workspace. Select any option from the navigation menu above to get started.
                  </p>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-3xl w-full text-left relative z-10 shadow-xl">
                    <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4 border-b border-white/20 pb-3">Available Features in this Module</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      {moduleData.subModules.map(sub => (
                        <div key={sub.id} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white drop-shadow-sm">{sub.name}</h4>
                            <p className="text-xs text-white/70 mt-0.5">Access and manage {sub.name.toLowerCase()} records.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="submodule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 w-full"
          >
            <SubModuleRenderer 
              subModuleId={activeSubModule} 
              subModuleName={moduleData.subModules.find(s => s.id === activeSubModule)?.name || ''}
              onBack={handleBack} 
              onSelectSubModule={handleSubModuleClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

