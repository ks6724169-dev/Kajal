import React, { useState, useEffect } from 'react';
import { Search, Command, X, ChevronLeft, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocsHeaderProps {
  onSearch: (query: string) => void;
  navigate: (path: string) => void;
}

export const DocsHeader: React.FC<DocsHeaderProps> = ({ onSearch, navigate }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-slate-900 leading-none mb-1">
                  GALAXY ERP
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                  Documentation Center
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-all group"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-bold">Search Docs...</span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-black group-hover:border-slate-300">
                <Command className="w-2.5 h-2.5" />
                K
              </div>
            </button>

            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-black text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl border border-slate-100"
            >
              Close
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <Search className="w-6 h-6 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="What are you looking for?"
                  className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 text-lg placeholder:text-slate-300"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 bg-slate-50 flex items-center gap-6 overflow-x-auto">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Popular:</span>
                {['Registration', 'Admissions', 'Fees', 'Attendance', 'Galaxy AI'].map((tag) => (
                  <button key={tag} className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors whitespace-nowrap">
                    {tag}
                  </button>
                ))}
              </div>
              
              <div className="p-8 text-center text-slate-400">
                {query ? (
                  <p className="text-sm font-bold">Press Enter to search for "{query}"</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-widest">Recent Searches</p>
                    <div className="flex flex-col gap-2 max-w-xs mx-auto text-left">
                      <div className="px-4 py-3 bg-white rounded-xl border border-slate-100 font-bold text-slate-600 text-sm">How to register school?</div>
                      <div className="px-4 py-3 bg-white rounded-xl border border-slate-100 font-bold text-slate-600 text-sm">Galaxy AI Features</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
