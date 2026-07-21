import React from 'react';
import { WorkspaceConfig } from '../../store/workspaceStore';
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

interface WorkspaceHeaderProps {
  workspace: WorkspaceConfig | null;
  language?: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ 
  workspace, 
  language = 'en' 
}) => {
  if (!workspace) return null;

  // Adapt tailwind classes based on config color
  const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    indigo: {
      border: 'border-indigo-100',
      bg: 'from-indigo-50/80 via-blue-50/20 to-transparent',
      text: 'text-indigo-600',
      badge: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700'
    },
    blue: {
      border: 'border-blue-100',
      bg: 'from-blue-50/80 via-indigo-50/20 to-transparent',
      text: 'text-blue-600',
      badge: 'bg-blue-500/10 border-blue-500/20 text-blue-700'
    },
    emerald: {
      border: 'border-emerald-100',
      bg: 'from-emerald-50/80 via-teal-50/20 to-transparent',
      text: 'text-emerald-600',
      badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700'
    },
    violet: {
      border: 'border-purple-100',
      bg: 'from-purple-50/80 via-pink-50/20 to-transparent',
      text: 'text-purple-600',
      badge: 'bg-purple-500/10 border-purple-500/20 text-purple-700'
    },
    amber: {
      border: 'border-amber-100',
      bg: 'from-amber-50/80 via-yellow-50/20 to-transparent',
      text: 'text-amber-600',
      badge: 'bg-amber-500/10 border-amber-500/20 text-amber-700'
    },
    teal: {
      border: 'border-teal-100',
      bg: 'from-teal-50/80 via-emerald-50/20 to-transparent',
      text: 'text-teal-600',
      badge: 'bg-teal-500/10 border-teal-500/20 text-teal-700'
    },
    orange: {
      border: 'border-orange-100',
      bg: 'from-orange-50/80 via-red-50/20 to-transparent',
      text: 'text-orange-600',
      badge: 'bg-orange-500/10 border-orange-500/20 text-orange-700'
    },
    cyan: {
      border: 'border-cyan-100',
      bg: 'from-cyan-50/80 via-teal-50/20 to-transparent',
      text: 'text-cyan-600',
      badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700'
    },
    sky: {
      border: 'border-sky-100',
      bg: 'from-sky-50/80 via-blue-50/20 to-transparent',
      text: 'text-sky-600',
      badge: 'bg-sky-500/10 border-sky-500/20 text-sky-700'
    },
    slate: {
      border: 'border-slate-200',
      bg: 'from-slate-55/80 via-slate-50/20 to-transparent',
      text: 'text-slate-600',
      badge: 'bg-slate-500/10 border-slate-500/20 text-slate-700'
    }
  };

  const currentTheme = colorMap[workspace.color] || colorMap.indigo;

  return (
    <div 
      id="workspace-greeting-panel"
      className={`border border-slate-200 rounded-3xl p-6 md:p-8 bg-gradient-to-r ${currentTheme.bg} shadow-xs space-y-6 relative overflow-hidden`}
    >
      <div className="absolute top-[-30%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-indigo-50/20 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
        
        {/* Core Description Title */}
        <div className="flex items-start gap-4">
          <span className="text-4xl p-3.5 bg-white border border-slate-200 rounded-2.5xl shadow-xs flex items-center justify-center shrink-0">
            {workspace.logo}
          </span>
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                {workspace.title}
              </h2>
              <span className={`text-[9px] border px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${currentTheme.badge}`}>
                {workspace.role.replace('_', ' ')} WORKSPACE
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {workspace.subtitle}
            </p>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed pt-1.5">
              {workspace.description}
            </p>
          </div>
        </div>

        {/* AI Integration Highlight */}
        <div className="hidden lg:flex items-center gap-2.5 px-4.5 py-3 bg-white/80 border border-slate-200 rounded-2xl shadow-xs shrink-0 backdrop-blur-xs select-none">
          <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-pulse shrink-0" />
          <div className="text-left">
            <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest block">Galaxy AI Agent</span>
            <span className="text-xs font-bold text-slate-700">Insights Ready</span>
          </div>
        </div>

      </div>

      {/* Grid of Dynamic Workspace Stats */}
      {workspace.stats && workspace.stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {workspace.stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white/95 border border-slate-200/90 rounded-2xl p-4.5 shadow-xs flex flex-col justify-between text-left space-y-1.5 transition hover:shadow-md hover:border-slate-300"
            >
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {stat.label}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-lg md:text-xl font-extrabold text-slate-900 leading-none">
                  {stat.value}
                </span>
                
                {stat.change && (
                  <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    stat.isPositive !== false
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {stat.isPositive !== false ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    <span>{stat.change}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
