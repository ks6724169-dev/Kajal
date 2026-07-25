import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  MoreVertical, 
  Building, 
  Users, 
  ChevronRight,
  ExternalLink,
  RefreshCw,
  MoreHorizontal,
  LayoutGrid,
  List,
  User,
  Shield,
  BookOpen
} from 'lucide-react';
import { Tenant } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';

interface DepartmentsPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ tenant, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for now since we don't have a DepartmentService yet
  const departments = [
    { id: '1', name: 'Science & Research', code: 'SCI-01', head: 'Dr. Sarah Wilson', staffCount: 24, studentCount: 450, color: 'bg-indigo-600' },
    { id: '2', name: 'Mathematics', code: 'MATH-02', head: 'Prof. James Bond', staffCount: 18, studentCount: 320, color: 'bg-emerald-600' },
    { id: '3', name: 'Humanities & Arts', code: 'HUM-03', head: 'Ms. Elena Gilbert', staffCount: 32, studentCount: 680, color: 'bg-amber-600' },
    { id: '4', name: 'Computer Applications', code: 'COMP-04', head: 'Mr. Alan Turing', staffCount: 15, studentCount: 210, color: 'bg-blue-600' },
    { id: '5', name: 'Physical Education', code: 'PE-05', head: 'Coach Carter', staffCount: 12, studentCount: 890, color: 'bg-rose-600' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
             <div className="w-2 h-2 rounded-full bg-indigo-600" />
             Functional Isolation
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Department Registry</h1>
           <p className="text-slate-500 font-medium mt-2 max-w-lg">
             Configure functional departments, assign academic leadership, and monitor resource distribution.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search departments..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-[11px] font-black w-64 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300 uppercase tracking-widest"
                />
              </div>
              
              <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-1">
                 <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                 >
                   <LayoutGrid className="w-5 h-5" />
                 </button>
                 <button 
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                 >
                   <List className="w-5 h-5" />
                 </button>
              </div>
           </div>

           <button className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="w-12 h-12 animate-spin mb-6 text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Functional Nodes...</p>
        </div>
      ) : filteredDepartments.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          <AnimatePresence mode="popLayout">
            {filteredDepartments.map((dept, idx) => (
              <motion.div 
                layout
                key={dept.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`bg-white group ${
                  viewMode === 'grid' 
                  ? 'rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:translate-y-[-4px] transition-all flex flex-col overflow-hidden' 
                  : 'rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row items-center gap-8 hover:bg-slate-50 transition-colors'
                }`}
              >
                <div className={`${viewMode === 'grid' ? 'p-8 border-b border-slate-50' : ''} flex items-start justify-between w-full`}>
                   <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-3xl ${dept.color} text-white flex items-center justify-center font-black text-xl shadow-xl group-hover:scale-110 transition-transform`}>
                        <Layers className="w-7 h-7" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{dept.name}</h3>
                         <div className="flex items-center gap-3 mt-1.5">
                           <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{dept.code}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                           <span className="text-[10px] text-indigo-600 font-black tracking-widest uppercase">Functional</span>
                         </div>
                      </div>
                   </div>
                   <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                     <MoreHorizontal className="w-5 h-5" />
                   </button>
                </div>
                
                <div className={`${viewMode === 'grid' ? 'p-8 flex-1 space-y-6' : 'flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6'} w-full`}>
                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Head of Dept</p>
                         <p className="text-sm font-black text-slate-900 mt-0.5">{dept.head}</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Faculty Count</p>
                         <p className="text-sm font-black text-slate-900 mt-0.5">{dept.staffCount} Members</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Load</p>
                         <p className="text-sm font-black text-slate-900 mt-0.5">{dept.studentCount} Students</p>
                      </div>
                   </div>
                </div>

                <div className={`${viewMode === 'grid' ? 'p-6 bg-slate-50/50 border-t border-slate-100' : ''} flex items-center gap-3 w-full sm:w-auto`}>
                   <button className="flex-1 py-3.5 bg-white border border-slate-200 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
                    Dept Console
                   </button>
                   <button className="p-3.5 bg-white border border-slate-200 rounded-[20px] text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                    <ExternalLink className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
           <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-8">
             <Layers className="w-10 h-10 text-slate-200" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Departments Found</h3>
           <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto text-center">
             Refine your search parameters or register a new functional department.
           </p>
        </div>
      )}
    </div>
  );
};
