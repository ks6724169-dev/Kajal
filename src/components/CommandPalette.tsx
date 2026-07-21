import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Monitor, Moon, Sun, Languages, ArrowRight, Star, Settings } from 'lucide-react';
import { useStore } from '../stores/StoreContext';
import { getTranslation } from '../theme/translations';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    theme,
    setTheme,
    language,
    setLanguage,
    favorites,
    toggleFavorite
  } = useStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command list
  const commands = [
    { id: 'dashboard', title: getTranslation(language, 'dashboard'), category: 'Navigation', action: () => { window.dispatchEvent(new CustomEvent('nav-to', { detail: 'dashboard' })); } },
    { id: 'ai-hub', title: getTranslation(language, 'aiWorkspace'), category: 'Navigation', action: () => { window.dispatchEvent(new CustomEvent('nav-to', { detail: 'ai_hub' })); } },
    { id: 'students', title: getTranslation(language, 'studentsPortal'), category: 'Navigation', action: () => { window.dispatchEvent(new CustomEvent('nav-to', { detail: 'students' })); } },
    { id: 'fees', title: getTranslation(language, 'feeManagement'), category: 'Navigation', action: () => { window.dispatchEvent(new CustomEvent('nav-to', { detail: 'fees' })); } },
    { id: 'theme-light', title: getTranslation(language, 'lightMode'), category: 'Theme', action: () => setTheme('light') },
    { id: 'theme-dark', title: getTranslation(language, 'darkMode'), category: 'Theme', action: () => setTheme('dark') },
    { id: 'theme-contrast', title: getTranslation(language, 'highContrast'), category: 'Theme', action: () => setTheme('high-contrast') },
    { id: 'lang-en', title: 'English Language', category: 'Language', action: () => setLanguage('en') },
    { id: 'lang-hi', title: 'हिन्दी भाषा (Hindi)', category: 'Language', action: () => setLanguage('hi') }
  ];

  // Filter commands
  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Handle keys when palette is open
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setCommandPaletteOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  // Focus input on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ y: -20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, scale: 0.98, opacity: 0 }}
            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden z-10"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={getTranslation(language, 'searchPlaceholder')}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm outline-none focus:ring-0"
              />
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded px-1.5 py-0.5">ESC</span>
            </div>

            <div className="max-h-[300px] overflow-y-auto py-2">
              {filteredCommands.length > 0 ? (
                Object.entries(
                  filteredCommands.reduce((acc, cmd) => {
                    if (!acc[cmd.category]) acc[cmd.category] = [];
                    acc[cmd.category].push(cmd);
                    return acc;
                  }, {} as Record<string, typeof commands>)
                ).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20">
                      {category}
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                      {items.map((cmd) => {
                        const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                        const isSelected = globalIndex === selectedIndex;
                        return (
                          <div
                            key={cmd.id}
                            onClick={() => {
                              cmd.action();
                              setCommandPaletteOpen(false);
                              setQuery('');
                            }}
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                            }`}
                          >
                            <div className="flex items-center space-x-3 text-xs">
                              <ArrowRight className={`h-3.5 w-3.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                              <span>{cmd.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase">{cmd.category}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No matching commands found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
