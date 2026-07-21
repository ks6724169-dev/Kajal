import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  icon,
  trend,
  color = 'indigo',
  onClick
}) => {
  const colorMap: Record<string, { bg: string; text: string; lightBg: string; border: string }> = {
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      lightBg: 'bg-indigo-50 dark:bg-indigo-950/20',
      border: 'border-indigo-100 dark:border-indigo-950/40'
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-100 dark:border-emerald-950/40'
    },
    violet: {
      bg: 'bg-violet-500/10 dark:bg-violet-500/20',
      text: 'text-violet-600 dark:text-violet-400',
      lightBg: 'bg-violet-50 dark:bg-violet-950/20',
      border: 'border-violet-100 dark:border-violet-950/40'
    },
    pink: {
      bg: 'bg-pink-500/10 dark:bg-pink-500/20',
      text: 'text-pink-600 dark:text-pink-400',
      lightBg: 'bg-pink-50 dark:bg-pink-950/20',
      border: 'border-pink-100 dark:border-pink-950/40'
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      lightBg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-100 dark:border-amber-950/40'
    },
    rose: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      lightBg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-100 dark:border-rose-950/40'
    },
    cyan: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      lightBg: 'bg-cyan-50 dark:bg-cyan-950/20',
      border: 'border-cyan-100 dark:border-cyan-950/40'
    }
  };

  const selectedColor = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      id={`stat-card-${id}`}
      whileHover={onClick ? { y: -2, transition: { duration: 0.15 } } : undefined}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80' : ''
      } transition duration-150 flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</span>
          <h4 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 tracking-tight select-all">
            {value}
          </h4>
        </div>
        <div className={`p-2.5 rounded-xl ${selectedColor.bg} ${selectedColor.text}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/40">
          <span className={`inline-flex items-center text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
            trend.isPositive 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5 stroke-[3]" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5 stroke-[3]" />
            )}
            {trend.value}%
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">
            {trend.label || 'from last week'}
          </span>
        </div>
      )}
    </motion.div>
  );
};
