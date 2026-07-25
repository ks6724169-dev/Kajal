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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <LineChartIcon className="w-5 h-5 text-indigo-600" />
          Executive Analytics
        </h3>
        <div className="flex bg-slate-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 p-5 flex flex-col sm:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
            {activeTab === 'finance' ? 'Revenue Trend (YTD)' : 
             activeTab === 'students' ? 'Student Growth' :
             activeTab === 'academic' ? 'Academic Performance' : 'Revenue Overview'}
          </h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="received" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorReceived)" name="Received" />
                <Area type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorPending)" name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
            {activeTab === 'academic' ? 'Average Scores (%)' : 'Weekly Attendance (%)'}
          </h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="students" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Students" maxBarSize={40} />
                <Bar dataKey="staff" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Staff" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

