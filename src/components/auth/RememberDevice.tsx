import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface RememberDeviceProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  deviceName: string;
  onDeviceNameChange: (name: string) => void;
}

export const RememberDevice: React.FC<RememberDeviceProps> = ({
  checked,
  onChange,
  deviceName,
  onDeviceNameChange
}) => {
  return (
    <div id="remember-device-container" className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3 space-y-2.5">
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          id="remember-device-checkbox"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <div className="text-xs">
          <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Trust this device for 30 days
          </span>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Bypass multi-factor challenges on this browser for subsequent logins.
          </p>
        </div>
      </label>

      {checked && (
        <div className="space-y-1 pl-6">
          <label htmlFor="device-name-input" className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Device Custom Label:
          </label>
          <input
            id="device-name-input"
            type="text"
            value={deviceName}
            onChange={(e) => onDeviceNameChange(e.target.value)}
            placeholder="e.g. Work Laptop, Home iMac"
            className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );
};
