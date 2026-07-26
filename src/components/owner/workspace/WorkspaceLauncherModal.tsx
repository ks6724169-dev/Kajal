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

export const WorkspaceLauncherModal: React.FC<WorkspaceLauncherModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  activeWorkspaceId
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceHierarchy | null>(null);
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<WorkGroup | null>(null);

  const accessibleWorkspaces = useMemo(() => {
    return getAccessibleWorkspaces(user?.role);
  }, [user?.role]);

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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Launcher Card Container */}
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[850px] bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.25)] border border-slate-200/80 overflow-hidden flex flex-col z-10 animate-scale-up">
        
        {/* TOP BAR: Branding, Breadcrumb & Controls */}
        <div className="px-5 sm:px-8 py-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xs shadow-indigo-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-300">
                <span className="font-bold text-white tracking-tight shrink-0">Galaxy ERP</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-slate-300 shrink-0">Institution Management Panel</span>

                {selectedWorkspace && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-indigo-300 font-semibold truncate max-w-[140px] sm:max-w-[200px]">
                      {selectedWorkspace.shortLabel}
                    </span>
                  </>
                )}

                {selectedWorkGroup && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-emerald-300 font-semibold truncate max-w-[140px] sm:max-w-[200px]">
                      {selectedWorkGroup.title}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                Workspace & Enterprise Command Hierarchy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(selectedWorkspace || selectedWorkGroup) && (
              <button
                onClick={() => {
                  if (selectedWorkGroup) {
                    setSelectedWorkGroup(null);
                  } else {
                    setSelectedWorkspace(null);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
              title="Close Launcher"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="px-5 sm:px-8 py-3 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Workspaces, Work Groups or Works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-white text-xs font-semibold text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-2xs placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs text-[11px]">
              Role: <strong className="text-slate-800 uppercase">{user?.role?.replace('_', ' ') || 'OWNER'}</strong>
            </span>
          </div>
        </div>

        {/* MAIN LAUNCHER CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar bg-[#FBFBFD]">
          
          {/* LEVEL 1: 8 CORE WORKSPACES */}
          {!selectedWorkspace && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    Select Workspace
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Click any Workspace to explore available Work Groups and actual functional tools
                  </p>
                </div>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                  {filteredWorkspaces.length} Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredWorkspaces.map((ws) => {
                  const isActiveWS = activeWorkspaceId === ws.id;
                  return (
                    <div
                      key={ws.id}
                      onClick={() => setSelectedWorkspace(ws)}
                      className={`
                        group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between
                        ${isActiveWS
                          ? 'bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-md'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-indigo-200 hover:shadow-lg shadow-2xs'
                        }
                      `}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
                            isActiveWS ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800 group-hover:bg-indigo-600 group-hover:text-white'
                          }`}>
                            {renderIcon(ws.iconName, "w-5 h-5")}
                          </div>

                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-800 transition">
                            {ws.badge || ws.category}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                            {ws.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                            {ws.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                        <span>{ws.workGroups.length} Work Groups Inside</span>
                        <div className="flex items-center gap-1">
                          <span>Explore</span>
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEVEL 2: WORK GROUPS */}
          {selectedWorkspace && !selectedWorkGroup && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    {renderIcon(selectedWorkspace.iconName, "w-5 h-5")}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      {selectedWorkspace.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Select a Work Group to view its associated operational tools
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedWorkspace(null)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> All Workspaces
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedWorkspace.workGroups.map((wg) => (
                  <div
                    key={wg.id}
                    onClick={() => setSelectedWorkGroup(wg)}
                    className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                          {renderIcon(wg.iconName, "w-4 h-4")}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                          {wg.works.length} Works
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                        {wg.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {wg.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-indigo-600">
                      <span>View Works</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 3: WORKS LIST */}
          {selectedWorkspace && selectedWorkGroup && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    {renderIcon(selectedWorkGroup.iconName, "w-5 h-5")}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      {selectedWorkGroup.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Functional tools & operational pages inside this Work Group
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedWorkGroup(null)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Work Groups
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedWorkGroup.works.map((work) => {
                  const isActive = work.status === 'active';
                  return (
                    <div
                      key={work.id}
                      onClick={() => handleSelectWork(work)}
                      className={`
                        p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between
                        ${isActive
                          ? 'bg-white border-slate-200/80 hover:border-indigo-400 hover:shadow-md cursor-pointer group'
                          : 'bg-slate-50/80 border-slate-200/60 opacity-80 cursor-not-allowed'
                        }
                      `}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isActive ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {renderIcon(work.iconName, "w-4 h-4")}
                          </div>

                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                              <Clock className="w-3 h-3 text-amber-600" /> Coming Soon
                            </span>
                          )}
                        </div>

                        <h4 className={`font-bold text-xs sm:text-sm ${isActive ? 'text-slate-900 group-hover:text-indigo-600' : 'text-slate-600'}`}>
                          {work.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          {work.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        {isActive ? (
                          <>
                            <span className="text-indigo-600 text-[11px]">Open Tool</span>
                            <ExternalLink className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Planned Feature</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM FOOTER */}
        <div className="px-5 sm:px-8 py-3 bg-white border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
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
