import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { PermissionResolver } from '../core/PermissionResolver';
import { Role } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedWorkspaceProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requiredPermissions?: string[];
  fallbackUrl?: string;
}

export const ProtectedWorkspace: React.FC<ProtectedWorkspaceProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  fallbackUrl = '/app'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { currentRole } = useRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 animate-spin">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-xs text-slate-400 font-extrabold tracking-widest uppercase animate-pulse">
          Validating Security Certificate...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-4 text-rose-500">
          <ShieldAlert className="h-10 w-10 animate-bounce" />
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Security Handshake Failure</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
          The requested operations terminal requires a verified active user context. Please authenticate to establish secure session keys.
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('nav-to', { detail: '/login' }))}
          className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          Authenticate Terminal
        </button>
      </div>
    );
  }

  // Role validation
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return (
      <div id="unauthorized-access-403" className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl m-6">
        <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 mb-5 shadow-xs">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">403 • Sovereign Boundary Violation</h2>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mt-1">Access Denied</p>
        <p className="text-xs text-slate-500 mt-3 max-w-md leading-relaxed">
          Your active workstation credentials (<strong>{currentRole.replace('_', ' ').toUpperCase()}</strong>) do not possess the digital signature authorization tokens needed to access this system.
        </p>
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('nav-to', { detail: fallbackUrl }))}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Workspace</span>
          </button>
        </div>
      </div>
    );
  }

  // Permission validation
  if (requiredPermissions) {
    const hasAll = PermissionResolver.hasPermission(currentRole, user.permissions || [], requiredPermissions);
    if (!hasAll) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl m-6">
          <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl text-amber-600 mb-5 shadow-xs">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Privilege Elevation Required</h2>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mt-1">Unauthorized Capability</p>
          <p className="text-xs text-slate-500 mt-3 max-w-md leading-relaxed">
            The target operation requires administrative permissions not assigned to your credential cluster. Please contact your tenant superintendent.
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('nav-to', { detail: fallbackUrl }))}
            className="mt-6 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
          >
            Acknowledge Protocols
          </button>
        </div>
      );
    }
  }

  return <>{children}</>;
};
export default ProtectedWorkspace;
