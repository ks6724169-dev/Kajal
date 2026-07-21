import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play, ChevronRight, Building2, Users, UserSquare, Globe, MessageSquare, X, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../core/i18n/I18nContext';
import { GalaxyScene } from './components/GalaxyScene';

export const HeroSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [chatOpen, setChatOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const { t } = useTranslation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-white dark:bg-slate-950 transition-colors">
      {/* Premium Background Gradients & Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-gradient-to-br from-indigo-100/80 dark:from-indigo-900/20 to-purple-50/80 dark:to-purple-900/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-gradient-to-bl from-cyan-100/80 dark:from-cyan-900/20 to-blue-50/80 dark:to-blue-900/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] rounded-full bg-gradient-to-tr from-purple-100/60 dark:from-purple-900/20 to-indigo-50/60 dark:to-indigo-900/10 blur-[100px]" />
        
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-10" />

        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute w-1.5 h-1.5 bg-indigo-500 rounded-full blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Side: Copy & Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl relative z-20"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md mb-8 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-300 tracking-widest uppercase">AI Powered School ERP</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-[4.5rem] font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
              {t('hero.title').split(' ').map((word, i) => i === 3 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">{word} </span> : word + ' ')}
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10 max-w-lg">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => onNavigate('/register')}
                className="group relative px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold text-sm overflow-hidden transition-all hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative">{t('cta.getStarted')}</span>
                <ChevronRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => onNavigate('/demo')}
                className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-bold text-sm border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                {t('cta.bookDemo')}
              </button>
            </div>
          </motion.div>

          {/* Right Side: Real Galaxy 3D Live Scene */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="relative flex items-center justify-center z-10 w-full h-[500px] lg:h-[600px]"
            style={{ y: y1 }}
          >
            <GalaxyScene />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Floating Galaxy AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Galaxy AI</h4>
                    <p className="text-xs text-indigo-200">Online</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-64 p-4 bg-slate-50 flex flex-col justify-end">
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 w-11/12">
                  <p className="text-sm text-slate-600 font-medium">Hello! How can I help you explore Galaxy ERP today?</p>
                </div>
              </div>
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="h-10 bg-slate-50 rounded-full border border-slate-200 flex items-center px-4">
                  <span className="text-sm text-slate-400">Type your message...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {chatOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageSquare className="w-6 h-6 relative z-10" />}
          
          {/* Notification Dot */}
          {!chatOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          )}
        </motion.button>
      </div>

    </div>
  );
};



