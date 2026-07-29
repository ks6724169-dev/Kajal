import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, LineChart as LineChartIcon, Users, Wallet, GraduationCap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface ExecutiveAnalyticsProps {
  currentCampus: string;
  stats?: any;
}

export const ExecutiveAnalytics: React.FC<ExecutiveAnalyticsProps> = ({ currentCampus, stats }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
  ];

  const revenueData = stats?.revenueData || [];
  const attendanceData = stats?.attendanceData || [];

  return (
    <div className="bg-slate-50/80 backdrop-blur-sm rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[400px] relative group hover:shadow-xl hover:shadow-indigo-500/5 hover:border-slate-200 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div className="px-6 py-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 bg-white/40">
        <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-slate-700 stroke-[2.2]" />
          Executive Performance
        </h3>
        <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200/40 select-none self-start sm:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all duration-250 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-xs font-black' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col sm:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
            {activeTab === 'finance' ? 'Revenue Trend (YTD)' : 
             activeTab === 'students' ? 'Student Growth' :
             activeTab === 'academic' ? 'Academic Performance' : 'Revenue Overview'}
          </h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 'bold'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid rgba(226, 232, 240, 0.8)', 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                  labelStyle={{ fontWeight: 'black', color: '#0f172a', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="received" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReceived)" name="Received" />
                <Area type="monotone" dataKey="pending" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPending)" name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
            {activeTab === 'academic' ? 'Average Scores (%)' : 'Weekly Attendance (%)'}
          </h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 'bold'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid rgba(226, 232, 240, 0.8)', 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="students" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Students" maxBarSize={28} />
                <Bar dataKey="staff" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Staff" maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

