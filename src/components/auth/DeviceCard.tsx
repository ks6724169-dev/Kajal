import React from 'react';
import { ShieldAlert, Laptop, Smartphone, HelpCircle, Trash2 } from 'lucide-react';
import { TrustedDevice } from '../../services/DeviceTrustService';

interface DeviceCardProps {
  device: TrustedDevice;
  onRevoke: (id: string) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onRevoke }) => {
  const getIcon = () => {
    switch (device.os.toLowerCase()) {
      case 'macos':
      case 'windows':
        return <Laptop className="h-5 w-5 text-indigo-500" />;
      case 'ios':
      case 'android':
        return <Smartphone className="h-5 w-5 text-violet-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const isExpired = new Date(device.expiresAt).getTime() < Date.now();

  return (
    <div id={`device-card-${device.id}`} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          {getIcon()}
        </div>
        <div className="text-xs">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            {device.deviceName}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
            {device.browser} on {device.os} • {device.lastUsedIp}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {isExpired ? (
              <span className="flex items-center gap-0.5 text-red-500 font-medium text-[10px]">
                <ShieldAlert className="h-3 w-3" />
                Trust Expired
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-500 font-medium text-[10px]">
                Trusted until {new Date(device.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        id={`revoke-btn-${device.id}`}
        type="button"
        onClick={() => onRevoke(device.id)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
        title="Revoke device trust"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
