import React from 'react';

interface GalaxyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textClassName?: string;
  className?: string;
  imgClassName?: string;
  variant?: 'light' | 'dark' | 'auto';
  subtitle?: string;
  onClick?: () => void;
}

export const GalaxyLogo: React.FC<GalaxyLogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = '',
  className = '',
  imgClassName = '',
  variant = 'auto',
  subtitle,
  onClick
}) => {
  const sizeMap = {
    xs: { img: 'w-6 h-6', text: 'text-xs', sub: 'text-[9px]' },
    sm: { img: 'w-8 h-8', text: 'text-sm', sub: 'text-[10px]' },
    md: { img: 'w-10 h-10', text: 'text-lg', sub: 'text-[11px]' },
    lg: { img: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
    '2xl': { img: 'w-28 h-28', text: 'text-4xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`relative shrink-0 flex items-center justify-center overflow-hidden rounded-[1.25rem] bg-white shadow-sm border border-slate-200/50 p-1.5 ${currentSize.img} ${imgClassName}`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full fill-none group-hover:scale-110 transition-transform duration-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          {/* Main Logo Mark */}
          <circle cx="50" cy="50" r="40" stroke="url(#logo-gradient)" strokeWidth="12" strokeOpacity="0.1" />
          <path 
            d="M75 50C75 63.8071 63.8071 75 50 75C36.1929 75 25 63.8071 25 50C25 36.1929 36.1929 25 50 25C58.2843 25 65.7843 29.0294 70.4142 35.5" 
            stroke="url(#logo-gradient)" 
            strokeWidth="12" 
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
          <path 
            d="M75 50H55" 
            stroke="url(#logo-gradient)" 
            strokeWidth="12" 
            strokeLinecap="round"
          />
          {/* Orbital Accent */}
          <ellipse 
            cx="50" cy="50" rx="45" ry="12" 
            stroke="url(#logo-gradient)" 
            strokeWidth="2" 
            strokeOpacity="0.3"
            transform="rotate(-30 50 50)"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${currentSize.text} ${
              variant === 'dark' 
                ? 'text-white' 
                : variant === 'light' 
                  ? 'text-slate-900' 
                  : 'text-slate-900 dark:text-white'
            } ${textClassName}`}>
              Galaxy <span className="text-indigo-600 dark:text-indigo-400">ERP</span>
            </span>
          </div>
          <span className={`font-extrabold uppercase tracking-widest ${currentSize.sub} ${
            variant === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {subtitle || 'Educational Operating System'}
          </span>
        </div>
      )}
    </div>
  );
};
