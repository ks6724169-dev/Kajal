import React from 'react';
import logoAsset from '../../assets/galaxy-logo.png';

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

  const logoSrc = logoAsset || '/galaxy-logo.png';

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`relative shrink-0 flex items-center justify-center overflow-hidden rounded-2xl bg-white/90 shadow-md shadow-indigo-500/15 border border-slate-200/80 p-0.5 ${currentSize.img} ${imgClassName}`}>
        <img 
          src={logoSrc} 
          alt="Galaxy ERP Logo" 
          className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to /galaxy-logo.png if asset import fails
            const target = e.target as HTMLImageElement;
            if (target.src !== '/galaxy-logo.png') {
              target.src = '/galaxy-logo.png';
            }
          }}
        />
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
