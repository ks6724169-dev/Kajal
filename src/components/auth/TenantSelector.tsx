import React, { useState } from 'react';
import { useTenant } from '../../hooks/useTenant';
import { Building, KeyRound, Check, HelpCircle } from 'lucide-react';

interface TenantSelectorProps {
  onSelected?: (tenantId: string) => void;
}

export const TenantSelector: React.FC<TenantSelectorProps> = ({ onSelected }) => {
  const { tenants, currentTenant, selectTenant, selectTenantByCode } = useTenant();
  const [schoolCode, setSchoolCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    setCodeSuccess(false);

    if (!schoolCode.trim()) {
      setCodeError('Please fill in a tenant or school code.');
      return;
    }

    const found = await selectTenantByCode(schoolCode);
    if (found) {
      setCodeSuccess(true);
      if (onSelected && currentTenant) {
        onSelected(currentTenant.id);
      }
    } else {
      setCodeError('No school or college found with that code.');
    }
  };

  return (
    <div id="tenant-selector-component" className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Select Your Portal / Enterprise Workspace:
        </label>
        <div className="grid grid-cols-1 gap-2">
          {tenants.map((t) => {
            const isSelected = currentTenant?.id === t.id;
            return (
              <button
                key={t.id}
                id={`tenant-opt-${t.id}`}
                type="button"
                onClick={() => {
                  selectTenant(t.id);
                  if (onSelected) onSelected(t.id);
                }}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-slate-900 dark:text-slate-50'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl p-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    {t.logo || '🏢'}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold font-sans">{t.name}</h4>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {t.type} • AC Year: {t.academicYear}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Or Discovery Code</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      </div>

      <form id="tenant-code-form" onSubmit={handleCodeSubmit} className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="tenant-code-input"
              type="text"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              placeholder="Enter code (e.g., apex, galaxy, xavier)"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            id="tenant-code-submit-btn"
            type="submit"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-150 shadow-sm shrink-0"
          >
            Locate
          </button>
        </div>

        {codeError && (
          <p id="tenant-code-error" className="text-[11px] text-red-500 font-medium">
            {codeError}
          </p>
        )}
        {codeSuccess && (
          <p id="tenant-code-success" className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
            <Check className="h-3 w-3" />
            Tenant discovered and loaded!
          </p>
        )}
      </form>
    </div>
  );
};
