import React, { useState, useEffect } from 'react';
import { Search, X, LayoutGrid, ChevronRight, Lock, Sparkles, Building2, Shield } from 'lucide-react';
import { WORKSPACE_HIERARCHY, WorkspaceHierarchy } from '../../../data/workspaceHierarchyRegistry';
import { useAuth } from '../../../hooks/useAuth';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  currentCampus?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentCampus = 'All Campuses'
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'workspaces' | 'works'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter works by search query & user role
  const userRole = user?.role || 'organization_owner';

  const filterWorks = () => {
    const query = searchQuery.toLowerCase().trim();
    const results: {
      workspaceTitle: string;
      workspaceId: string;
      groupTitle: string;
      work: any;
      isAuthorized: boolean;
    }[] = [];

    WORKSPACE_HIERARCHY.forEach((ws: WorkspaceHierarchy) => {
      ws.workGroups.forEach((group) => {
        group.works.forEach((work) => {
          const matchesQuery =
            !query ||
            work.title.toLowerCase().includes(query) ||
            work.description.toLowerCase().includes(query) ||
            ws.title.toLowerCase().includes(query) ||
            group.title.toLowerCase().includes(query);

          if (matchesQuery) {
            const isAuthorized = 
              ['owner', 'organization_owner', 'institution_owner'].includes(userRole) ||
              !work.allowedRoles ||
              work.allowedRoles.includes(userRole);

            results.push({
              workspaceTitle: ws.title,
              workspaceId: ws.id,
              groupTitle: group.title,
              work,
              isAuthorized
            });
          }
        });
      });
    });

    return results;
  };

  const searchResults = filterWorks();

  const handleSelectWork = (path: string, isAuthorized: boolean) => {
    if (!isAuthorized) return;
    onNavigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white border border-slate-200/80 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Workspaces, Work Groups, Works (e.g., Attendance, Fees, Staff, CCTV)..."
            className="w-full bg-transparent border-none text-slate-900 text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-none focus:ring-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-200/60 rounded-lg transition"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills & RBAC Scope Context */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Filters:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition ${selectedCategory === 'all' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              All ({searchResults.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold">
              <Shield className="w-3 h-3" /> Scope: {currentCampus}
            </span>
          </div>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-1.5">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto opacity-60" />
              <p className="font-semibold text-sm">No matching features found</p>
              <p className="text-xs text-slate-400">Try searching for keywords like "Fee", "Exam", "Staff", or "Attendance"</p>
            </div>
          ) : (
            searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectWork(item.work.routePath, item.isAuthorized)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  item.isAuthorized
                    ? 'bg-white hover:bg-indigo-50/50 border-slate-200/70 hover:border-indigo-200 cursor-pointer group shadow-3xs'
                    : 'bg-slate-50/80 border-slate-200/50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.isAuthorized ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <LayoutGrid className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {item.work.title}
                      </span>
                      {!item.isAuthorized && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                          <Lock className="w-3 h-3" /> Restricted
                        </span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                        item.work.status === 'functional' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        item.work.status === 'partial' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.work.status === 'functional' ? 'Functional' : item.work.status === 'partial' ? 'Partial' : 'Phase 3+'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.workspaceTitle} • {item.groupTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.isAuthorized ? (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-4">
          <span>Search Galaxy ERP Institution Registry</span>
          <span className="font-medium text-indigo-600">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
