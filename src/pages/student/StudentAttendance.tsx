import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { useAttendance } from '../../hooks/useAttendance';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Calendar as CalendarIcon, Save } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const { students } = useStudents();
  const { dailyRecords, markDaily } = useAttendance();
  const [date, setDate] = useState('2026-07-19');

  const getStatusForStudent = (studentId: string) => {
    const record = dailyRecords.find(r => r.studentId === studentId && r.date === date);
    return record ? record.status : 'present';
  };

  const handleMarkStatus = (studentId: string, status: 'present' | 'absent' | 'leave' | 'late') => {
    markDaily(studentId, date, status, 'Marked via Teacher Portal');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Daily Face ID & Manual Attendance Roll</h2>
          <p className="text-xs text-slate-400 font-medium">Configure session schedules, log instant Face ID entries, and manually override student states.</p>
        </div>

        <div className="flex items-center space-x-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 rounded-xl shadow-2xs">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-transparent outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 grid grid-cols-12 text-[10px] font-black text-slate-400 uppercase tracking-wider">
          <span className="col-span-5">Student / ID</span>
          <span className="col-span-3 text-center">Current Status</span>
          <span className="col-span-4 text-right">Quick Override Actions</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {students.map(s => {
            const status = getStatusForStudent(s.id);
            return (
              <div key={s.id} className="p-4 grid grid-cols-12 items-center hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition">
                <div className="col-span-5 flex items-center space-x-3">
                  <img src={s.avatar} alt={s.name} referrerPolicy="no-referrer" className="w-8.5 h-8.5 rounded-full object-cover border border-slate-150" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{s.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold block">{s.admissionNo} • {s.grade}</span>
                  </div>
                </div>

                <div className="col-span-3 text-center">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                    status === 'present' ? 'bg-emerald-150 text-emerald-600' :
                    status === 'absent' ? 'bg-rose-150 text-rose-600' :
                    status === 'late' ? 'bg-amber-150 text-amber-600' : 'bg-blue-150 text-blue-600'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="col-span-4 flex items-center justify-end space-x-1.5">
                  <button 
                    onClick={() => handleMarkStatus(s.id, 'present')}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${status === 'present' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500'}`}
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => handleMarkStatus(s.id, 'absent')}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${status === 'absent' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500'}`}
                  >
                    <XCircle className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => handleMarkStatus(s.id, 'late')}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${status === 'late' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'}`}
                  >
                    <Clock className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
