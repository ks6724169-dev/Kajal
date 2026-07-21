import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useStore } from '../../stores/StoreContext';

interface ChartWidgetProps {
  type: 'revenue' | 'attendance' | 'distribution' | 'performance';
  height?: number;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ type, height = 240 }) => {
  const { theme } = useStore();
  const isDark = theme === 'dark' || theme === 'high-contrast';

  // Sample data definitions
  const revenueData = [
    { name: 'Jan', collected: 42, target: 45 },
    { name: 'Feb', collected: 48, target: 48 },
    { name: 'Mar', collected: 51, target: 50 },
    { name: 'Apr', collected: 59, target: 55 },
    { name: 'May', collected: 64, target: 60 },
    { name: 'Jun', collected: 72, target: 70 },
  ];

  const attendanceTrend = [
    { name: 'Mon', rate: 96.2 },
    { name: 'Tue', rate: 97.5 },
    { name: 'Wed', rate: 95.8 },
    { name: 'Thu', rate: 98.1 },
    { name: 'Fri', rate: 94.4 },
  ];

  const distributionData = [
    { name: 'Primary (K-5)', value: 450, color: '#6366f1' },
    { name: 'Middle (6-10)', value: 680, color: '#8b5cf6' },
    { name: 'Senior (11-12)', value: 520, color: '#ec4899' },
    { name: 'Higher Ed', value: 890, color: '#06b6d4' },
  ];

  const performanceData = [
    { name: 'English', score: 84 },
    { name: 'Math', score: 76 },
    { name: 'Science', score: 91 },
    { name: 'History', score: 85 },
    { name: 'Arts', score: 95 },
  ];

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: '11px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  };

  if (type === 'revenue') {
    return (
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} vertical={false} />
            <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} unit="L" />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="collected" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCollected)" name="Collected (₹ Lakhs)" />
            <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Target (₹ Lakhs)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'attendance') {
    return (
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} vertical={false} />
            <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} domain={[90, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="rate" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Attendance Rate (%)" maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'distribution') {
    return (
      <div className="w-full flex flex-col items-center justify-center" style={{ height }}>
        <div className="w-full flex-1 min-h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full mt-2">
          {distributionData.map((item, i) => (
            <div key={i} className="flex items-center space-x-1.5 justify-center">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[90px]">{item.name}</span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'performance') {
    return (
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid stroke={isDark ? '#334155' : '#f1f5f9'} horizontal={false} />
            <XAxis type="number" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} domain={[0, 100]} tickLine={false} />
            <YAxis dataKey="name" type="category" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="score" fill="#06b6d4" radius={[0, 4, 4, 0]} name="My Score" maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};
