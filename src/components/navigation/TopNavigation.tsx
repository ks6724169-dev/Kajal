import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { RoleSwitcher } from './RoleSwitcher';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';
import { useTenant } from '../../hooks/useTenant';
import { 
  Building2, 
  Search, 
  Languages, 
  Bell, 
  HelpCircle,
  Menu,
  Sparkles,
  CalendarDays,
  MapPin
} from 'lucide-react';

interface TopNavigationProps {
  language: string;
  onSelectLanguage: (lang: string) => void;
  onNavigate: (path: string) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  language,
  onSelectLanguage,
  onNavigate
}) => {
  const { user } = useAuth();
  const { currentTenant, branding } = useTenant();
  const { toggleSidebar } = useNavigation();

  return (
    <header 
      id="enterprise-top-navigation" 
      className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs"
    >
      {/* Left Segment: Collapsible trigger + Local Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer md:hidden shrink-0"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
        
        <div className="hidden sm:block min-w-0">
          <Breadcrumb language={language} onNavigate={onNavigate} />
        </div>
      </div>

      {/* Center Segment: Enterprise Branding (After Login) */}
      <div className="hidden xl:flex items-center gap-6 px-6 border-x border-slate-100 h-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-xs p-1 flex items-center justify-center overflow-hidden">
            <img 
              src={branding?.logo || 'https://via.placeholder.com/100'} 
              alt="School Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-black text-slate-900 truncate max-w-[200px]">
              {currentTenant?.name || 'GALAXY ENTERPRISE'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <MapPin className="w-3 h-3" />
                {user?.campus || 'MAIN CAMPUS'}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <CalendarDays className="w-3 h-3" />
                {currentTenant?.academicYear || '2023-24'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Segment: Search bar, notifications, tenant switcher, role switcher & language toggle */}
      <div className="flex items-center gap-3.5 shrink-0">
        
        {/* Dynamic Multi-role Switcher Controls */}
        <RoleSwitcher language={language} />

        {/* Simple Bilingual Selector */}
        <button
          type="button"
          onClick={() => onSelectLanguage(language === 'en' ? 'hi' : 'en')}
          className="p-2 text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1 cursor-pointer"
          title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
        >
          <Languages className="h-4 w-4 text-indigo-500 shrink-0" />
          <span className="text-[10px] font-extrabold uppercase hidden lg:block">
            {language === 'en' ? 'HINDI' : 'ENG'}
          </span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="p-2.5 text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl relative cursor-pointer"
        >
          <Bell className="h-4 w-4 text-slate-500" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-600"></span>
        </button>

      </div>
    </header>
  );
};
