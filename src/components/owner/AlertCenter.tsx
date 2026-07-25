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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-600" />
          Smart Alert Center
        </h3>
        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">2 Critical</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              onClick={() => {
                const event = new CustomEvent('galaxy-toast', { detail: { text: `Viewing alert: ${alert.text}`, type: alert.type === 'critical' ? 'error' : 'info' }});
                window.dispatchEvent(event);
              }}
              className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${getAlertStyles(alert.type)}`}
            >
              <div className="mt-0.5">
                {/* Dynamic icon mapping */}
                {alert.icon === 'UserX' ? <UserX className={`w-4 h-4 ${getIconColor(alert.type)}`} /> : alert.icon === 'Info' ? <Info className={`w-4 h-4 ${getIconColor(alert.type)}`} /> : alert.icon === 'CreditCard' ? <CreditCard className={`w-4 h-4 ${getIconColor(alert.type)}`} /> : alert.icon === 'ShieldAlert' ? <ShieldAlert className={`w-4 h-4 ${getIconColor(alert.type)}`} /> : <AlertCircle className={`w-4 h-4 ${getIconColor(alert.type)}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug">{alert.text}</p>
                <p className={`text-[10px] mt-1 font-semibold uppercase tracking-wider opacity-70`}>{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
        <button 
          onClick={() => {
            const event = new CustomEvent('galaxy-toast', { detail: { text: 'Notification center opened', type: 'info' }});
            window.dispatchEvent(event);
          }}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
        >
          View All Alerts
        </button>
      </div>
    </div>
  );
};
