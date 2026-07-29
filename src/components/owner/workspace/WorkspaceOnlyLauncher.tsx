import React from 'react';
import { Building2, BookOpen, Users, Award, Wallet, MapPin, MessageSquare, Sparkles, ChevronDown } from 'lucide-react';
import { getAccessibleWorkspaces } from '../../../data/workspaceHierarchyRegistry';
import { useAuth } from '../../../hooks/useAuth';

interface WorkspaceOnlyLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const ICONS: Record<string, React.ElementType> = {
  Building2, BookOpen, Users, Award, Wallet, MapPin, MessageSquare, Sparkles,
};

const WORKSPACE_PATHS: Record<string, string> = {
  'admin-governance': '/owner/workspaces/admin-governance',
  'ws-academics': '/owner/workspaces/ws-academics',
  'ws-student': '/owner/workspaces/ws-student',
  'ws-examination': '/owner/workspaces/ws-examination',
  'ws-finance': '/owner/workspaces/ws-finance',
  'ws-campus': '/owner/workspaces/ws-campus',
  'ws-communication': '/owner/workspaces/ws-communication',
  'ws-intelligence': '/owner/workspaces/ws-intelligence',
};

export const WorkspaceOnlyLauncher: React.FC<WorkspaceOnlyLauncherProps> = ({ isOpen, onClose, onNavigate }) => {
  const { user } = useAuth();
  const workspaces = getAccessibleWorkspaces(user?.role).slice(0, 8);

  if (!isOpen) return null;

  return (
    <>
      <button aria-label="Close workspace menu" className="fixed inset-0 z-[199] cursor-default bg-slate-900/10" onClick={onClose} />
      <div className="fixed left-1/2 top-[68px] z-[200] w-[min(92vw,420px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-slate-900">Workspaces</p>
            <p className="text-xs text-slate-500">Select a workspace to open its main page</p>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          {workspaces.map((workspace) => {
            const Icon = ICONS[workspace.iconName] || Building2;
            return (
              <button
                key={workspace.id}
                onClick={() => {
                  onClose();
                  onNavigate(WORKSPACE_PATHS[workspace.id] || `/owner/workspaces/${workspace.id}`);
                }}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{workspace.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">{workspace.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WorkspaceOnlyLauncher;
