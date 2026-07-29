import React from 'react';
import { Users, GraduationCap, Wallet, BookOpen, Bus, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface ExecutiveKPICardsProps {
  onNavigate: (path: string) => void;
  currentCampus: string;
  stats?: any;
}

export const ExecutiveKPICards: React.FC<ExecutiveKPICardsProps> = ({ onNavigate, currentCampus, stats }) => {
  const kpis = [
    {
      id: 'students',
      title: 'Total Students',
      value: stats ? stats.totalStudents.toString() : '...', 
      trend: '+124 this month',
      trendType: 'positive',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
      action: 'View Students',
      route: 'students'
    },
    {
      id: 'staff',
      title: 'Active Staff',
      value: stats ? stats.activeStaff.toString() : '...', 
      trend: '94% present today',
      trendType: 'positive',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-600',
      borderColor: 'border-indigo-100',
      action: 'View Staff',
      route: 'hr'
    },
    {
      id: 'finance',
      title: 'Fees Collected',
      value: stats ? `₹${stats.feesCollected.toLocaleString()}` : '...', 
      trend: '8% below target',
      trendType: 'negative',
      icon: Wallet,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100',
      action: 'View Finances',
      route: 'finance'
    },
    {
      id: 'academic',
      title: 'Avg. Attendance',
      value: stats ? `${stats.avgAttendance}%` : '...', 
      trend: '+1.2% this week',
      trendType: 'positive',
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-100',
      action: 'View Academics',
      route: 'academic'
    },
    {
      id: 'transport',
      title: 'Active Routes',
      value: stats ? stats.activeRoutes.toString() : '...', 
      trend: 'All running on time',
      trendType: 'neutral',
      icon: Bus,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100',
      action: 'View Transport',
      route: 'operations'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
      {kpis.map((kpi) => (
        <div 
          key={kpi.id} 
          onClick={() => onNavigate(kpi.route)}
          className="bg-slate-50/80 backdrop-blur-sm rounded-[2rem] border border-slate-100 p-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:bg-white hover:border-slate-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          {/* Subtle gradient glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${kpi.color} shadow-sm flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex items-center">
                {kpi.trendType === 'positive' && (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100/50 border border-emerald-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3 mr-1 shrink-0" /> Stable
                  </span>
                )}
                {kpi.trendType === 'negative' && (
                  <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-100/50 border border-rose-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    <TrendingDown className="w-3 h-3 mr-1 shrink-0" /> Alert
                  </span>
                )}
                {kpi.trendType === 'neutral' && (
                  <span className="inline-flex items-center text-[10px] font-bold text-slate-700 bg-slate-200/50 border border-slate-300/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Normal
                  </span>
                )}
              </div>
            </div>
            <p className="text-slate-500 text-[11px] font-extrabold uppercase tracking-widest mb-1">{kpi.title}</p>
            <div className="text-3xl font-black tracking-tight text-slate-900 leading-none mb-2">{kpi.value}</div>
            <p className={`text-xs font-bold mt-3 ${
              kpi.trendType === 'positive' ? 'text-emerald-600' :
              kpi.trendType === 'negative' ? 'text-rose-600' :
              'text-slate-500'
            }`}>
              {kpi.trend}
            </p>
          </div>
          
          <div className="relative z-10 mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-extrabold tracking-wide text-slate-500 group-hover:text-indigo-600 transition-colors">
            <span>{kpi.action}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ))}
    </div>
  );
};
