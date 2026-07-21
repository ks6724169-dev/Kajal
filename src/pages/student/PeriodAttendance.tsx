import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { useAttendance } from '../../hooks/useAttendance';
import { BookOpen, Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';

export const PeriodAttendance: React.FC = () => {
  const { students } = useStudents();
  const { periodRecords, markPeriod } = useAttendance();
  const [date, setDate] = useState('2026-07-19');
  const [selectedPeriod, setSelectedPeriod] = useState(1);

  const subjects = [
    { period: 1, name: 'Multivariate Calculus', teacher: 'Mrs. Aditi Sen' },
    { period: 2, name: 'Advanced Physics', teacher: 'Mr. Rakesh Kapoor' },
    { period: 3, name: 'Artificial Intelligence', teacher: 'Dr. Rajesh Sharma' },
    { period: 4, name: 'Organic Chemistry', teacher: 'Mrs. Priya Nair' },
    { period: 5, name: 'Literature & Drama', teacher: 'Ms. Clara D\'Souza' }
  ];

  const currentSubject = subjects.find(s => s.period === selectedPeriod) || subjects[0];

  const getStatusForStudent = (studentId: string) => {
    const record = periodRecords.find(r => r.studentId === studentId && r.date === date && r.period === selectedPeriod);
    return record ? record.status : 'present';
  };

  const handleMarkPeriodStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    markPeriod(studentId, date, selectedPeriod, currentSubject.name, status, currentSubject.teacher);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Period & Lecture-Wise Attendance</h2>
          <p className="text-xs text-slate-400 font-medium">Log attendance for specific lectures, track skip rates, and register late arrivals per subject.</p>
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

      {/* Select Period Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {subjects.map(sub => (
          <button
            key={sub.period}
            onClick={() => setSelectedPeriod(sub.period)}
            className={`px-4 py-3 rounded-2xl border text-xs font-extrabold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
              selectedPeriod === sub.period
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10'
                : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-500 hover:border-slate-250 dark:hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <div className="text-left">
              <span className="block text-[8px] uppercase tracking-wider opacity-75">Period {sub.period}</span>
              <span className="block mt-0.5">{sub.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500">Instructor: <strong>{currentSubject.teacher}</strong></span>
        <span className="text-slate-400">Date: {date}</span>
      </div>

      {/* Table Roster */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 grid grid-cols-12 text-[10px] font-black text-slate-400 uppercase tracking-wider">
          <span className="col-span-5">Student / ID</span>
          <span className="col-span-3 text-center">Status</span>
          <span className="col-span-4 text-right">Actions</span>
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
                    status === 'absent' ? 'bg-rose-150 text-rose-600' : 'bg-amber-150 text-amber-600'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="col-span-4 flex items-center justify-end space-x-1.5">
                  <button 
                    onClick={() => handleMarkPeriodStatus(s.id, 'present')}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${status === 'present' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500'}`}
                  >
                    <CheckCircle className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => handleMarkPeriodStatus(s.id, 'absent')}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${status === 'absent' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500'}`}
                  >
                    <XCircle className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => handleMarkPeriodStatus(s.id, 'late')}
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
