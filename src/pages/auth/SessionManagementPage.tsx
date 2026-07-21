import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, LogOut, Terminal, ShieldAlert, RefreshCw, Smartphone, Laptop } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { SessionCard } from '../../components/auth/SessionCard';
import { DeviceTrustService } from '../../services/DeviceTrustService';
import { DeviceCard } from '../../components/auth/DeviceCard';

interface SessionManagementPageProps {
  navigate: (path: string) => void;
}

export const SessionManagementPage: React.FC<SessionManagementPageProps> = ({ navigate }) => {
  const {
    activeSessions,
    isLoading,
    concurrentSessionDetected,
    loadSessions,
    terminateSession,
    terminateOtherSessions,
    setConcurrentSessionDetected
  } = useSession();

  const [trustedDevices, setTrustedDevices] = React.useState<any[]>([]);

  useEffect(() => {
    loadSessions();
    loadTrusted();
  }, []);

  const loadTrusted = async () => {
    const list = await DeviceTrustService.getTrustedDevices();
    setTrustedDevices(list);
  };

  const handleRevokeDevice = async (id: string) => {
    await DeviceTrustService.revokeDevice(id);
    loadTrusted();
  };

  const handleRefresh = () => {
    loadSessions();
    loadTrusted();
  };

  return (
    <div id="session-management-page" className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-50 flex items-center gap-2">
              <ShieldCheck className="h-5.5 w-5.5 text-indigo-500" />
              Session & Device Safety Control
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Inspect active login locations, terminate redundant sessions, or revoke trusted web cookies.
            </p>
          </div>
          <button
            id="refresh-sessions-btn"
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-all duration-150 shrink-0 font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Logs
          </button>
        </div>

        {concurrentSessionDetected && (
          <div id="concurrent-session-banner" className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-3.5 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-red-800 dark:text-red-400">Concurrent Sessions Warning</h4>
              <p className="text-red-600 dark:text-red-500 mt-1 font-medium">
                Our network filters detected concurrent logins from another location. We recommend terminating all other sessions immediately.
              </p>
              <button
                id="ack-concurrent-btn"
                type="button"
                onClick={() => setConcurrentSessionDetected(false)}
                className="mt-2 text-[10px] bg-red-100 hover:bg-red-200 dark:bg-red-950 text-red-800 dark:text-red-300 px-2 py-1 rounded font-bold transition-all duration-150"
              >
                Acknowledge Threat
              </button>
            </div>
          </div>
        )}

        {/* Sessions Module */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Active Web Sessions:</span>
            {activeSessions.length > 1 && (
              <button
                id="terminate-all-btn"
                type="button"
                onClick={terminateOtherSessions}
                className="text-red-500 hover:underline normal-case font-bold flex items-center gap-1 text-[11px]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Terminate All Others
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
            </div>
          ) : activeSessions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No active sessions located.</p>
          ) : (
            <div className="space-y-2">
              {activeSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onTerminate={terminateSession}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trusted Devices Module */}
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Trusted Devices (30-Days Bypass):
          </h3>

          {trustedDevices.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/10">
              <p className="text-xs text-slate-400 font-medium">
                No browsers have been configured as trusted bypass yet.
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Check "Trust this device" during credential sign-ins to configure.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {trustedDevices.map((dev) => (
                <DeviceCard
                  key={dev.id}
                  device={dev}
                  onRevoke={handleRevokeDevice}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
          <button
            id="sessions-back-btn"
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            ← Back to Enterprise Dashboard
          </button>
          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            Secure Session Ingress Enabled
          </span>
        </div>
      </motion.div>
    </div>
  );
};
