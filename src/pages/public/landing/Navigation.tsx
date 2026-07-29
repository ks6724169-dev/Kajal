import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Menu, Home } from 'lucide-react';
import { NavigationDrawer } from './NavigationDrawer';
import { useTheme } from '../../../core/theme/ThemeContext';
import { useTranslation } from '../../../core/i18n/I18nContext';

interface NavigationProps {
  onNavigate: (path: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useTheme();
  useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { name: 'Features', path: '/features' },
    { name: 'Intelligence', path: '/intelligence' },
    { name: 'Security', path: '/security' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
        <div className={`max-w-5xl mx-auto px-6 flex items-center transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-lg py-2 rounded-full px-8' : 'bg-transparent py-2'}`}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">Galaxy <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded-full">Pro</span></span>
          </div>

          <div className="hidden md:flex items-center gap-3 ml-8">
            <button onClick={() => onNavigate('/')} aria-label="Home" title="Home" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <Home className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-slate-200" />
            {features.map((item) => (
              <button key={item.name} onClick={() => onNavigate(item.path)} className="text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
                {item.name}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button onClick={() => onNavigate('/login')} className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all active:scale-95">Sign In</button>
            <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors md:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open menu"><Menu className="w-5 h-5" /></button>
          </div>
        </div>
      </motion.nav>

      <NavigationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={onNavigate} />
    </>
  );
};
