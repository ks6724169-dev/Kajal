import React, { useState } from 'react';
import { Search, Users, CreditCard, GraduationCap, Bus, FileText, ArrowLeft, Filter } from 'lucide-react';

interface GlobalSearchPageProps {
  onNavigate?: (path: string) => void;
}

export const GlobalSearchPage: React.FC<GlobalSearchPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<'all' | 'students' | 'staff' | 'fees' | 'transport' | 'exams'>('all');

  const modulesList = [
    { name: 'Student Directory', path: 'students', type: 'students', icon: Users, desc: 'View student master data & enrollments' },
    { name: 'Fee Collection Ledger', path: 'fees', type: 'fees', icon: CreditCard, desc: 'Real-time student fee receipts' },
    { name: 'GPS Fleet Tracking', path: 'transport', type: 'transport', icon: Bus, desc: 'Live school bus routes & drivers' },
    { name: 'Examination & Marksheets', path: 'exams', type: 'exams', icon: GraduationCap, desc: 'CBSE/ICSE report cards & GPA' },
    { name: 'Campus Security & CCTV', path: 'cctv', type: 'staff', icon: FileText, desc: 'Gate pass & visitor audit logs' }
  ];

  const filtered = modulesList.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = category === 'all' || m.type === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="pt-6 px-6 pb-6 max-w-5xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, ID, staff, fee receipts, routes..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {(['all', 'students', 'staff', 'fees', 'transport', 'exams'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                category === cat 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">No records found for "{searchTerm}".</p>
          </div>
        ) : (
          filtered.map(item => {
            const Icon = item.icon;
            return (
              <div 
                key={item.name}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate(item.path)}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Open &rarr;
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
