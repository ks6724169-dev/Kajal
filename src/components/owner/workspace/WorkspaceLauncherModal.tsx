import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  BookOpen, 
  Users, 
  Award, 
  Wallet, 
  MapPin, 
  MessageSquare, 
  Sparkles,
  ShieldCheck,
  Layers,
  UserCheck,
  FileText,
  History,
  Calendar,
  CheckSquare,
  Bus,
  Library,
  Video,
  Bell,
  BarChart3,
  Sliders,
  Database,
  GraduationCap,
  X,
  Search,
  ChevronRight,
  ArrowLeft,
  Lock,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getAccessibleWorkspaces, WorkspaceHierarchy, WorkGroup, WorkItem } from '../../../data/workspaceHierarchyRegistry';
import { useAuth } from '../../../hooks/useAuth';

interface WorkspaceLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  activeWorkspaceId?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  BookOpen,
  Users,
  Award,
  Wallet,
  MapPin,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Layers,
  UserCheck,
  FileText,
  History,
  Calendar,
  CheckSquare,
  Bus,
  Library,
  Video,
  Bell,
  BarChart3,
  Sliders,
  Database,
  GraduationCap
};

// Apple iOS/macOS Style Vibrant Icon Gradients for the 8 Workspaces
const APPLE_WS_STYLES: Record<string, { bg: string; shadow: string }> = {
  'ws-admin': {
    bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600',
    shadow: 'shadow-blue-500/20'
  },
  'ws-academics': {
    bg: 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600',
    shadow: 'shadow-purple-500/20'
  },
  'ws-student': {
    bg: 'bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600',
    shadow: 'shadow-emerald-500/20'
  },
  'ws-examination': {
    bg: 'bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700',
    shadow: 'shadow-rose-500/20'
  },
  'ws-finance': {
    bg: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700',
    shadow: 'shadow-emerald-500/20'
  },
  'ws-campus': {
    bg: 'bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700',
    shadow: 'shadow-orange-500/20'
  },
  'ws-communication': {
    bg: 'bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600',
    shadow: 'shadow-sky-500/20'
  },
  'ws-intelligence': {
    bg: 'bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700',
    shadow: 'shadow-fuchsia-500/20'
  },
};

