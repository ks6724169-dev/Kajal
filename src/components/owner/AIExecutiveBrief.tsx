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
    <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl relative overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Siri/Apple Intelligence ambient subtle glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/30 transition-colors" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
              Galaxy Intelligence
              <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-white/10 text-slate-300 font-extrabold uppercase tracking-widest border border-white/10">Live</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Autonomous Agent Brief</p>
          </div>
        </div>
        <button onClick={handleRefresh} className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors cursor-pointer">
           <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>

      <div className="space-y-3 flex-1 relative z-10">
        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => onNavigate('attendance')}>
          <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-300 font-medium leading-relaxed">Average attendance is currently at <span className="text-emerald-400 font-bold">{stats?.avgAttendance || 0}%</span>.</p>
        </div>
        
        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => onNavigate('fees')}>
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-300 font-medium leading-relaxed">Total fees collected: <span className="text-amber-400 font-bold">₹{(stats?.feesCollected || 0).toLocaleString()}</span>.</p>
        </div>

        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => onNavigate('students')}>
          <Users className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-300 font-medium leading-relaxed"><span className="text-blue-400 font-bold">{stats?.totalStudents || 0}</span> active students enrolled across the system.</p>
        </div>

        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => onNavigate('hr')}>
          <GraduationCap className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-300 font-medium leading-relaxed">Managing <span className="text-purple-400 font-bold">{stats?.activeStaff || 0}</span> staff members.</p>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-white/10 relative z-10">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          Recommended Action
        </h4>
        <p className="text-[11px] text-slate-300 leading-relaxed font-medium mb-4">
          Review fee follow-up communications for pending accounts and schedule a meeting with the transport manager regarding route optimizations.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            Generate Report
          </button>
          <button 
             onClick={() => {
               const event = new CustomEvent('galaxy-toast', { detail: { text: 'Opening AI Chat Assistant...', type: 'info' }});
               window.dispatchEvent(event);
             }}
             className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold rounded-lg border border-white/10 transition-all cursor-pointer"
          >
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
};
