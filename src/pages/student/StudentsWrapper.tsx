import React, { useState } from 'react';
import { ComingSoonModule } from '../../components/common/ComingSoonModule';
import { 
  LayoutDashboard, Users, User, UserPlus, Calendar, BookOpen, 
  Smile, ShieldAlert, Brain, Heart, Briefcase, TrendingUp, 
  AlertTriangle, Sparkles, GraduationCap, Clock, Home, Award, Files, Shield 
} from 'lucide-react';

type SubView = 
  | 'dashboard' | 'list' | 'profile' | 'admission' | 'attendance' 
  | 'period' | 'behaviour' | 'discipline' | 'counselling' | 'health' 
  | 'portfolio' | 'progress' | 'weak' | 'gifted' | 'promotion' 
  | 'activities' | 'house' | 'club' | 'documents' | 'parent';

export const StudentsWrapper: React.FC = () => {
  const [subView, setSubView] = useState<SubView>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Suite Dashboard', icon: LayoutDashboard, category: 'Main' },
    { id: 'list', label: 'Student Directory', icon: Users, category: 'Main' },
    { id: 'profile', label: 'Detailed Profile', icon: User, category: 'Main' },
    { id: 'admission', label: 'Admissions Desk', icon: UserPlus, category: 'Main' },

    { id: 'attendance', label: 'Daily Attendance', icon: Calendar, category: 'Attendance' },
    { id: 'period', label: 'Period Attendance', icon: BookOpen, category: 'Attendance' },

    { id: 'behaviour', label: 'Conduct Logger', icon: Smile, category: 'Discipline & Care' },
    { id: 'discipline', label: 'Discipline Logs', icon: ShieldAlert, category: 'Discipline & Care' },
    { id: 'counselling', label: 'Counsellor Portal', icon: Brain, category: 'Discipline & Care' },
    { id: 'health', label: 'Clinical Health', icon: Heart, category: 'Discipline & Care' },

    { id: 'portfolio', label: 'Portfolio Locker', icon: Briefcase, category: 'Academics & Talent' },
    { id: 'progress', label: 'GPA Progress Chart', icon: TrendingUp, category: 'Academics & Talent' },
    { id: 'weak', label: 'Remedial Radar', icon: AlertTriangle, category: 'Academics & Talent' },
    { id: 'gifted', label: 'Gifted Pool', icon: Sparkles, category: 'Academics & Talent' },
    { id: 'promotion', label: 'Auto-Promotion', icon: GraduationCap, category: 'Academics & Talent' },

    { id: 'activities', label: 'Campus Activities', icon: Clock, category: 'Organization & Records' },
    { id: 'house', label: 'House Management', icon: Home, category: 'Organization & Records' },
    { id: 'club', label: 'Club Management', icon: Award, category: 'Organization & Records' },
    { id: 'documents', label: 'Document Locker', icon: Files, category: 'Organization & Records' },
    { id: 'parent', label: 'Guardian Index', icon: Shield, category: 'Organization & Records' }
  ] as const;

  const categories = ['Main', 'Attendance', 'Discipline & Care', 'Academics & Talent', 'Organization & Records'] as const;

  const activeItem = menuItems.find(item => item.id === subView);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-100 dark:bg-slate-950">
      {/* Sleek Sub-navigation Drawer Sidebar */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 shrink-0 p-4 lg:p-5 overflow-y-auto max-h-screen lg:sticky lg:top-16">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">Enterprise Module</span>
          <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5 uppercase">ESMXP Suite</h2>
        </div>

        <nav className="space-y-5 mt-4">
          {categories.map(cat => (
            <div key={cat} className="space-y-1.5">
              <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-2.5">{cat}</span>
              <div className="space-y-0.5">
                {menuItems.filter(item => item.category === cat).map(item => {
                  const Icon = item.icon;
                  const active = subView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSubView(item.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center space-x-2.5 cursor-pointer ${
                        active 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Primary Workspace Stage Panel - Clean Coming Soon with Demo Data Purged */}
      <main className="flex-1 p-5 md:p-6 overflow-y-auto flex items-center justify-center">
        <ComingSoonModule 
          title={activeItem ? activeItem.label : "Enterprise Student Experience Platform"}
          subtitle={`The ${activeItem?.label || 'Student Experience'} module is undergoing backend database integration. All hardcoded demo data has been purged.`}
          category={`ESMXP Suite • ${activeItem?.category || 'Student Domain'}`}
          features={[
            "Live Student Directory Sync",
            "Biometric Attendance Telemetry",
            "Guardian & Parent Index Integration",
            "Discipline & Conduct Audit Logs",
            "Automated Promotion & Report Cards"
          ]}
        />
      </main>
    </div>
  );
};
