import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 transition-colors">
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20"
        >
          <BrainCircuit className="w-10 h-10" />
        </motion.div>
        <div className="space-y-3 text-center">
          <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
            Loading Experience...
          </p>
          <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
