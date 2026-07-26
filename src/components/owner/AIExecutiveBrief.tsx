import React, { useState } from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, Users, GraduationCap, CheckCircle2, ChevronRight, Sparkles, RefreshCcw } from 'lucide-react';

interface AIExecutiveBriefProps {
  onNavigate: (path: string) => void;
  stats?: any;
}

export const AIExecutiveBrief: React.FC<AIExecutiveBriefProps> = ({ onNavigate, stats }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const event = new CustomEvent('galaxy-toast', { detail: { text: 'AI Insights Refreshed', type: 'success' }});
      window.dispatchEvent(event);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden h-full flex flex-col transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      {/* Siri/Apple Intelligence ambient subtle glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-200/30 via-pink-100/20 to-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-wide flex items-center gap-1.5">
              Galaxy Intelligence
              <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-slate-100 text-slate-500 font-extrabold uppercase tracking-widest border border-slate-200/50">Live</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Autonomous Agent Brief</p>
          </div>
        </div>
        <button onClick={handleRefresh} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/40 transition-colors cursor-pointer">
           <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
        </button>
      </div>

      <div className="space-y-3 flex-1 relative z-10">
        <div className="flex items-start gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200/60 transition-all cursor-pointer" onClick={() => onNavigate('attendance')}>
          <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed">Average attendance is currently at <span className="text-emerald-600 font-bold">{stats?.avgAttendance || 0}%</span>.</p>
        </div>
        
        <div className="flex items-start gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200/60 transition-all cursor-pointer" onClick={() => onNavigate('fees')}>
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed">Total fees collected: <span className="text-amber-600 font-bold">₹{(stats?.feesCollected || 0).toLocaleString()}</span>.</p>
        </div>

        <div className="flex items-start gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200/60 transition-all cursor-pointer" onClick={() => onNavigate('students')}>
          <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed"><span className="text-blue-600 font-bold">{stats?.totalStudents || 0}</span> active students enrolled across the system.</p>
        </div>

        <div className="flex items-start gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100 hover:bg-slate-100/50 hover:border-slate-200/60 transition-all cursor-pointer" onClick={() => onNavigate('hr')}>
          <GraduationCap className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed">Managing <span className="text-purple-600 font-bold">{stats?.activeStaff || 0}</span> staff members.</p>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-slate-100 relative z-10">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          Recommended Action
        </h4>
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-4">
          Review fee follow-up communications for pending accounts and schedule a meeting with the transport manager regarding route optimizations.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            Generate Report
          </button>
          <button 
             onClick={() => {
               const event = new CustomEvent('galaxy-toast', { detail: { text: 'Opening AI Chat Assistant...', type: 'info' }});
               window.dispatchEvent(event);
             }}
             className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
          >
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
};
