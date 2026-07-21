import React from 'react';
import { useStudents } from '../../hooks/useStudents';
import { Sparkles, Trophy, Brain } from 'lucide-react';

export const GiftedStudents: React.FC = () => {
  const { students } = useStudents();
  const giftedStudentsList = students.filter(s => s.isGifted);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Enterprise Gifted Talent Pool</h2>
        <p className="text-xs text-slate-400 font-medium">Identify academic elites, record peer mentoring metrics, and enroll candidates in state-level olympiads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {giftedStudentsList.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={s.avatar} alt={s.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{s.name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block">{s.admissionNo} • {s.grade}-{s.section}</span>
                </div>
              </div>

              <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Gifted
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                <span className="text-[8px] font-extrabold text-slate-400 uppercase block">Term GPA</span>
                <span className="text-xs font-black text-amber-600 block mt-0.5">{s.gpa.toFixed(2)}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                <span className="text-[8px] font-extrabold text-slate-400 uppercase block">Attendance</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 block mt-0.5">{s.attendanceRate}%</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                <span className="text-[8px] font-extrabold text-slate-400 uppercase block">Society House</span>
                <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 block mt-0.5 leading-tight">{s.house.split(' ')[1]}</span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-950/20 rounded-2xl space-y-1">
              <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-wider block flex items-center">
                <Trophy className="w-3.5 h-3.5 mr-1" /> Peer Mentoring Focus
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                Appointed Coding & AI Club workshop leader. Actively mentors {s.grade} juniors on modern web architectures.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
