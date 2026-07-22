import React from 'react';
import { motion } from 'motion/react';
import earthImg from '../../../../assets/earth.png';

export const GalaxyScene: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Central Blue Atmospheric Earth Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-r from-cyan-500/30 via-indigo-500/25 to-blue-600/30 blur-[90px] z-0"
      />
      
      {/* Orbiting Container for Earth */}
      <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] flex items-center justify-center">
        
        {/* Outer Orbiting Glowing Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-cyan-400/30 rounded-full scale-[1.25] border-dashed shadow-[0_0_30px_rgba(34,211,238,0.2)]"
        />
        
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-indigo-400/20 rounded-full scale-[1.5] rotate-[-20deg]"
        />

        {/* 3D Earth Planet Center Display */}
        <motion.div 
          animate={{ scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full shadow-[0_0_90px_rgba(59,130,246,0.45)] z-20 overflow-hidden border-2 border-cyan-300/40 bg-slate-950 flex items-center justify-center group"
        >
          <motion.img 
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            src={earthImg} 
            alt="Global Earth Network" 
            className="w-full h-full object-cover scale-110 filter drop-shadow-2xl"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== '/earth.png') {
                target.src = '/earth.png';
              }
            }}
          />

          {/* Atmosphere Highlight Layer */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-900/40 via-transparent to-cyan-300/30 pointer-events-none" />
        </motion.div>

        {/* Orbiting Satellites / Data Nodes around Earth */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 12 + i * 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div 
              className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,1)] border-2 border-white" 
              style={{ 
                top: '0', 
                left: '50%', 
                transform: `translate(-50%, -50%) scale(${0.7 + (i % 3) * 0.2})` 
              }} 
            />
          </motion.div>
        ))}
      </div>

      {/* Floating UI Cards */}
      <motion.div 
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 p-4 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-2xl z-30"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[11px] font-black text-indigo-900 dark:text-cyan-400 uppercase tracking-widest">Real-time Global Analytics</span>
          </div>
          <div className="flex items-end gap-1.5 h-8">
            {[45, 75, 55, 95, 65, 85].map((h, i) => (
              <motion.div 
                key={i}
                animate={{ height: [`${h}%`, `${Math.min(h + 15, 100)}%`, `${h}%`] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-sm"
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [15, -15, 15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 p-4 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-2xl z-30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"
            />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1 uppercase tracking-wider">Global Galaxy Node</p>
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">EARTH SYNCING ACTIVE...</p>
          </div>
        </div>
      </motion.div>

      {/* Background Star Field */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity, 
              delay: Math.random() * 4 
            }}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>
    </div>
  );
};

