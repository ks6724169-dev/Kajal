import React, { useState } from 'react';
import { Bell, CheckCheck, Filter, ShieldAlert, CreditCard, GraduationCap, CheckCircle2, ArrowLeft } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'security' | 'finance' | 'academic' | 'important';
  read: boolean;
  targetModule: string;
}

interface NotificationsCenterProps {
  onNavigate?: (path: string) => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'security' | 'finance' | 'academic'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'MFA Hardening Verification Active',
      message: 'All organization owner identities require AAL2 Multi-Factor authentication enrollment.',
      timestamp: 'Just now',
      type: 'security',
      read: false,
      targetModule: 'security'
    },
    {
      id: 'n2',
      title: 'Database Security RLS Check complete',
      message: 'Successfully audited Row-Level Security isolation across multiple campuses.',
      timestamp: '15 mins ago',
      type: 'security',
      read: false,
      targetModule: 'security'
    },
    {
      id: 'n3',
      title: 'Quarterly Fees Invoicing Dispatched',
      message: 'Consolidated fee collection schedule of academic session generated.',
      timestamp: '2 hours ago',
      type: 'finance',
      read: true,
      targetModule: 'fees'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'security') return n.type === 'security';
    if (filter === 'finance') return n.type === 'finance';
    if (filter === 'academic') return n.type === 'academic';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'security': return <ShieldAlert className="w-5 h-5 text-indigo-600" />;
      case 'finance': return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'academic': return <GraduationCap className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Notifications Center</h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">
                {notifications.filter(n => !n.read).length} Unread
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time enterprise alerts & system logs</p>
          </div>
        </div>

        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        {(['all', 'unread', 'security', 'finance', 'academic'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap cursor-pointer ${
              filter === tab
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">No notifications found in this view.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div 
              key={item.id}
              className={`p-4 rounded-2xl border transition flex items-start gap-4 ${
                item.read 
                  ? 'bg-white border-slate-200' 
                  : 'bg-indigo-50/40 border-indigo-200/80 shadow-xs'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-100 shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-bold ${item.read ? 'text-slate-800' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                <div className="flex items-center gap-3 mt-3">
                  {onNavigate && item.targetModule && (
                    <button 
                      onClick={() => onNavigate(item.targetModule)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                    >
                      Open Module &rarr;
                    </button>
                  )}
                  <button 
                    onClick={() => toggleRead(item.id)}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600 transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.read ? 'Mark unread' : 'Mark read'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
