import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export const GalaxyScene: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Central Core Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-[120px] z-0"
      />
      
      {/* Inner Rotating Core */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="relative w-[300px] h-[300px] flex items-center justify-center"
      >
        {/* Core Icon */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-[0_0_80px_rgba(79,70,229,0.4)] z-20"
        >
          <div className="w-full h-full bg-slate-900 rounded-[2.4rem] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Orbiting Rings */}
        <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full scale-[1.2] rotate-[30deg] border-dashed" />
        <div className="absolute inset-0 border-2 border-purple-500/10 rounded-full scale-[1.5] rotate-[-20deg]" />
        
        {/* Orbiting Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div 
              className="absolute w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]" 
              style={{ 
                top: '0', 
                left: '50%', 
                transform: `translate(-50%, -50%) scale(${0.5 + Math.random()})` 
              }} 
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Floating UI Elements (representing the "Intelligence" of Galaxy) */}
      <motion.div 
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 p-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-30"
      >
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Real-time Analytics</span>
          <div className="flex items-end gap-1 h-8">
            {[40, 70, 50, 90, 60].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${h}%`, `${Math.min(h + 20, 100)}%`, `${h}%`] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 bg-indigo-500/50 rounded-t-sm"
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-10 p-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full"
            />
          </div>
          <div>
            <p className="text-xs font-black text-white leading-none mb-1 uppercase tracking-wider">Galaxy Node</p>
            <p className="text-[10px] font-bold text-emerald-400">SYNCING...</p>
          </div>
        </div>
      </motion.div>

      {/* Background Star Field */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>

      {/* Decorative Galaxy Spirals (CSS based) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-indigo-500/10 rounded-full rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-purple-500/10 rounded-full -rotate-12" />
      </div>
    </div>
  );
};
