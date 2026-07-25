import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  Shield, 
  ArrowRight,
  RefreshCw,
  FileText,
  Users,
  MapPin,
  Clock,
  Activity,
  History,
  ExternalLink,
  Settings
} from 'lucide-react';
import { Tenant } from '../../../../types';
import { InstitutionService, InstitutionRecord } from '../../../../services/InstitutionService';
import { CampusService, CampusRecord } from '../../../../services/CampusService';
import { supabase } from '../../../../services/supabase';

interface OverviewViewProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ tenant, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<InstitutionRecord | null>(null);
  const [campuses, setCampuses] = useState<CampusRecord[]>([]);

  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  const loadData = async () => {
    setLoading(true);
    try {
      const [inst, camps] = await Promise.all([
        InstitutionService.getInstitution(tenantId),
        CampusService.getCampuses(tenantId)
      ]);
      setInstitution(inst);
      setCampuses(camps);
    } catch (err) {
      console.error('Overview Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Real-time Subscription
    const channel = supabase
      .channel('overview-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'institutions', filter: `tenant_id=eq.${tenantId}` }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campuses', filter: `tenant_id=eq.${tenantId}` }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest">Querying Institutional Core...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Campuses', value: campuses.length, icon: Building, color: 'bg-indigo-50 text-indigo-600', link: 'campuses' },
    { label: 'Departments', value: institution?.metadata?.dept_count || 0, icon: Users, color: 'bg-orange-50 text-orange-600', link: 'departments' },
    { label: 'Users', value: institution?.metadata?.user_count || 0, icon: Users, color: 'bg-emerald-50 text-emerald-600', link: 'administration' },
    { label: 'Academic Session', value: institution?.metadata?.session_count || 1, icon: Calendar, color: 'bg-pink-50 text-pink-600', link: 'sessions' },
    { label: 'Admin Roles', value: institution?.metadata?.role_count || 6, icon: Settings, color: 'bg-blue-50 text-blue-600', link: 'administration' },
    { label: 'Compliance', value: '100%', icon: Shield, color: 'bg-teal-50 text-teal-600', link: 'affiliations' },
  ];

  const quickActions = [
    { label: 'Institution Profile', icon: Building, color: 'bg-indigo-50 text-indigo-600', tab: 'institution-profile' },
    { label: 'Organization Structure', icon: GitBranch, color: 'bg-orange-50 text-orange-600', tab: 'structure' },
    { label: 'Campuses', icon: MapPin, color: 'bg-emerald-50 text-emerald-600', tab: 'campuses' },
    { label: 'Departments', icon: Users, color: 'bg-blue-50 text-blue-600', tab: 'departments' },
    { label: 'Academic Sessions', icon: Calendar, color: 'bg-pink-50 text-pink-600', tab: 'sessions' },
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-6">
      {/* Title Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Institution Overview</h1>
          <p className="text-slate-500 font-medium mt-2">
            Manage your institution identity, organization structure and administrative information
          </p>
        </div>
        <button 
          onClick={loadData}
          className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-600"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Identity Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start relative z-10">
          <div className="w-32 h-32 rounded-full border-4 border-slate-50 bg-white shadow-lg flex items-center justify-center overflow-hidden shrink-0">
             {institution?.logo_url ? (
               <img src={institution.logo_url} className="w-full h-full object-contain p-4" />
             ) : <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-black">{institution?.name?.[0] || 'G'}</div>}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{institution?.name || 'Galaxy International School'}</h2>
              <span className="px-4 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            
            <div className="mt-4 space-y-3">
               <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                 <span className="text-slate-900">#</span> {institution?.code || 'INST-2026-001'}
               </div>
               <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-600 font-medium text-sm">
                 <Building className="w-4 h-4 text-slate-300" />
                 {institution?.board || 'CBSE Board'}
               </div>
               <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-600 font-medium text-sm">
                 <Calendar className="w-4 h-4 text-slate-300" />
                 Academic Session: {institution?.current_session || '2026-27'}
               </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
               <button className="flex-1 py-3.5 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                 <Edit2 className="w-3.5 h-3.5" /> Edit Profile
               </button>
               <button className="flex-1 py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                 <div className="w-4 h-4 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                 </div>
                 View Profile
               </button>
            </div>
          </div>

          <div className="hidden lg:flex absolute top-10 right-10 p-2 text-slate-300 group-hover:text-indigo-400 transition-colors">
            <ArrowRight className="w-6 h-6 -rotate-45" />
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-black text-slate-900 tracking-tight px-2">Quick Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:translate-y-[-4px] transition-all group">
               <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center mb-6`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
               <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</p>
               <button 
                onClick={() => onNavigate(stat.link)}
                className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all"
               >
                 View All <ArrowRight className="w-3 h-3" />
               </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h3 className="text-lg font-black text-slate-900 tracking-tight px-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-6">
          {quickActions.map((action, idx) => (
            <button 
              key={idx}
              onClick={() => onNavigate(action.tab)}
              className="flex flex-col items-center gap-4 group flex-1 min-w-[120px]"
            >
              <div className={`w-20 h-20 rounded-[28px] ${action.color} flex items-center justify-center shadow-lg shadow-slate-200/50 group-hover:scale-110 transition-all border border-white`}>
                <action.icon className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">
                {action.label.split(' ').map((word, i) => (
                  <React.Fragment key={i}>{word}<br/></React.Fragment>
                ))}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Edit2 = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
);

const Calendar = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const GitBranch = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <line x1="6" y1="3" x2="6" y2="15"/>
    <circle cx="18" cy="6" r="3"/>
    <circle cx="6" cy="18" r="3"/>
    <path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
);

