import React from 'react';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  accentColor: string;
  density: 'comfortable' | 'compact';
  fontSize: 'sm' | 'md' | 'lg';
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  accentColor,
  density,
  fontSize
}) => {
  // Map Brand Accent styling parameters
  const accentBorderClass = {
    indigo: 'focus-within:ring-indigo-500/20 hover:border-indigo-200 dark:hover:border-indigo-900/60 text-indigo-600 dark:text-indigo-400',
    emerald: 'focus-within:ring-emerald-500/20 hover:border-emerald-200 dark:hover:border-emerald-900/60 text-emerald-600 dark:text-emerald-400',
    violet: 'focus-within:ring-violet-500/20 hover:border-violet-200 dark:hover:border-violet-900/60 text-violet-600 dark:text-violet-400',
    rose: 'focus-within:ring-rose-500/20 hover:border-rose-200 dark:hover:border-rose-900/60 text-rose-600 dark:text-rose-400',
    amber: 'focus-within:ring-amber-500/20 hover:border-amber-200 dark:hover:border-amber-900/60 text-amber-600 dark:text-amber-400',
  }[accentColor] || 'focus-within:ring-indigo-500/20 text-indigo-600';

  // Map spacing density parameters
  const densityClass = {
    comfortable: 'p-6 space-y-6 max-w-7xl mx-auto md:p-8',
    compact: 'p-4 space-y-4 max-w-7xl mx-auto md:p-5'
  }[density];

  // Map typography sizing parameters
  const fontSizeClass = {
    sm: 'text-xs select-none antialiased font-sans prose-sm',
    md: 'text-sm select-none antialiased font-sans prose-base',
    lg: 'text-base select-none antialiased font-sans prose-lg'
  }[fontSize];

  return (
    <div className={`${fontSizeClass} ${accentBorderClass} min-h-full transition-all duration-150`}>
      <div className={densityClass}>
        {children}
      </div>
    </div>
  );
};
export default WorkspaceLayout;
