import React from 'react';
import { AlertCircle, ShieldAlert, CreditCard, UserX, Clock, MessageSquare, Info } from 'lucide-react';

interface AlertCenterProps {
  onNavigate: (path: string) => void;
  stats?: any;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ onNavigate, stats }) => {
  const alerts = stats?.alertsData || [];

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-100 text-red-700 hover:bg-red-100';
      case 'important': return 'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100';
      case 'info': return 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100';
      default: return 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600';
      case 'important': return 'text-orange-600';
      case 'info': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden h-full flex flex-col transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-700 stroke-[2.2]" />
          Smart Notification Center
        </h3>
        <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest">2 Alert</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              onClick={() => {
                const event = new CustomEvent('galaxy-toast', { detail: { text: `Viewing alert: ${alert.text}`, type: alert.type === 'critical' ? 'error' : 'info' }});
                window.dispatchEvent(event);
              }}
              className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200 flex items-start gap-3 cursor-pointer"
            >
              <div className="mt-0.5 p-1.5 bg-white rounded-lg border border-slate-100 shadow-2xs shrink-0">
                {/* Dynamic icon mapping */}
                {alert.icon === 'UserX' ? (
                  <UserX className={`w-3.5 h-3.5 ${getIconColor(alert.type)}`} />
                ) : alert.icon === 'Info' ? (
                  <Info className={`w-3.5 h-3.5 ${getIconColor(alert.type)}`} />
                ) : alert.icon === 'CreditCard' ? (
                  <CreditCard className={`w-3.5 h-3.5 ${getIconColor(alert.type)}`} />
                ) : alert.icon === 'ShieldAlert' ? (
                  <ShieldAlert className={`w-3.5 h-3.5 ${getIconColor(alert.type)}`} />
                ) : (
                  <AlertCircle className={`w-3.5 h-3.5 ${getIconColor(alert.type)}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">{alert.text}</p>
                <p className="text-[9px] mt-1 font-extrabold uppercase tracking-widest text-slate-400">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
        <button 
          onClick={() => {
            const event = new CustomEvent('galaxy-toast', { detail: { text: 'Notification center opened', type: 'info' }});
            window.dispatchEvent(event);
          }}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition cursor-pointer tracking-wide"
        >
          View All System Alerts
        </button>
      </div>
    </div>
  );
};
