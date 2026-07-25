import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Plus, 
  Building2, 
  Layers, 
  MoreVertical, 
  ChevronRight, 
  ChevronDown,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  Shield,
  Edit2,
  Trash2,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tenant } from '../../../types';

interface OrganizationStructurePageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

interface OrgUnit {
  id: string;
  name: string;
  type: 'ORGANIZATION' | 'CAMPUS' | 'DEPARTMENT' | 'UNIT';
  children?: OrgUnit[];
  expanded?: boolean;
  head?: string;
  count?: number;
}

const INITIAL_STRUCTURE: OrgUnit = {
  id: 'org-root',
  name: 'Galaxy International Group',
  type: 'ORGANIZATION',
  head: 'Dr. Arthur Sterling',
  expanded: true,
  children: [
    {
      id: 'campus-1',
      name: 'Main Heritage Campus',
      type: 'CAMPUS',
      head: 'Sarah Wilson',
      count: 850,
      expanded: true,
      children: [
        { id: 'dept-1', name: 'Primary Education', type: 'DEPARTMENT', head: 'James Bond', count: 12 },
        { id: 'dept-2', name: 'Secondary Education', type: 'DEPARTMENT', head: 'Elena Gilbert', count: 15 },
        { id: 'dept-3', name: 'Administration', type: 'DEPARTMENT', head: 'Robert Vance', count: 8 }
      ]
    },
    {
      id: 'campus-2',
      name: 'North Tech Campus',
      type: 'CAMPUS',
      head: 'Michael Chen',
      count: 420,
      expanded: false,
      children: [
        { id: 'dept-4', name: 'Information Technology', type: 'DEPARTMENT', head: 'Steve Jobs', count: 10 },
        { id: 'dept-5', name: 'Admissions', type: 'DEPARTMENT', head: 'Mary Jane', count: 4 }
      ]
    }
  ]
};

export const OrganizationStructurePage: React.FC<OrganizationStructurePageProps> = ({ tenant, onNavigate }) => {
  const [structure, setStructure] = useState<OrgUnit>(INITIAL_STRUCTURE);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);

  const toggleExpand = (id: string, units: OrgUnit): OrgUnit => {
    if (units.id === id) {
      return { ...units, expanded: !units.expanded };
    }
    if (units.children) {
      return { ...units, children: units.children.map(c => toggleExpand(id, c)) };
    }
    return units;
  };

  const renderTreeNode = (node: OrgUnit, level: number = 0) => {
    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center gap-4 py-2.5 px-4 rounded-lg transition-all group mb-1 border ${
            selectedUnit?.id === node.id 
              ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
              : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => setSelectedUnit(node)}
        >
          <div className="flex items-center gap-1 min-w-[24px]">
            {node.children && node.children.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setStructure(toggleExpand(node.id, structure));
                }}
                className="p-1 hover:bg-slate-200 rounded text-slate-400"
              >
                {node.expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
            node.type === 'ORGANIZATION' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' :
            node.type === 'CAMPUS' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' :
            'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            {node.type === 'ORGANIZATION' ? <Shield className="w-4 h-4" /> :
             node.type === 'CAMPUS' ? <Building2 className="w-4 h-4" /> :
             <Layers className="w-4 h-4" />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-bold truncate ${selectedUnit?.id === node.id ? 'text-indigo-900' : 'text-slate-900'}`}>
              {node.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{node.type}</span>
               {node.head && (
                 <>
                   <div className="w-1 h-1 rounded-full bg-slate-200" />
                   <span className="text-[9px] font-semibold text-slate-500">Head: {node.head}</span>
                 </>
               )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all">
                <Plus className="w-3.5 h-3.5" />
             </button>
             <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all">
                <Edit2 className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>

        <AnimatePresence>
          {node.expanded && node.children && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {node.children.map(child => renderTreeNode(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6 mb-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Work Area: 02
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Structure</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Manage organizational hierarchy and institutional unit relationships.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg shadow-sm">
             <button 
               onClick={() => setViewMode('tree')}
               className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'tree' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Hierarchy
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Flat List
             </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" /> Add Unit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Tree Navigator */}
        <div className="xl:col-span-7 space-y-6">
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 overflow-hidden relative">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                 <h3 className="text-lg font-bold text-slate-900 tracking-tight">Institutional Tree</h3>
                 <div className="flex items-center gap-4">
                    <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">Expand All</button>
                    <div className="h-3 w-px bg-slate-200" />
                    <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Collapse All</button>
                 </div>
              </div>

              <div className="space-y-1">
                 {renderTreeNode(structure)}
              </div>
           </div>
        </div>

        {/* Detail Panel / Inspector */}
        <div className="xl:col-span-5 sticky top-32">
           <AnimatePresence mode="wait">
             {selectedUnit ? (
               <motion.div
                 key={selectedUnit.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="bg-slate-900 rounded-xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800"
               >
                 <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                       <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/5">
                          {selectedUnit.type === 'ORGANIZATION' ? <Shield className="w-6 h-6 text-indigo-400" /> :
                           selectedUnit.type === 'CAMPUS' ? <Building2 className="w-6 h-6 text-indigo-400" /> :
                           <Layers className="w-6 h-6 text-indigo-400" />}
                       </div>
                       <button onClick={() => setSelectedUnit(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5">
                          <X className="w-4 h-4 text-slate-400" />
                       </button>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight mb-1">{selectedUnit.name}</h2>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">{selectedUnit.type} Inspector</p>

                    <div className="space-y-6 flex-1">
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                             <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Administrative Head</label>
                             <p className="text-sm font-bold text-white">{selectedUnit.head || 'Unassigned'}</p>
                          </div>
                          <div>
                             <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Members</label>
                             <p className="text-sm font-bold text-white">{selectedUnit.count || 0}</p>
                          </div>
                       </div>

                       <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Direct Sub-Units</label>
                          <div className="space-y-2">
                             {selectedUnit.children ? selectedUnit.children.map(child => (
                               <div key={child.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                  <div className="flex items-center gap-3">
                                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                     <span className="text-xs font-semibold text-slate-200">{child.name}</span>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                               </div>
                             )) : <p className="text-[10px] text-slate-500 italic">No direct descendants found.</p>}
                          </div>
                       </div>
                    </div>

                    <div className="mt-10 flex gap-3">
                       <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md">
                          Manage Unit <ArrowUpRight className="w-3.5 h-3.5" />
                       </button>
                       <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5">
                          <Settings className="w-4 h-4 text-slate-400" />
                       </button>
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                    <LayoutGrid className="w-64 h-64 rotate-12" />
                 </div>
               </motion.div>
             ) : (
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center border-dashed">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100">
                     <Layers className="w-8 h-8 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Unit Inspector</h3>
                  <p className="text-xs font-semibold text-slate-400 max-w-[240px] mx-auto leading-relaxed uppercase tracking-widest">
                     Select an organizational unit from the institutional tree to view its detailed structural context.
                  </p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
