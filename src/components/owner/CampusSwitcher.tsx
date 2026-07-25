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
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition cursor-pointer"
      >
        <Building className="w-4 h-4 text-indigo-600" />
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold text-slate-800 leading-tight">{currentCampus}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Select Campus</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {displayCampuses.map((campus) => (
              <button
                key={campus.id}
                onClick={() => { onChange(campus.name); setIsOpen(false); }}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-50 transition text-left cursor-pointer"
              >
                <div>
                  <div className={`text-sm font-semibold ${currentCampus === campus.name ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {campus.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>{campus.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {campus.status === 'healthy' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                  {campus.status === 'warning' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                  {campus.status === 'critical' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                  {campus.status === 'aggregate' && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                  {currentCampus === campus.name && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
