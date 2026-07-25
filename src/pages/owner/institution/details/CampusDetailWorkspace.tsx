import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  User, 
  Building2, 
  Shield, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Edit2,
  RefreshCw,
  Search,
  UserCheck,
  Briefcase,
  History,
  Grid
} from 'lucide-react';
import { CampusService, CampusRecord } from '../../../../services/CampusService';
import { UserService, UserProfile } from '../../../../services/UserService';
import { Tenant } from '../../../../types';
import { supabase } from '../../../../services/supabase';

interface CampusDetailWorkspaceProps {
  campusId: string;
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const CampusDetailWorkspace: React.FC<CampusDetailWorkspaceProps> = ({ 
  campusId, 
  tenant, 
  onNavigate 
}) => {
  const [loading, setLoading] = useState(true);
  const [campus, setCampus] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Principal Search State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  const loadCampus = async () => {
    setLoading(true);
    try {
      const data = await CampusService.getCampusById(campusId, tenantId);
      setCampus(data);
    } catch (err) {
      console.error('Campus Detail Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampus();
  }, [campusId, tenantId]);

  const handleUserSearch = async () => {
    if (!userSearchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await UserService.searchUsers(userSearchQuery, tenantId);
      setSearchResults(results);
    } catch (err) {
      console.error('Search Error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssignPrincipal = async () => {
    if (!selectedUser) return;
    setIsAssigning(true);
    try {
      const { error } = await CampusService.assignPrincipal(campusId, selectedUser.id, tenantId);
      if (!error) {
        await loadCampus();
        setSelectedUser(null);
        setUserSearchQuery('');
        setSearchResults([]);
        setActiveTab('overview');
      }
    } catch (err) {
      console.error('Assignment Error:', err);
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
        <RefreshCw className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-[10px] font-black uppercase tracking-widest">Hydrating Campus Workspace...</p>
      </div>
    );
  }

  if (!campus) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
           <MapPin className="w-8 h-8 text-slate-200" />
        </div>
        <p className="text-sm font-bold text-slate-900 tracking-tight">Campus Entity Not Found</p>
        <button 
          onClick={() => onNavigate('/owner/institution')}
          className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* 1. CAMPUS SUB-HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('/owner/institution?tab=campuses')}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-2xs group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
             <div className="flex items-center gap-2 mb-1">
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{campus.name}</h2>
               <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-indigo-100">
                 {campus.code}
               </span>
             </div>
             <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {campus.city}, {campus.state}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {campus.type || 'Standard'} Branch</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 text-slate-500 rounded-2xl shadow-2xs hover:bg-slate-50 transition-all">
            <Search className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Edit2 className="w-4 h-4" /> Edit Branch
          </button>
        </div>
      </div>

      {/* 2. CAMPUS NAV TABS */}
      <nav className="flex items-center gap-8 border-b border-slate-100 px-2 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: Grid },
          { id: 'principal', label: 'Principal Binding', icon: UserCheck },
          { id: 'departments', label: 'Campus Depts', icon: Briefcase },
          { id: 'settings', label: 'Local Settings', icon: Shield },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative py-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-300'}`} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* 3. TAB CONTENT */}
      <div className="animate-in fade-in duration-500">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <div className="lg:col-span-2 space-y-8">
                {/* Infrastructure Card */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-600" /> Infrastructure Summary
                      </h3>
                   </div>
                   <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         {[
                           { label: 'Exact Address', value: campus.address, icon: MapPin },
                           { label: 'Campus Phone', value: campus.phone || '+91 98765 43210', icon: Phone },
                           { label: 'Authorized Email', value: campus.email || 'campus@institution.edu', icon: Mail },
                         ].map((item, i) => (
                           <div key={i} className="flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{item.label}</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">{item.value}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="bg-slate-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200">
                         <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
                            <Grid className="w-8 h-8 text-slate-200" />
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Infrastructure Map</p>
                         <button className="mt-2 text-xs font-bold text-indigo-600 hover:underline">Provision Map Assets</button>
                      </div>
                   </div>
                </div>

                {/* KPI Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                   {[
                     { label: 'Staff Count', value: campus.staff_count || 0, icon: UserCheck },
                     { label: 'Active Students', value: campus.student_count || 0, icon: Users },
                     { label: 'Classrooms', value: 24, icon: Building2 },
                   ].map((kpi, i) => (
                     <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                        <h4 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">{kpi.value}</h4>
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-8">
                {/* Principal Quick Card */}
                <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                   <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 overflow-hidden">
                         {campus.principal_avatar ? (
                           <img src={campus.principal_avatar} alt="Principal" className="w-full h-full object-cover" />
                         ) : <User className="w-7 h-7 text-white/50" />}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Head of Operations</p>
                      <h3 className="text-xl font-black mt-1">{campus.principal_name || 'Principal Not Assigned'}</h3>
                      <p className="text-xs font-medium text-indigo-100 mt-4 leading-relaxed">
                        Responsible for daily campus governance, staff orchestration, and academic compliance reporting.
                      </p>
                      <button 
                        onClick={() => setActiveTab('principal')}
                        className="mt-8 w-full py-4 bg-white text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg"
                      >
                        {campus.principal_name ? 'Manage Binding' : 'Assign Authority'}
                      </button>
                   </div>
                </div>

                {/* Local Activity Feed */}
                <div className="bg-white rounded-[32px] border border-slate-200 p-8">
                   <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus Stream</h4>
                      <History className="w-3.5 h-3.5 text-slate-300" />
                   </div>
                   <div className="space-y-6">
                      {[1, 2].map(i => (
                        <div key={i} className="flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                              <RefreshCw className="w-4 h-4" />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-slate-800">Branch Profile Updated</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">12h ago • by Owner</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'principal' && (
          <div className="max-w-4xl mx-auto py-10 space-y-10">
             <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-12 border-b border-slate-100 bg-slate-50/50 flex flex-col items-center text-center">
                   <div className="w-24 h-24 rounded-[32px] bg-white border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 mb-8 shadow-sm overflow-hidden">
                      {selectedUser?.avatar_url ? (
                        <img src={selectedUser.avatar_url} alt="Selected" className="w-full h-full object-cover" />
                      ) : <User className="w-10 h-10" />}
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Principal Authority Binding</h3>
                   <p className="text-sm text-slate-500 font-medium mt-2 max-w-md">
                     Bind an authenticated user to this campus with the role of <b>PRINCIPAL</b>.
                   </p>
                   
                   <div className="mt-10 w-full max-w-lg space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full text-left">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input 
                            type="text" 
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                            placeholder="Search verified users (name or email)..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                           />
                        </div>
                        <button 
                          onClick={handleUserSearch}
                          disabled={isSearching}
                          className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                          {isSearching ? 'Searching...' : 'Find User'}
                        </button>
                      </div>

                      {/* Search Results */}
                      {searchResults.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-lg animate-in slide-in-from-top-2 duration-300 max-h-60 overflow-y-auto">
                          {searchResults.map(user => (
                            <button
                              key={user.id}
                              onClick={() => setSelectedUser(user)}
                              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                                selectedUser?.id === user.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-slate-400" />}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
                                <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-wider">{user.email}</p>
                              </div>
                              {selectedUser?.id === user.id && <UserCheck className="w-4 h-4 text-indigo-600" />}
                            </button>
                          ))}
                        </div>
                      )}

                      {selectedUser && (
                        <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <button 
                            onClick={handleAssignPrincipal}
                            disabled={isAssigning}
                            className="w-full py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                          >
                            <Shield className="w-4 h-4" />
                            {isAssigning ? 'Binding Authority...' : `Confirm ${selectedUser.full_name} as Principal`}
                          </button>
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="p-12 space-y-8 bg-white">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-500" /> Security Policies
                      </h4>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { title: 'RLS Access Enforcement', desc: 'Principal will only see data belonging to this campus ID.' },
                        { title: 'Multi-Factor Mandatory', desc: 'Principal users are forced to activate TOTP/SMS MFA.' },
                      ].map((p, i) => (
                        <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[24px] flex gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                              <Shield className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{p.title}</p>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">{p.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Other tabs can be added similarly */}
        {(activeTab === 'departments' || activeTab === 'settings') && (
           <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[40px] border border-slate-200 border-dashed animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Briefcase className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module Syncing</h3>
              <p className="text-sm text-slate-500 font-medium mt-2 max-w-sm">
                The {activeTab} workspace for this campus is being provisioned. This feature will be live in the next release.
              </p>
           </div>
        )}
      </div>
    </div>
  );
};

const Users = (props: any) => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
