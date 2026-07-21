import React from 'react';
import { Power, Globe, Terminal } from 'lucide-react';
import { ActiveSession } from '../../services/SessionManager';

interface SessionCardProps {
  session: ActiveSession;
  onTerminate: (id: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onTerminate }) => {
  return (
    <div id={`session-card-${session.id}`} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <Globe className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="text-xs">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
              {session.deviceName}
            </h4>
            {session.isCurrent && (
              <span className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 px-1.5 py-0.5 rounded text-[9px] font-medium">
                Current Session
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
            {session.browser} ({session.os}) • {session.ipAddress}
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5 flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            {session.location} • {session.lastActive}
          </p>
        </div>
      </div>
      {!session.isCurrent && (
        <button
          id={`terminate-btn-${session.id}`}
          type="button"
          onClick={() => onTerminate(session.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 flex items-center gap-1 text-[11px]"
          title="Terminate active session"
        >
          <Power className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
          <span className="hidden sm:inline">Terminate</span>
        </button>
      )}
    </div>
  );
};
