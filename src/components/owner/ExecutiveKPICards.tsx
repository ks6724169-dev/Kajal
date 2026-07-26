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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {kpis.map((kpi) => (
        <div 
          key={kpi.id} 
          onClick={() => onNavigate(kpi.route)}
          className="bg-white rounded-2xl border border-slate-200/50 p-5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${kpi.color} shadow-xs flex items-center justify-center`}>
                <kpi.icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex items-center">
                {kpi.trendType === 'positive' && (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-0.5 shrink-0" /> Stable
                  </span>
                )}
                {kpi.trendType === 'negative' && (
                  <span className="inline-flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    <TrendingDown className="w-3 h-3 mr-0.5 shrink-0" /> Alert
                  </span>
                )}
                {kpi.trendType === 'neutral' && (
                  <span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                    Normal
                  </span>
                )}
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">{kpi.title}</p>
            <div className="text-3xl font-bold tracking-tight text-slate-900">{kpi.value}</div>
            <p className={`text-xs font-semibold mt-2.5 ${
              kpi.trendType === 'positive' ? 'text-emerald-600' :
              kpi.trendType === 'negative' ? 'text-rose-600' :
              'text-slate-400'
            }`}>
              {kpi.trend}
            </p>
          </div>
          
          <div className="mt-5 pt-3 border-t border-slate-100/70 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
            <span className="tracking-wide text-[11px] font-bold">{kpi.action}</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ))}
    </div>
  );
};
