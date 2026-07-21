import React, { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { ParentCard } from '../../components/student/StudentCards';
import { User, Search } from 'lucide-react';

export const ParentInformation: React.FC = () => {
  const { students } = useStudents();
  const [query, setQuery] = useState('');

  const filtered = students.filter(s => 
    s.parentInfo.fatherName.toLowerCase().includes(query.toLowerCase()) ||
    s.parentInfo.motherName.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Parent & Family Directory</h2>
          <p className="text-xs text-slate-400 font-medium">Browse verified emergency contact details, family configurations, and residential addresses.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search guardian or student name..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 font-semibold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map(s => (
          <div key={s.id} className="space-y-3">
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-950/40 p-3 border border-slate-150 dark:border-slate-800/40 rounded-2xl">
              <img src={s.avatar} alt={s.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 block">Candidate: {s.name}</span>
                <span className="text-[10px] text-slate-400 font-bold block">{s.grade} - Section {s.section}</span>
              </div>
            </div>
            <ParentCard parentInfo={s.parentInfo} />
          </div>
        ))}
      </div>
    </div>
  );
};
