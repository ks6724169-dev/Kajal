import React from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  language?: string;
  onNavigate: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ language = 'en', onNavigate }) => {
  const { breadcrumbs } = useNavigation();

  return (
    <nav id="workspace-breadcrumb-nav" className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const label = language === 'hi' && item.hindiLabel ? item.hindiLabel : item.label;

        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
            
            {isLast ? (
              <span className="text-slate-900 font-extrabold truncate max-w-[160px] sm:max-w-none">
                {label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => item.path && onNavigate(item.path)}
                className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer shrink-0"
              >
                {index === 0 && <Home className="h-3.5 w-3.5 text-indigo-500" />}
                <span>{label}</span>
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
