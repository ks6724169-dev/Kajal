import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Bell, Calendar, Users, 
  GraduationCap, TrendingUp, CheckCircle2, 
  LayoutDashboard, UserCheck, Calculator
} from 'lucide-react';

export const FeaturesSidebar: React.FC = () => {
  const modules = [
    { icon: LayoutDashboard, label: 'Control Center', status: 'Active' },
    { icon: GraduationCap, label: 'Student Hub', status: '1.2k Live' },
    { icon: UserCheck, label: 'Attendance', status: '98% Sync' },
    { icon: Calculator, label: 'Fee Engine', status: 'Automated' },
    { icon: Sparkles, label: 'Galaxy AI', status: 'Ready' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[280px]">
      {/* AI Copilot Preview */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">AI Copilot</h4>
              <p className="text-[10px] text-indigo-400 font-bold">Predictive Model Active</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                "Based on current trends, fee collection will reach 92% by next Tuesday."
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-indigo-500"
                />
              </div>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">75% Accuracy</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modules List */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Modules</h4>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div className="space-y-1">
          {modules.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
              </div>
              <span className="text-[9px] font-black text-slate-300 group-hover:text-indigo-400 uppercase tracking-tighter">{item.status}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live Activity Feed */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="bg-indigo-50 rounded-3xl p-5 border border-indigo-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-3.5 h-3.5 text-indigo-600" />
          <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Live Activity</h4>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Admission Registered', time: '2m ago' },
            { label: 'Fees Processed', time: '15m ago' },
            { label: 'AI Report Ready', time: '30m ago' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                <span className="text-[10px] font-bold text-indigo-800">{log.label}</span>
              </div>
              <span className="text-[9px] text-indigo-400 font-medium">{log.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trust Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schools</p>
          <p className="text-sm font-black text-slate-900 tracking-tight">2,500+</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Students</p>
          <p className="text-sm font-black text-slate-900 tracking-tight">3.5M+</p>
        </div>
      </motion.div>
    </div>
  );
};
