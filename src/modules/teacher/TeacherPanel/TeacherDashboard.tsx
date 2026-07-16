import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles,
  Command,
  TrendingUp,
  Clock,
  ShieldCheck,
  LayoutGrid,
  Laptop,
  CheckCircle,
  HelpCircle,
  FolderLock
} from 'lucide-react';
import { teacherModules } from './modulesData';

interface TeacherDashboardProps {
  onSelectModule: (moduleId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onSelectModule }) => {
  return (
    <div className="w-full px-6 sm:px-8 lg:px-12 pt-6 pb-24 space-y-10 animate-in fade-in duration-500">
      
      {/* Enterprise Workspace Greeting Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 opacity-5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-emerald-500 opacity-5 rounded-full blur-[80px] translate-y-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>DPS Enterprise Cloud Integration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
              Welcome back, Sarah johnson.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Your academic workspaces, classrooms, digital evaluations, and real-time student lifecycle analytics are fully synchronized and compiled. Ready for your next schedule.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-3xl text-center min-w-[120px]">
              <span className="block text-[10px] text-slate-500 uppercase font-black">Active Session</span>
              <span className="block text-sm font-black text-indigo-400 mt-1">Grade 10-A</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-3xl text-center min-w-[120px]">
              <span className="block text-[10px] text-slate-500 uppercase font-black">Server Status</span>
              <span className="block text-sm font-black text-emerald-400 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Real-time System Sync', value: '100% Online', change: 'All nodes calibrated', color: 'text-indigo-600', icon: Laptop },
          { label: 'Today\'s Scheduled Sessions', value: '5 Classes', change: 'Next up: 10:30 AM', color: 'text-emerald-600', icon: Clock },
          { label: 'Academic Progress Rate', value: '94.2% Complete', change: 'Syllabus ahead of timeline', color: 'text-cyan-600', icon: TrendingUp },
          { label: 'Workspace Databases', value: 'Active Partition', change: 'Automatic cloud backup active', color: 'text-purple-600', icon: FolderLock },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <span className="block text-xl font-black text-slate-900">{stat.value}</span>
                <span className="block text-[10px] font-semibold text-slate-500">{stat.change}</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-slate-100 transition-colors">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Module Workspace Registry (Launcher Grid) */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Enterprise Module Directory
            </h3>
            <p className="text-xs text-slate-400">Launch any dedicated teacher workspace instantly</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3.5 py-1.5 rounded-full">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>8 core workspaces</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teacherModules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => onSelectModule(module.id)}
                className="bg-white border border-slate-200/80 rounded-[2.2rem] p-6 text-left shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between h-[230px] group relative overflow-hidden"
              >
                {/* Background ambient light indicator on hover */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.color} opacity-[0.01] group-hover:opacity-[0.06] rounded-full blur-2xl transition-opacity -mr-8 -mt-8`}></div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {module.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide animate-pulse">
                        {module.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {module.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-semibold">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-slate-400">
                    {module.stats || 'Workspace Ready'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
