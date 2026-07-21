import React from 'react';
import { ShieldCheck, UserCheck, CreditCard, Sparkles, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  role: string;
  action: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

export const ActivityTimeline: React.FC = () => {
  const activities: ActivityItem[] = [
    { id: 'act-1', user: 'System Agent', role: 'AI', action: 'Regenerated weekly fee collection forecasts using Gemini 3.5 Flash', time: '2 mins ago', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-indigo-500/10 text-indigo-500' },
    { id: 'act-2', user: 'Dr. Rajesh Sharma', role: 'Super Admin', action: 'Authorized payment disbursements for Grade 12 lab hardware', time: '14 mins ago', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 'act-3', user: 'Aarav Kumar', role: 'Parent', action: 'Submitted UPI QR fee transfer worth ₹42,500 successfully', time: '1 hr ago', icon: <CreditCard className="w-3.5 h-3.5" />, color: 'bg-blue-500/10 text-blue-500' },
    { id: 'act-4', user: 'Mrs. Neha Gupta', role: 'Teacher', action: 'Scanned 45 Grade 10 Math exam sheets using OMR Scanner camera', time: '2 hrs ago', icon: <FileSpreadsheet className="w-3.5 h-3.5" />, color: 'bg-pink-500/10 text-pink-500' },
    { id: 'act-5', user: 'Security Ingress OS', role: 'System', action: 'Detected unknown network trace on region node-04; isolated', time: '5 hrs ago', icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'bg-rose-500/10 text-rose-500' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-1 mb-3 border-b border-slate-100 dark:border-slate-800/40">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Campus Activity Audit Log</span>
        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold hover:underline cursor-pointer">Export Logs</span>
      </div>
      <div className="relative border-l border-slate-100 dark:border-slate-800 pl-4 space-y-4 ml-2">
        {activities.map((item) => (
          <div key={item.id} className="relative group">
            {/* Bubble Indicator */}
            <span className={`absolute -left-[23px] top-1 rounded-full p-1.5 border-4 border-white dark:border-slate-950 flex items-center justify-center ${item.color}`}>
              {item.icon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {item.user} <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 ml-1.5">{item.role}</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">{item.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-tight">
                {item.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
