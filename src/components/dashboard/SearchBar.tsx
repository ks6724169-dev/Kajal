import React, { useState, useRef, useEffect } from 'react';
import { Search, Command, ArrowRight, User, BookOpen, CreditCard, Bus } from 'lucide-react';
import { useStore } from '../../stores/StoreContext';

export const SearchBar: React.FC = () => {
  const { setCommandPaletteOpen, language } = useStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Static searchable database simulating universal search
  const searchableData = [
    { name: 'Aarav Sharma', category: 'Students', type: 'student', details: 'Grade 11-B • Roll 12 • Fee Paid', icon: <User className="w-3.5 h-3.5 text-blue-500" /> },
    { name: 'Dr. Rajesh Sharma', category: 'Teachers', type: 'teacher', details: 'HOD Math • employee-102 • Active', icon: <User className="w-3.5 h-3.5 text-violet-500" /> },
    { name: 'Advanced Calculus', category: 'Books', type: 'book', details: 'ISBN 98321 • 3 Copies available', icon: <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> },
    { name: 'Route #4 Sector 12', category: 'Transit Buses', type: 'bus', details: 'Bus DL-1C-5420 • Driver Ram • On Time', icon: <Bus className="w-3.5 h-3.5 text-rose-500" /> },
    { name: 'Invoice #GXY-2026-942', category: 'Finance', type: 'invoice', details: 'Amount ₹45,000 • Paid via UPI GPay', icon: <CreditCard className="w-3.5 h-3.5 text-teal-500" /> },
  ];

  const results = query.trim() === ''
    ? []
    : searchableData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.details.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-30">
      {/* Search Input Box */}
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-150 group cursor-text"
      >
        <Search className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Search students, teachers, books, vehicles, invoices..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs outline-none focus:ring-0 font-medium"
        />
        
        {/* Hotkey Reminder */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCommandPaletteOpen(true);
          }}
          className="flex items-center space-x-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 px-2 py-1 rounded-lg transition shrink-0 select-none border border-slate-200/40 dark:border-slate-700/30"
          title="Open command center"
        >
          <Command className="w-3 h-3" />
          <span>K</span>
        </button>
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden py-1.5 max-h-80 overflow-y-auto">
          <div className="px-4 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20">
            Search Matches ({results.length})
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
            {results.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2 bg-slate-100/50 dark:bg-slate-800 rounded-lg shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-tight mt-0.5 truncate">{item.details}</p>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.trim() !== '' && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 text-center text-xs text-slate-400">
          No matches found for <strong className="text-slate-700 dark:text-slate-300">"{query}"</strong>. Try searching "Aarav" or "Calculus".
        </div>
      )}
    </div>
  );
};
