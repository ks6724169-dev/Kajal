import React, { useState } from 'react';
import { useStore } from '../../stores/StoreContext';
import { Bell, Check, Trash2, Filter, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export const NotificationWidget: React.FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotis = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Info className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header controls */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800/40">
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setFilter('all')}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${filter === 'all' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
          >
            All ({notifications.length})
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${filter === 'unread' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
        </div>
        <button 
          onClick={clearNotifications}
          className="text-[10px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition"
        >
          <Trash2 className="w-3 h-3" /> Clear All
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-2 flex-1 max-h-[300px] overflow-y-auto pr-1">
        {filteredNotis.length > 0 ? (
          filteredNotis.map((n) => (
            <div 
              key={n.id} 
              className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors ${
                n.read 
                  ? 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/10 dark:border-slate-950 opacity-70' 
                  : 'bg-white border-indigo-100 dark:bg-slate-900/40 dark:border-indigo-950/20 shadow-xs'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1.5">
                  <h4 className={`text-xs font-bold leading-tight ${n.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[8px] font-mono font-medium text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight mt-0.5">{n.message}</p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markNotificationAsRead(n.id)}
                  title="Mark as read"
                  className="p-1 rounded-md bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 shrink-0 transition"
                >
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-[11px] text-slate-400 font-medium">
            No active alerts or notifications.
          </div>
        )}
      </div>
    </div>
  );
};
