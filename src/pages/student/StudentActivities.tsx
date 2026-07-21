import React from 'react';
import { useStudents } from '../../hooks/useStudents';
import { Calendar, Award, Star, Activity } from 'lucide-react';

export const StudentActivities: React.FC = () => {
  const { students } = useStudents();

  // Consolidate timeline events across all students to show a campus activity list
  const allEvents = students.flatMap(s => s.timeline.map(t => ({
    ...t,
    studentName: s.name,
    studentAvatar: s.avatar
  }))).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Active Extracurricular Milestones</h2>
        <p className="text-xs text-slate-400 font-medium">Real-time chronicle of student workshops, athletic championships, hackathons, and certifications.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xs space-y-6">
        <div className="space-y-6 relative pl-4 border-l border-slate-100 dark:border-slate-800 ml-1.5">
          {allEvents.map((evt, idx) => (
            <div key={evt.id || idx} className="relative flex items-start space-x-3.5">
              <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900 flex items-center justify-center text-[7px] text-white">
                ★
              </div>
              
              <img src={evt.studentAvatar} alt={evt.studentName} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border border-slate-150 shrink-0" />
              
              <div>
                <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{evt.date} • {evt.studentName}</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 block mt-0.5">{evt.event}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{evt.description}</p>
                <span className={`inline-block text-[8px] font-extrabold uppercase mt-2 px-1.5 py-0.5 rounded-md ${
                  evt.type === 'academic' ? 'bg-indigo-50 text-indigo-500' :
                  evt.type === 'activity' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                }`}>
                  {evt.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
