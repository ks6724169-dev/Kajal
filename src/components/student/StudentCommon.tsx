import React from 'react';
import { Search, Filter, Star, GraduationCap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface StudentAvatarProps {
  avatarUrl: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  statusRing?: 'success' | 'warning' | 'danger' | 'none';
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({ 
  avatarUrl, 
  name, 
  size = 'md', 
  statusRing = 'none' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl font-bold',
    xl: 'w-24 h-24 text-3xl font-black'
  }[size];

  const ringClasses = {
    success: 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-950',
    warning: 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-950',
    danger: 'ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-950',
    none: ''
  }[statusRing];

  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className={`relative shrink-0 select-none ${sizeClasses}`}>
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={name} 
          referrerPolicy="no-referrer"
          className={`w-full h-full rounded-full object-cover border border-slate-200 dark:border-slate-800 ${ringClasses}`}
        />
      ) : (
        <div className={`w-full h-full rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center font-extrabold ${ringClasses}`}>
          {initials}
        </div>
      )}
    </div>
  );
};

interface StudentSearchProps {
  query: string;
  setQuery: (q: string) => void;
  placeholder?: string;
}

export const StudentSearch: React.FC<StudentSearchProps> = ({ 
  query, 
  setQuery, 
  placeholder = "Search student name, ID..." 
}) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
      />
    </div>
  );
};

interface StudentFilterProps {
  selectedGrade: string;
  setSelectedGrade: (g: string) => void;
  selectedHouse: string;
  setSelectedHouse: (h: string) => void;
  selectedType: 'all' | 'weak' | 'gifted';
  setSelectedType: (t: 'all' | 'weak' | 'gifted') => void;
}

export const StudentFilter: React.FC<StudentFilterProps> = ({
  selectedGrade,
  setSelectedGrade,
  selectedHouse,
  setSelectedHouse,
  selectedType,
  setSelectedType
}) => {
  const grades = ['All Grades', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const houses = ['All Houses', 'Gold Phoenixes', 'Red Gryphons', 'Blue Krakens', 'Green Hydras'];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center space-x-1 bg-slate-100/50 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
        {(['all', 'gifted', 'weak'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition cursor-pointer ${
              selectedType === t
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <select
        value={selectedGrade}
        onChange={(e) => setSelectedGrade(e.target.value)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500"
      >
        {grades.map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <select
        value={selectedHouse}
        onChange={(e) => setSelectedHouse(e.target.value)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500"
      >
        {houses.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
    </div>
  );
};

interface StudentStatisticsProps {
  total: number;
  avgGPA: string;
  avgAttendance: string;
  weakCount: number;
  giftedCount: number;
}

export const StudentStatistics: React.FC<StudentStatisticsProps> = ({
  total,
  avgGPA,
  avgAttendance,
  weakCount,
  giftedCount
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 w-full">
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 rounded-2xl shadow-2xs">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Enrolled Students</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{total}</span>
          <span className="text-[9px] font-bold text-indigo-500 uppercase">Total active</span>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 rounded-2xl shadow-2xs">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Average GPA</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{avgGPA}</span>
          <span className="text-[9px] font-bold text-emerald-500 uppercase">Target A+</span>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 rounded-2xl shadow-2xs">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Average Attendance</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{avgAttendance}%</span>
          <span className="text-[9px] font-bold text-blue-500 uppercase">Optimal SLA</span>
        </div>
      </div>

      <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-950/20 rounded-2xl">
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Weak Students</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{weakCount}</span>
          <span className="text-[9px] font-bold text-rose-500 uppercase">Attention req.</span>
        </div>
      </div>

      <div className="col-span-2 md:col-span-1 p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-950/20 rounded-2xl">
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Gifted Students</span>
        <div className="flex items-baseline space-x-1.5 mt-1">
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{giftedCount}</span>
          <span className="text-[9px] font-bold text-amber-500 uppercase">Talent Pool</span>
        </div>
      </div>
    </div>
  );
};
