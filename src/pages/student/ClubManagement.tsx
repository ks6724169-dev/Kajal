import React from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { BookOpen, Users, Clock, Mail } from 'lucide-react';

export const ClubManagement: React.FC = () => {
  const { clubs } = usePortfolio();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Extracurricular Activity Clubs</h2>
        <p className="text-xs text-slate-400 font-medium">Verify active member capacity, audit bi-weekly schedules, and contact club instructors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clubs.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-2xl">
                  <BookOpen className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{c.name}</h4>
                  <span className="text-[10px] text-slate-400 block font-semibold">{c.meetingTime}</span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">{c.membersCount} / {c.capacity}</span>
                <span className="text-[9px] text-slate-400 uppercase font-extrabold block">registered</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {c.description}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center">
                <Users className="w-4 h-4 text-slate-400 mr-1.5" />
                Mentor: <strong>{c.mentor}</strong>
              </span>
              <a href={`mailto:${c.mentorContact}`} className="text-indigo-600 hover:underline flex items-center">
                <Mail className="w-4 h-4 mr-1" /> Contact
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
