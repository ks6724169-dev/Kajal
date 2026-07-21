import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart, Line, AreaChart, Area 
} from 'recharts';

const MOCK_GPA_HISTORY = [
  { term: 'Term 1 2024', gpa: 3.20 },
  { term: 'Term 2 2024', gpa: 3.45 },
  { term: 'Term 1 2025', gpa: 3.52 },
  { term: 'Term 2 2025', gpa: 3.68 },
  { term: 'Term 1 2026', gpa: 3.85 }
];

const MOCK_SUBJECT_PERFORMANCE = [
  { subject: 'Math', score: 92, average: 75 },
  { subject: 'Physics', score: 88, average: 70 },
  { subject: 'AI & Coding', score: 98, average: 82 },
  { subject: 'Chemistry', score: 85, average: 72 },
  { subject: 'Literature', score: 90, average: 78 }
];

export const AcademicChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3.5 shadow-2xs">
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Subject Performance Index vs. Campus Average</h4>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_SUBJECT_PERFORMANCE} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
              labelStyle={{ fontWeight: 'bold', color: '#6366f1' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
            <Bar dataKey="score" name="Student Score" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="average" name="Campus Avg" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const PerformanceGraph: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3.5 shadow-2xs">
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Cumulative GPA Progression History</h4>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_GPA_HISTORY} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="term" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <YAxis domain={[0.0, 4.0]} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
              labelStyle={{ fontWeight: 'bold', color: '#6366f1' }}
            />
            <Area type="monotone" dataKey="gpa" name="Term GPA" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
