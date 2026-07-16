import React from 'react';
import { Tenant } from '../../types';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Navigation, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
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

interface DashboardProps {
  tenant: Tenant;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ tenant, onNavigate }) => {
  const revenueData = [
    { month: 'Jan', collected: 4200000, target: 4500000 },
    { month: 'Feb', collected: 4800000, target: 4800000 },
    { month: 'Mar', collected: 5100000, target: 5000000 },
    { month: 'Apr', collected: 5900000, target: 5500000 },
    { month: 'May', collected: 6400000, target: 6000000 },
    { month: 'Jun', collected: 7200000, target: 7000000 },
  ];

  const attendanceTrend = [
    { day: 'Mon', rate: 96.2 },
    { day: 'Tue', rate: 97.5 },
    { day: 'Wed', rate: 95.8 },
    { day: 'Thu', rate: 98.1 },
    { day: 'Fri', rate: 94.4 },
  ];

  const gradeDistribution = [
    { name: 'K-5 Primary', value: 450, color: '#6366f1' },
    { name: '6-10 Middle', value: 680, color: '#8b5cf6' },
    { name: '11-12 Senior', value: 520, color: '#ec4899' },
    { name: 'Undergrad / PG', value: 890, color: '#06b6d4' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl">{tenant.logo}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Active Tenant: {tenant.name}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Enterprise Dashboard & BI Intelligence
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-time multi-tenant monitoring across student attendance, UPI fee collections, AI assistants, and GPS school transit fleet.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('ai_hub')}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Principal & Tutors</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">2,540</div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.4%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Students & Scholars across campuses</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection (YTD)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">₹3.48 Cr</div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
              94.2% Collected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">UPI, Bank Transfer & Gateway</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today Attendance</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">96.8%</div>
            <span className="text-xs font-semibold text-blue-600 flex items-center bg-blue-50 px-2 py-0.5 rounded-full">
              Face ID Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Biometric & Camera Gateways</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Fleet (GPS)</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">18 Buses</div>
            <span className="text-xs font-semibold text-purple-600 flex items-center bg-purple-50 px-2 py-0.5 rounded-full">
              Real-time Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">All routes on schedule</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Target */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Revenue & Fee Collection Performance</h2>
              <p className="text-xs text-slate-500">Comparing actual UPI/Bank collections against target projections</p>
            </div>
            <button 
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>Manage Fees</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
                <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Collection']} />
                <Area type="monotone" dataKey="collected" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCollected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900">Student Demographics</h2>
              <button 
                onClick={() => onNavigate('students')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View SIS
              </button>
            </div>
            <p className="text-xs text-slate-500">Distribution across academic levels</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {gradeDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </span>
                <span className="font-bold text-slate-900">{item.value} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => onNavigate('fees')}
          className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl text-left shadow-sm hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 text-sm">UPI Fee Collection</div>
          <p className="text-xs text-slate-500 mt-0.5">Generate QR & payment gateway</p>
        </button>

        <button 
          onClick={() => onNavigate('attendance')}
          className="p-4 bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl text-left shadow-sm hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 text-sm">Face ID Attendance</div>
          <p className="text-xs text-slate-500 mt-0.5">Biometric & camera scanner</p>
        </button>

        <button 
          onClick={() => onNavigate('transport')}
          className="p-4 bg-white border border-slate-200 hover:border-purple-500 rounded-2xl text-left shadow-sm hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 text-sm">Live GPS Bus Tracker</div>
          <p className="text-xs text-slate-500 mt-0.5">Real-time transit fleet radar</p>
        </button>

        <button 
          onClick={() => onNavigate('ai_hub')}
          className="p-4 bg-white border border-slate-200 hover:border-pink-500 rounded-2xl text-left shadow-sm hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-3 group-hover:bg-pink-600 group-hover:text-white transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 text-sm">AI Assistant Suite</div>
          <p className="text-xs text-slate-500 mt-0.5">Principal, Tutor & Lesson Planner</p>
        </button>
      </div>
    </div>
  );
};
