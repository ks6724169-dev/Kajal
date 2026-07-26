import React, { useState } from 'react';
import { Building, MapPin, ChevronDown, Check } from 'lucide-react';

interface CampusSwitcherProps {
  currentCampus: string;
  onChange: (campus: string) => void;
  campuses: any[];
}

export const CampusSwitcher: React.FC<CampusSwitcherProps> = ({ currentCampus, onChange, campuses }) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayCampuses = [
    { id: 'all', name: 'All Campuses', status: 'aggregate', location: 'Global View' },
    ...campuses.map(c => ({
      id: c.id,
      name: c.name,
      status: 'healthy',
      location: c.address?.city || 'Campus Location'
    }))
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 h-8.5 px-2.5 sm:px-3 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/80 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
        title="Switch Active Campus"
      >
        <Building className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-xs font-bold text-slate-800 tracking-tight max-w-[90px] sm:max-w-[130px] truncate hidden sm:inline">
          {currentCampus}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-fade-in">
          <div className="p-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Campus Context</span>
            <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
              {displayCampuses.length} Campuses
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {displayCampuses.map((campus) => {
              const isSelected = currentCampus === campus.name;
              return (
                <button
                  key={campus.id}
                  onClick={() => { onChange(campus.name); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    isSelected ? 'bg-indigo-50/80 text-indigo-900 font-bold' : 'hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className={`text-xs ${isSelected ? 'font-black text-indigo-950' : 'font-bold text-slate-800'}`}>
                      {campus.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] font-medium text-slate-400 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{campus.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {campus.status === 'healthy' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-2xs"></div>}
                    {campus.status === 'warning' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-2xs"></div>}
                    {campus.status === 'critical' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-2xs"></div>}
                    {campus.status === 'aggregate' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-2xs"></div>}
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
