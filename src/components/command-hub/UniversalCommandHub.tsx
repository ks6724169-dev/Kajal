import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Search, ArrowLeft, Home, Bot, RefreshCw, Monitor, 
  MoreHorizontal, X, Cpu, Smartphone, Video, Cctv, Repeat, 
  ShieldCheck, ChevronRight, Layers, Eye, Share2, HelpCircle,
  Command, Sliders, CheckCircle2, Radio, Globe, Zap, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { GlobalSearchModal } from './modals/GlobalSearchModal';
import { AIHelpModal } from './modals/AIHelpModal';
import { ScreenExplainModal } from './modals/ScreenExplainModal';
import { PluginHubModal } from './modals/PluginHubModal';
import { ConnectDeviceModal } from './modals/ConnectDeviceModal';
import { VideoConferencingModal } from './modals/VideoConferencingModal';
import { ControlRoomModal } from './modals/ControlRoomModal';
import { RecordsExchangeHubModal } from './modals/RecordsExchangeHubModal';

interface UniversalCommandHubProps {
  onNavigate: (path: string) => void;
  activePath?: string;
  currentCampus?: string;
}

export const UniversalCommandHub: React.FC<UniversalCommandHubProps> = ({
  onNavigate,
  activePath = 'dashboard',
  currentCampus = 'All Campuses'
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [showMoreModules, setShowMoreModules] = useState(false);

  // Modal States
  const [activeModal, setActiveModal] = useState<
    'search' | 'ai_help' | 'screen_explain' | 'plugin' | 'device' | 'video' | 'cctv' | 'records' | null
  >(null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Keyboard Shortcuts (Esc to close, Cmd+K to open search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(false);
        setActiveModal('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Role Badge Label
  const getRoleLabel = () => {
    switch (user?.role) {
      case 'principal':
        return 'Principal Scope';
      case 'vice_principal':
        return 'Vice Principal Scope';
      default:
        return 'Institution Owner';
    }
  };

  // Handlers for Core Actions
  const handleGlobalSearch = () => {
    setIsOpen(false);
    setActiveModal('search');
  };

  const handleBack = () => {
    setIsOpen(false);
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onNavigate('dashboard');
    }
  };

  const handleHome = () => {
    setIsOpen(false);
    onNavigate('dashboard');
  };

  const handleAiHelp = () => {
    setIsOpen(false);
    setActiveModal('ai_help');
  };

  const handleRefresh = () => {
    setIsOpen(false);
    const refreshEvent = new CustomEvent('galaxy_erp_refresh_data');
    window.dispatchEvent(refreshEvent);
    window.location.reload();
  };

  const handleShareScreen = async () => {
    setIsOpen(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
      } else {
        alert('Screen sharing media API is not supported in this browser environment.');
      }
    } catch (err) {
      // User cancelled screen share
    }
  };

  // Primary Quick Tools List with Brilliant Colorful Icons
  const primaryActions = [
    {
      id: 'search',
      title: 'Global Search',
      subtitle: 'Navigate modules & students',
      icon: Search,
      shortcut: '⌘K',
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/25',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      action: handleGlobalSearch
    },
    {
      id: 'ai_help',
      title: 'Galaxy AI Help',
      subtitle: 'Contextual guidance assistant',
      icon: Bot,
      shortcut: 'AI',
      iconBg: 'bg-gradient-to-tr from-purple-600 to-pink-500 shadow-purple-500/25',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      action: handleAiHelp
    },
    {
      id: 'home',
      title: 'Home Dashboard',
      subtitle: 'Return to Executive Center',
      icon: Home,
      shortcut: '⌘H',
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/25',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      action: handleHome
    },
    {
      id: 'back',
      title: 'Navigate Back',
      subtitle: 'Previous screen view',
      icon: ArrowLeft,
      shortcut: 'Esc',
      iconBg: 'bg-gradient-to-tr from-rose-600 to-orange-500 shadow-rose-500/25',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
      action: handleBack
    },
    {
      id: 'refresh',
      title: 'Sync & Refresh',
      subtitle: 'Re-fetch institutional data',
      icon: RefreshCw,
      shortcut: '⌘R',
      iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-500 shadow-amber-500/25',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      action: handleRefresh
    },
    {
      id: 'share',
      title: 'Share Screen',
      subtitle: 'Live presentation mode',
      icon: Share2,
      shortcut: '⌘S',
      iconBg: 'bg-gradient-to-tr from-sky-500 to-cyan-500 shadow-sky-500/25',
      badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
      action: handleShareScreen
    }
  ];

  // Advanced Institutional Command Hub Modules (6 Bottom Buttons)
  const advancedModules = [
    {
      id: 'screen_explain',
      title: 'Screen Explain AI',
      subtitle: 'Contextual screen explanation in Hindi/English',
      icon: Monitor,
      badge: 'Interactive AI',
      iconBg: 'bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-violet-500/25',
      badgeBg: 'bg-violet-100 text-violet-700 border-violet-200',
      action: () => { setIsOpen(false); setActiveModal('screen_explain'); }
    },
    {
      id: 'plugin',
      title: 'Plugin & Integrations Hub',
      subtitle: 'Stripe, Razorpay, WhatsApp & SMS Gateways',
      icon: Cpu,
      badge: 'API Isolation',
      iconBg: 'bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-cyan-500/25',
      badgeBg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      action: () => { setIsOpen(false); setActiveModal('plugin'); }
    },
    {
      id: 'device',
      title: 'Connect Device & Hardware',
      subtitle: 'Biometric, RFID turnstiles, GPS telematics',
      icon: Smartphone,
      badge: 'IoT Gateway',
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-green-500 shadow-emerald-500/25',
      badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      action: () => { setIsOpen(false); setActiveModal('device'); }
    },
    {
      id: 'video',
      title: 'Video Conferencing',
      subtitle: 'Virtual classrooms, staff meetings & PTM',
      icon: Video,
      badge: 'E2E Encrypted',
      iconBg: 'bg-gradient-to-tr from-pink-600 to-rose-500 shadow-pink-500/25',
      badgeBg: 'bg-pink-100 text-pink-700 border-pink-200',
      action: () => { setIsOpen(false); setActiveModal('video'); }
    },
    {
      id: 'cctv',
      title: 'VMS & Control Room',
      subtitle: 'Institutional CCTV, NVR feeds & zone monitors',
      icon: Cctv,
      badge: 'Live Feeds',
      iconBg: 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-amber-500/25',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      action: () => { setIsOpen(false); setActiveModal('cctv'); }
    },
    {
      id: 'records',
      title: 'Records Exchange Hub',
      subtitle: 'Cross-campus push/pull & document printing',
      icon: Repeat,
      badge: 'Official Print',
      iconBg: 'bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-indigo-500/25',
      badgeBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      action: () => { setIsOpen(false); setActiveModal('records'); }
    }
  ];

  // Filtered Lists based on search input
  const filteredPrimary = primaryActions.filter(
    a => a.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
         a.subtitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredAdvanced = advancedModules.filter(
    m => m.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
         m.subtitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // If user is typing search, auto reveal advanced modules
  const isSearching = searchFilter.trim().length > 0;
  const shouldShowAdvanced = showMoreModules || isSearching;

  return (
    <>
      {/* Dimmed Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9990] bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Apple-Style Bright Clean White Right Sidebar Drawer Panel */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 right-0 bottom-0 z-[9995] w-[340px] sm:w-[400px] bg-white backdrop-blur-3xl border-l border-slate-200/80 shadow-[0_0_50px_rgba(0,0,0,0.12)] text-slate-900 flex flex-col transition-transform duration-300 ease-out overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Soft Vibrant Shimmer Glows in Background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Clean Apple-Grade White Header */}
        <div className="relative z-10 p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-cyan-600 text-sm">
                  ❄️
                </div>
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg leading-none bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
                  Galaxy
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse"></span>
                </h3>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">Vibrant AI Control Center</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer border border-slate-200 shadow-sm"
              title="Close Panel (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scope Pills */}
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> {getRoleLabel()}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" /> {currentCampus}
            </span>
          </div>

          {/* Quick Search Bar inside Panel */}
          <div className="relative mt-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search actions & enterprise modules..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Action Content */}
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 flex flex-col">
          {/* Section 1: Quick Actions Grid */}
          {filteredPrimary.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 tracking-wider uppercase px-1">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Actions
                </span>
                <span className="text-[10px] text-indigo-600 font-bold">Primary Tools</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {filteredPrimary.map((action) => {
                  const IconComp = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="p-3.5 bg-slate-50/90 hover:bg-indigo-50/80 border border-slate-200/80 hover:border-indigo-300 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-indigo-500/10 hover:-translate-y-0.5 min-h-[90px]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`w-8 h-8 rounded-xl ${action.iconBg} text-white group-hover:scale-110 transition-transform flex items-center justify-center shadow-md`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-mono font-bold border ${action.badgeColor}`}>
                          {action.shortcut}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                          {action.title}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {action.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Prominent "MORE" Toggle Button (Hides/Shows the 6 Bottom Buttons) */}
          {!isSearching && (
            <div className="pt-1">
              <button
                onClick={() => setShowMoreModules(!showMoreModules)}
                className={`w-full py-3 px-4 rounded-2xl border font-extrabold text-xs sm:text-sm flex items-center justify-between transition-all duration-300 cursor-pointer shadow-md ${
                  showMoreModules
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white border-pink-400/50 shadow-purple-500/25'
                    : 'bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 text-white hover:from-indigo-800 hover:to-purple-800 border-indigo-700/50 hover:shadow-indigo-500/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span>{showMoreModules ? 'Hide Extra Modules' : 'More Enterprise Modules (6)'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
                    {showMoreModules ? 'Close' : 'Expand'}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showMoreModules ? 'rotate-90' : ''}`} />
                </div>
              </button>
            </div>
          )}

          {/* Section 3: The 6 Enterprise Bottom Buttons (HIDDEN BY DEFAULT, EXPANDED ON MORE CLICK) */}
          {shouldShowAdvanced && filteredAdvanced.length > 0 && (
            <div className="space-y-2.5 animate-fade-in pt-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 tracking-wider uppercase px-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" /> Enterprise Tools
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Authorized</span>
              </div>

              <div className="space-y-2">
                {filteredAdvanced.map((module) => {
                  const ModIcon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={module.action}
                      className="w-full p-3 bg-slate-50/90 hover:bg-purple-50/80 border border-slate-200/80 hover:border-purple-300 rounded-2xl flex items-center justify-between text-left transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-purple-500/10 hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${module.iconBg} text-white group-hover:scale-110 transition-transform flex items-center justify-center shrink-0 shadow-md`}>
                          <ModIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
                              {module.title}
                            </span>
                            <span className={`text-[9px] px-2 py-0.2 rounded-full border font-bold ${module.badgeBg}`}>
                              {module.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            {module.subtitle}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {/* Fill Empty Space with System Status (only visible when not expanded) */}
          {!isSearching && !showMoreModules && (
            <div className="flex-1 min-h-[120px] flex flex-col items-center justify-center opacity-40 select-none pointer-events-none mt-8">
              <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                Galaxy AI <br/> Systems Operational
              </p>
            </div>
          )}
        </div>

        {/* Apple-Style Drawer Footer */}
        <div className="relative z-10 p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-600 font-medium">
          <span className="flex items-center gap-1.5 font-bold text-emerald-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> RBAC Enforced
          </span>
          <span className="font-mono text-[10px] text-slate-400">Press ESC to dismiss</span>
        </div>
      </aside>

      {/* Floating Right Dock Trigger Button (Colorful Glowing Chamchamta Button) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9980] flex items-center gap-2 select-none font-sans">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2.5 px-4.5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 border cursor-pointer ${
            isOpen
              ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white border-cyan-400 ring-4 ring-cyan-500/30 scale-105 shadow-cyan-500/50'
              : 'bg-gradient-to-r from-slate-900/95 via-indigo-950/95 to-slate-900/95 hover:from-indigo-900 hover:to-purple-950 text-white border-indigo-400/50 hover:border-cyan-400/70 backdrop-blur-xl shadow-indigo-500/20 hover:shadow-indigo-500/40'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 text-white flex items-center justify-center text-sm group-hover:scale-110 transition-transform shadow-md">
            ❄️
          </div>
          <span className="font-black text-xs sm:text-sm tracking-wide bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent">
            Galaxy
          </span>
          <ChevronRight className={`w-4 h-4 text-indigo-300 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Render Active Modals */}
      <GlobalSearchModal
        isOpen={activeModal === 'search'}
        onClose={() => setActiveModal(null)}
        onNavigate={onNavigate}
        currentCampus={currentCampus}
      />

      <AIHelpModal
        isOpen={activeModal === 'ai_help'}
        onClose={() => setActiveModal(null)}
        activePath={activePath}
      />

      <ScreenExplainModal
        isOpen={activeModal === 'screen_explain'}
        onClose={() => setActiveModal(null)}
        activePath={activePath}
      />

      <PluginHubModal
        isOpen={activeModal === 'plugin'}
        onClose={() => setActiveModal(null)}
      />

      <ConnectDeviceModal
        isOpen={activeModal === 'device'}
        onClose={() => setActiveModal(null)}
        currentCampus={currentCampus}
      />

      <VideoConferencingModal
        isOpen={activeModal === 'video'}
        onClose={() => setActiveModal(null)}
      />

      <ControlRoomModal
        isOpen={activeModal === 'cctv'}
        onClose={() => setActiveModal(null)}
        currentCampus={currentCampus}
      />

      <RecordsExchangeHubModal
        isOpen={activeModal === 'records'}
        onClose={() => setActiveModal(null)}
        currentCampus={currentCampus}
      />
    </>
  );
};
