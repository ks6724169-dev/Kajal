import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Menu, Sun, Moon, Globe } from 'lucide-react';
import { NavigationDrawer } from './NavigationDrawer';
import { useTheme } from '../../../core/theme/ThemeContext';
import { useTranslation } from '../../../core/i18n/I18nContext';

interface NavigationProps {
  onNavigate: (path: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/20 shadow-sm py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 transition-colors">
              GALAXY <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">ERP</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-slate-800 transition-colors">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button 
                onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {resolvedTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>

            <button 
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => setDrawerOpen(true)}
            >
              <span className="hidden md:block font-bold text-sm tracking-widest">MENU</span>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      <NavigationDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        onNavigate={onNavigate} 
      />
    </>
  );
};
