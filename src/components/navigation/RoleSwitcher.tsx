import React, { useState, useRef, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import { useWorkspace } from '../../hooks/useWorkspace';
import { RoleResolver } from '../../core/RoleResolver';
import { ShieldAlert, ChevronDown, Check, UserCheck, RefreshCw } from 'lucide-react';
import { Role } from '../../types';

interface RoleSwitcherProps {
  language?: string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ language = 'en' }) => {
  const { currentRole, originalRole, changeRole } = useRole();
  const { availableWorkspaces } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchableRoles = RoleResolver.getSwitchableRoles(originalRole);

  // If user cannot switch to any roles, do not render switcher
  if (switchableRoles.length <= 1) {
    return null;
  }

  const currentMeta = RoleResolver.getMeta(currentRole);
  const originalMeta = RoleResolver.getMeta(originalRole);
  const isSimulating = currentRole !== originalRole;

  const handleSwitch = (role: Role) => {
    changeRole(role);
    setIsOpen(false);
    
    // Broadcast dynamic reload to ensure portals adapt
    const event = new CustomEvent('galaxy-toast', {
      detail: { 
        text: `✓ Switched workspace view to: ${RoleResolver.getMeta(role).label}`, 
        type: 'success' 
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div ref={dropdownRef} id="enterprise-role-switcher" className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
          isSimulating
            ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/70 animate-pulse'
            : 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100 text-indigo-700'
        }`}
      >
        <ShieldAlert className={`h-4 w-4 shrink-0 ${isSimulating ? 'text-amber-500' : 'text-indigo-500'}`} />
        <div className="text-left leading-none max-w-[120px] truncate hidden sm:block">
          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">
            {isSimulating ? 'Acting Workspace' : 'Workspace'}
          </p>
          <span className="font-extrabold block truncate">
            {language === 'hi' ? currentMeta.hindiLabel : currentMeta.label}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden py-1">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {language === 'hi' ? 'भूमिका स्विच करें' : 'Switch Workspace'}
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {language === 'hi' 
                ? `मूल क्रेडेंशियल्स: ${originalMeta.hindiLabel}` 
                : `Verified Credential: ${originalMeta.label}`}
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {switchableRoles.map((role) => {
              const meta = RoleResolver.getMeta(role);
              const isActive = currentRole === role;
              
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSwitch(role)}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-50/60 text-indigo-700' 
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <p className="font-bold truncate">
                      {language === 'hi' ? meta.hindiLabel : meta.label}
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                      {meta.category} Class
                    </p>
                  </div>
                  {isActive && <Check className="h-4 w-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {isSimulating && (
            <div className="border-t border-slate-100 p-2 bg-amber-50/30">
              <button
                type="button"
                onClick={() => handleSwitch(originalRole)}
                className="w-full py-1.5 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 text-[10px] font-extrabold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>
                  {language === 'hi' ? 'सिमुलेशन समाप्त करें' : 'Terminate Simulation'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
