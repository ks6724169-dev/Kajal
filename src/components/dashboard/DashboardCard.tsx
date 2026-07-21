import React from 'react';
import { motion } from 'motion/react';
import { Grip, Trash2 } from 'lucide-react';

interface DashboardCardProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onRemove?: () => void;
  onPin?: () => void;
  isPinned?: boolean;
  className?: string;
  dragHandleClass?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  id,
  title,
  icon,
  children,
  onRemove,
  onPin,
  isPinned = false,
  className = '',
  dragHandleClass = 'drag-handle'
}) => {
  return (
    <motion.div
      layout
      id={`widget-card-${id}`}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden h-full ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 select-none">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded transition ${dragHandleClass}`}>
            <Grip className="w-3.5 h-3.5" />
          </div>
          {icon && <div className="text-indigo-500 dark:text-indigo-400 flex items-center">{icon}</div>}
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider truncate">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-1.5">
          {onPin && (
            <button
              onClick={onPin}
              title={isPinned ? "Unpin widget" : "Pin widget"}
              className={`p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition ${isPinned ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              <svg className="w-3.5 h-3.5" fill={isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              title="Hide widget"
              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto max-h-[420px]">
        {children}
      </div>
    </motion.div>
  );
};
