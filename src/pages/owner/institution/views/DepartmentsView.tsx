import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  MoreVertical, 
  User, 
  MapPin, 
  Filter,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Tenant } from '../../../../types';
import { DepartmentService, DepartmentRecord } from '../../../../services/DepartmentService';

interface DepartmentsViewProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({ tenant, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await DepartmentService.getDepartments(tenantId);
      setDepartments(data);
    } catch (err) {
      console.error('Departments Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.campus?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search departments, campuses, codes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
             <Filter className="w-3.5 h-3.5" /> Filter
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
             <Plus className="w-4 h-4" /> New Department
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Name</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Campus</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dept. Head (HOD)</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-3 text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Reading Department Matrix...</p>
                   </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((dept) => (
                <tr key={dept.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{dept.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{dept.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                      {dept.campus?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                      {dept.head_name || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider border ${
                      dept.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onNavigate(`/owner/institution/department/${dept.id}`)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <Briefcase className="w-10 h-10 text-slate-200" />
                      <p className="text-sm font-bold text-slate-900">No Departments Mapped</p>
                      <button className="mt-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                        Create First Functional Unit
                      </button>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Edit2 = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
);
