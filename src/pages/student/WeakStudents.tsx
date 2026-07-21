import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { AlertTriangle, User, Calendar, BookOpen } from 'lucide-react';

export const WeakStudents: React.FC = () => {
  const { students } = useStudents();
  const weakStudentsList = students.filter(s => s.isWeak);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Remedial Targets & Support Radar</h2>
        <p className="text-xs text-slate-400 font-medium">Automatic system tracking detecting lagging GPA thresholds or critical attendance deficits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weakStudentsList.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={s.avatar} alt={s.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{s.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block">{s.admissionNo} • {s.grade}-{s.section}</span>
                </div>
              </div>

              <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Remedial
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase">Term GPA</span>
                <span className="text-sm font-black text-rose-600 block mt-0.5">{s.gpa.toFixed(2)}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase">Attendance</span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-300 block mt-0.5">{s.attendanceRate}%</span>
              </div>
            </div>

            <div className="p-3.5 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-950/20 rounded-2xl">
              <span className="text-[9px] font-extrabold text-rose-500 uppercase tracking-wider block">Clinical Action Strategy</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1 leading-relaxed">
                Mandatory algebra clinic attendance twice a week. Direct supervisor: <strong>{s.counsellingLogs[0]?.counsellor || 'Ms. Sunita Roy'}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
