import React from 'react';
import { useRole } from '../../hooks/useRole';
import { NavigationResolver } from '../../core/NavigationResolver';
import { HelpCircle } from 'lucide-react';

interface RoleMenuProps {
  language?: string;
  onNavigate: (path: string) => void;
  className?: string;
}

export const RoleMenu: React.FC<RoleMenuProps> = ({
  language = 'en',
  onNavigate,
  className = ''
}) => {
  const { currentRole } = useRole();
  const menuItems = NavigationResolver.resolveNavigationForRole(currentRole);

  return (
    <div id="dynamic-role-menu" className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm ${className}`}>
      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
        {language === 'hi' ? 'वर्कस्पेस नेविगेशन' : 'Workspace Navigation'}
      </h3>
      <div className="space-y-1">
        {menuItems.map((item) => {
          const titleLabel = language === 'hi' && item.hindiTitle ? item.hindiTitle : item.title;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.path)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition duration-150 cursor-pointer"
            >
              <span>{titleLabel}</span>
              {item.badge && (
                <span className="text-[9px] bg-indigo-500/10 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
        {menuItems.length === 0 && (
          <p className="text-xs text-slate-400 italic">
            {language === 'hi' ? 'कोई नेविगेशन उपलब्ध नहीं है' : 'No navigation available'}
          </p>
        )}
      </div>
    </div>
  );
};
