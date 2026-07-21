import React, { useState, useEffect } from 'react';
import { Role, Tenant } from '../../types';
import { SearchBar } from '../../components/dashboard/SearchBar';
import { WidgetContainer } from '../../components/dashboard/WidgetContainer';
import { WorkspaceLayout } from './WorkspaceLayout';
import { DashboardGrid } from './DashboardGrid';
import { useStore } from '../../stores/StoreContext';
import { Sparkles, GraduationCap, School, Info, User } from 'lucide-react';

interface DashboardHomeProps {
  tenant: Tenant;
  onNavigate: (tabId: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ tenant, onNavigate }) => {
  const { user } = useStore();
  
  // Safe role resolution falling back to active user store or general super_admin
  const activeRole: Role = user?.role || 'super_admin';
  const activeName = user?.name || 'Dr. Rajesh Sharma';

  // Map of default widgets per role
  const getDefaultWidgetsForRole = (r: Role): string[] => {
    switch (r) {
      case 'super_admin':
      case 'organization_owner':
        return ['kpi', 'revenue', 'distribution', 'ai_insights', 'recent_activity', 'weather', 'favorites'];
      case 'school_admin':
      case 'principal':
        return ['kpi', 'attendance', 'distribution', 'ai_insights', 'recent_activity', 'notifications', 'timetable'];
      case 'teacher':
        return ['kpi', 'attendance', 'performance', 'ai_insights', 'notifications', 'timetable'];
      case 'student':
        return ['kpi', 'performance', 'ai_insights', 'timetable', 'favorites', 'weather'];
      case 'parent':
        return ['kpi', 'performance', 'ai_insights', 'timetable', 'favorites', 'weather'];
      case 'librarian':
        return ['kpi', 'recent_activity', 'notifications', 'favorites'];
      case 'accountant':
        return ['kpi', 'revenue', 'ai_insights', 'notifications', 'favorites'];
      default:
        return ['kpi', 'ai_insights', 'notifications', 'weather'];
    }
  };

  const defaultWidgets = getDefaultWidgetsForRole(activeRole);
  
  // Custom states that can be toggled by the settings panel
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(defaultWidgets);
  const [accentColor, setAccentColor] = useState<string>('indigo');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Sync widgets list if the user changes roles
  useEffect(() => {
    setVisibleWidgets(getDefaultWidgetsForRole(activeRole));
  }, [activeRole]);

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayRoleLabel = (r: Role): string => {
    return r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <WorkspaceLayout
      accentColor={accentColor}
      density={density}
      fontSize={fontSize}
    >
      <div className="space-y-6">
        
        {/* Top Header Row with Universal Search & Customizer Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-3xl shadow-xs">
          <div className="w-full md:w-auto flex-1 max-w-xl">
            <SearchBar />
          </div>
          <div className="shrink-0">
            <WidgetContainer
              role={activeRole}
              visibleWidgets={visibleWidgets}
              setVisibleWidgets={setVisibleWidgets}
              defaultWidgets={defaultWidgets}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              density={density}
              setDensity={setDensity}
              fontSize={fontSize}
              setFontSize={setFontSize}
            />
          </div>
        </div>

        {/* Dynamic High-Contrast Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{tenant.logo}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {tenant.name} ({tenant.academicYear})
                </span>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-none">
                {getGreeting()}, <span className="text-indigo-400 select-all">{activeName}</span>!
              </h1>
              <p className="text-slate-400 text-xs font-medium max-w-2xl leading-normal">
                Logged in as <strong className="text-slate-200">{displayRoleLabel(activeRole)}</strong>. Welcome to your personalized ERP hub. Review custom metric modules, AI-first analytics, and GPS transit logs curated specifically for you.
              </p>
            </div>
            
            <button
              onClick={() => onNavigate('ai_hub')}
              className="bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold px-4.5 py-3 rounded-2xl text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 shrink-0 select-none border border-indigo-400/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-pulse text-indigo-100" />
              <span>Launch Gemini Copilot</span>
            </button>
          </div>
        </div>

        {/* Reorderable Widget Grid system */}
        <DashboardGrid
          role={activeRole}
          tenant={tenant}
          visibleWidgets={visibleWidgets}
          setVisibleWidgets={setVisibleWidgets}
          density={density}
          onNavigate={onNavigate}
        />

      </div>
    </WorkspaceLayout>
  );
};
export default DashboardHome;
