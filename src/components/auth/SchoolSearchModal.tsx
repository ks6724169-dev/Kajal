import React, { useState, useEffect } from 'react';
import { Search, MapPin, School, Check, X, Building2, RefreshCw } from 'lucide-react';
import { TenantResolutionService } from '../../services/TenantResolutionService';
import { Tenant } from '../../types';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tenant: Tenant) => void;
}

export const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    
    const fetchRealData = async () => {
      setIsLoading(true);
      try {
        const res = await TenantResolutionService.searchSchoolsAsync(query);
        if (isMounted) setResults(res);
      } catch (err) {
        if (isMounted) setResults([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRealData();
    return () => { isMounted = false; };
  }, [isOpen, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Find Your School</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enterprise Directory</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 bg-slate-50/50">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text"
              autoFocus
              placeholder="Search by school name, city, or school code..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-slate-900 shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="py-12 text-center">
              <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-semibold">Searching Supabase database registry...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((school) => (
              <button
                key={school.id}
                onClick={() => onSelect(school)}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-md transition-all text-left"
              >
                <div className="relative flex-shrink-0 w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {school.logo ? (
                    <img 
                      src={school.logo} 
                      alt={school.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {school.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {school.schoolCode}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3 h-3" />
                      {school.city}, {school.state}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">कोई registered school या college नहीं मिला</h3>
              <p className="text-sm text-slate-500 mt-1">No active registered institution matches your search criteria in the database.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Galaxy Enterprise Suite • Live Database Resolution Engine
          </p>
        </div>
      </div>
    </div>
  );
};
