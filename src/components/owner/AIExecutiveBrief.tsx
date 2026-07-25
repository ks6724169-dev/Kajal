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
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl border border-indigo-800 p-6 text-white shadow-lg relative overflow-hidden h-full flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <BrainCircuit className="w-48 h-48" />
      </div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Galaxy AI Executive Brief
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/30 text-indigo-200 font-semibold uppercase tracking-wider border border-indigo-500/30">Live</span>
            </h2>
            <p className="text-xs text-indigo-200/70">Today's Intelligence & Insights</p>
          </div>
        </div>
        <button onClick={handleRefresh} className="p-2 text-indigo-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer">
           <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4 flex-1 relative z-10">
        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer" onClick={() => onNavigate('attendance')}>
          <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-200 leading-snug">Average attendance is currently at <span className="text-green-400 font-bold">{stats?.avgAttendance || 0}%</span>.</p>
        </div>
        
        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer" onClick={() => onNavigate('fees')}>
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-200 leading-snug">Total fees collected: <span className="text-amber-400 font-bold">₹{(stats?.feesCollected || 0).toLocaleString()}</span>.</p>
        </div>

        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer" onClick={() => onNavigate('students')}>
          <Users className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-200 leading-snug"><span className="text-blue-400 font-bold">{stats?.totalStudents || 0}</span> active students enrolled across the system.</p>
        </div>

        <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer" onClick={() => onNavigate('hr')}>
          <GraduationCap className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-200 leading-snug">Managing <span className="text-purple-400 font-bold">{stats?.activeStaff || 0}</span> staff members.</p>
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-white/10 relative z-10">
        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Recommended Action
        </h4>
        <p className="text-sm text-slate-300 mb-4 leading-snug">
          Review fee follow-up communications for pending accounts and schedule a meeting with the transport manager regarding route optimizations.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded shadow-sm transition cursor-pointer"
          >
            Generate Report
          </button>
          <button 
             onClick={() => {
               const event = new CustomEvent('galaxy-toast', { detail: { text: 'Opening AI Chat Assistant...', type: 'info' }});
               window.dispatchEvent(event);
             }}
             className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded border border-white/20 transition cursor-pointer"
          >
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
};
