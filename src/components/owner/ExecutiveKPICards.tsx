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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <div 
          key={kpi.id} 
          onClick={() => onNavigate(kpi.route)}
          className={`bg-white rounded-xl border ${kpi.borderColor} p-4 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              {kpi.trendType === 'positive' && <TrendingUp className="w-4 h-4 text-green-500" />}
              {kpi.trendType === 'negative' && <TrendingDown className="w-4 h-4 text-red-500" />}
            </div>
            <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{kpi.title}</h3>
            <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
            <p className={`text-xs mt-2 ${
              kpi.trendType === 'positive' ? 'text-green-600' :
              kpi.trendType === 'negative' ? 'text-red-600' :
              'text-slate-500'
            }`}>
              {kpi.trend}
            </p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
            <span>{kpi.action}</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ))}
    </div>
  );
};