export const WorkspaceLauncherModal: React.FC<WorkspaceLauncherModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  activeWorkspaceId
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const accessibleWorkspaces = useMemo(() => {
    return getAccessibleWorkspaces(user?.role);
  }, [user?.role]);

  // Set initial selected workspace to activeWorkspaceId or first available
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceHierarchy | null>(() => {
    if (activeWorkspaceId) {
      const found = accessibleWorkspaces.find(w => w.id === activeWorkspaceId);
      if (found) return found;
    }
    return accessibleWorkspaces[0] || null;
  });
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<WorkGroup | null>(null);

  // If selectedWorkspace is null but accessibleWorkspaces exist, auto-select first
  React.useEffect(() => {
    if (!selectedWorkspace && accessibleWorkspaces.length > 0) {
      setSelectedWorkspace(accessibleWorkspaces[0]);
    }
  }, [accessibleWorkspaces, selectedWorkspace]);

  if (!isOpen) return null;

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    const IconComponent = ICON_MAP[iconName] || Building2;
    return <IconComponent className={className} />;
  };

  const handleSelectWork = (work: WorkItem) => {
    if (work.status === 'active' && work.path) {
      onClose();
      onNavigate(work.path);
    }
  };

  // Filter items based on search query
  const filteredWorkspaces = accessibleWorkspaces.filter(ws => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const wsMatch = ws.title.toLowerCase().includes(q) || ws.description.toLowerCase().includes(q);
    const wgMatch = ws.workGroups.some(wg => 
      wg.title.toLowerCase().includes(q) || 
      wg.works.some(w => w.title.toLowerCase().includes(q))
    );
    return wsMatch || wgMatch;
  });

  const activeWS = selectedWorkspace || filteredWorkspaces[0] || accessibleWorkspaces[0];

  return (
    <div className="fixed top-[68px] sm:top-[76px] inset-x-0 bottom-0 z-[200] flex items-start justify-center px-3 sm:px-6 bg-slate-900/10 animate-fade-in">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Launcher Card Container - Aligned exactly to header max-w-[1700px] */}
      <div className="relative w-full max-w-[1700px] mx-auto h-[calc(100vh-68px)] sm:h-[calc(100vh-76px)] max-h-[850px] bg-white/90 backdrop-blur-2xl rounded-t-none rounded-b-3xl shadow-[0_32px_80px_rgba(0,0,0,0.15)] border-x border-b border-t-0 border-white overflow-hidden flex flex-col z-10 animate-scale-up">
        
        {/* 2-COLUMN SPLIT CONTAINER */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-transparent">
          
          {/* LEFT SIDEBAR: 8 WORKSPACES WITH APPLE COLORFUL VIBRANT ICONS */}
          <div className="w-full sm:w-72 lg:w-80 border-r border-slate-200/40 bg-slate-50/40 flex flex-col shrink-0 overflow-hidden">
            <div className="p-3.5 border-b border-slate-200/40 bg-white/40 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Workspaces ({filteredWorkspaces.length})
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/80">
                {accessibleWorkspaces.length} Available
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 custom-scrollbar">
              {filteredWorkspaces.map((ws) => {
                const isSelected = activeWS?.id === ws.id;
                const isCurrentActive = activeWorkspaceId === ws.id;
                const appleStyle = APPLE_WS_STYLES[ws.id] || {
                  bg: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
                  shadow: 'shadow-indigo-500/20'
                };

                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      setSelectedWorkGroup(null);
                    }}
                    className={`
                      w-full p-2.5 sm:p-3 rounded-2xl text-left transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer group relative
                      ${isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500'
                        : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200/60 hover:border-slate-300 hover:shadow-2xs'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Apple Style Squircle Colorful Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105 ${appleStyle.bg} text-white ${appleStyle.shadow}`}>
                        {renderIcon(ws.iconName, "w-4.5 h-4.5 text-white")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-xs sm:text-sm font-bold truncate ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}>
                            {ws.shortLabel || ws.title}
                          </h4>
                          {isCurrentActive && (
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                            }`} title="Active Page" />
                          )}
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 font-medium ${
                          isSelected ? 'text-indigo-100' : 'text-slate-500'
                        }`}>
                          {ws.workGroups.length} Work Groups
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT MAIN DETAIL PANEL: WORK GROUPS & WORKS AS SMALL APPLE BUTTONS */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-4 relative">
            
            {/* Top Right Floating Close Button */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100/80 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {activeWS ? activeWS.title : 'Workspace Details'}
                </span>
                {activeWS && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {activeWS.workGroups.length} Work Groups
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer active:scale-95 shrink-0"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {activeWS ? (
              <>
                {/* WORK GROUPS QUICK SELECTOR - APPLE SMALL BUTTON BAR */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Work Groups:</span>
                  <button
                    onClick={() => setSelectedWorkGroup(null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      !selectedWorkGroup 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All ({activeWS.workGroups.length})
                  </button>
                  {activeWS.workGroups.map((wg) => (
                    <button
                      key={wg.id}
                      onClick={() => setSelectedWorkGroup(selectedWorkGroup?.id === wg.id ? null : wg)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                        selectedWorkGroup?.id === wg.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50/70 hover:border-indigo-200'
                      }`}
                    >
                      <span>{wg.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        selectedWorkGroup?.id === wg.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {wg.works.length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* WORK GROUPS & WORKS DISPLAY AS COMPACT APPLE BUTTONS */}
                {selectedWorkGroup ? (
                  /* SINGLE WORK GROUP VIEW */
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          {renderIcon(selectedWorkGroup.iconName, "w-3.5 h-3.5")}
                        </div>
                        <h3 className="text-xs font-bold text-slate-900">
                          {selectedWorkGroup.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => setSelectedWorkGroup(null)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Show All Groups
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {selectedWorkGroup.works.map((work) => {
                        const isActive = work.status === 'active';
                        return (
                          <button
                            key={work.id}
                            onClick={() => handleSelectWork(work)}
                            disabled={!isActive}
                            className={`
                              p-2.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-2.5 w-full active:scale-98
                              ${isActive
                                ? 'bg-white hover:bg-indigo-50/70 border-slate-200/80 hover:border-indigo-300 hover:shadow-xs cursor-pointer group'
                                : 'bg-slate-50/60 border-slate-200/40 opacity-70 cursor-not-allowed'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {renderIcon(work.iconName, "w-4 h-4")}
                              </div>

                              <div className="min-w-0">
                                <h4 className={`text-xs font-bold truncate ${isActive ? 'text-slate-900 group-hover:text-indigo-700' : 'text-slate-500'}`}>
                                  {work.title}
                                </h4>
                                <p className="text-[10px] text-slate-500 truncate font-medium">
                                  {work.description}
                                </p>
                              </div>
                            </div>

                            {isActive ? (
                              <ExternalLink className="w-3.5 h-3.5 text-indigo-600 shrink-0 group-hover:translate-x-0.5 transition" />
                            ) : (
                              <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded shrink-0 border border-amber-200/60">
                                Soon
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* ALL WORK GROUPS LISTING WITH SMALL APPLE BUTTON CARDS */
                  <div className="space-y-4">
                    {activeWS.workGroups.map((wg) => (
                      <div 
                        key={wg.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs space-y-2.5"
                      >
                        {/* Work Group Header */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                              {renderIcon(wg.iconName, "w-3.5 h-3.5")}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-xs truncate">
                                {wg.title}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium truncate">
                                {wg.description}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedWorkGroup(wg)}
                            className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg shrink-0 transition cursor-pointer"
                          >
                            {wg.works.length} Tools →
                          </button>
                        </div>

                        {/* Works Grid - Compact Small Apple Control Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {wg.works.map((work) => {
                            const isActive = work.status === 'active';
                            return (
                              <button
                                key={work.id}
                                onClick={() => handleSelectWork(work)}
                                disabled={!isActive}
                                className={`
                                  p-2.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-2 w-full active:scale-98
                                  ${isActive 
                                    ? 'bg-slate-50/80 hover:bg-indigo-50/70 border-slate-200/80 hover:border-indigo-300 cursor-pointer group shadow-2xs' 
                                    : 'bg-slate-50/40 border-slate-200/40 opacity-70 cursor-not-allowed'
                                  }
                                `}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    isActive 
                                      ? 'bg-white text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition shadow-2xs' 
                                      : 'bg-slate-200/80 text-slate-500'
                                  }`}>
                                    {renderIcon(work.iconName, "w-3.5 h-3.5")}
                                  </div>

                                  <div className="min-w-0">
                                    <h5 className={`text-xs font-bold truncate ${
                                      isActive ? 'text-slate-900 group-hover:text-indigo-700' : 'text-slate-600'
                                    }`}>
                                      {work.title}
                                    </h5>
                                    <p className="text-[10px] text-slate-500 truncate font-medium">
                                      {work.description}
                                    </p>
                                  </div>
                                </div>

                                {isActive ? (
                                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600 shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                                ) : (
                                  <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded shrink-0 border border-amber-200/60">
                                    Soon
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                Select a Workspace from the left sidebar to view options.
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="px-5 sm:px-8 py-2.5 bg-white border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700 text-[11px]">Galaxy ERP Active Enterprise Architecture</span>
          </div>
          <div className="text-[11px] font-medium text-slate-400 hidden sm:block">
            RBAC Authorization Verified • All Systems Nominal
          </div>
        </div>

      </div>
    </div>
  );
};
