import React from 'react';
import { 
  StudentKPIWidgets, AlertsAndTargetWidgets, RecentAdmissionAndActivityWidgets 
} from '../../components/student/StudentWidgets';
import { useStudents } from '../../hooks/useStudents';
import { Sparkles, Brain, LayoutDashboard } from 'lucide-react';

interface StudentDashboardProps {
  onSelectTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onSelectTab }) => {
  const { students } = useStudents();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-indigo-500/30">
              Operational Academic Cockpit
            </span>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">Enterprise Student Experience Platform</h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Monitor attendance telemetry, conduct behavioral audits, evaluate auto-promotions, and leverage Gemini AI to detect weak/gifted segments.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0 bg-slate-950/40 border border-slate-800 p-3 rounded-2xl">
            <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div className="text-left">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Gemini Agent Engine</span>
              <span className="text-[10px] font-black text-indigo-300 block">AI Insights Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Widgets */}
      <StudentKPIWidgets students={students} onSelectTab={onSelectTab} />

      {/* Alerts and Target Segmentation */}
      <AlertsAndTargetWidgets students={students} onSelectTab={onSelectTab} />

      {/* Recents */}
      <RecentAdmissionAndActivityWidgets students={students} />
    </div>
  );
};
