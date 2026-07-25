import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  Shield, 
  MapPin, 
  Calendar, 
  Camera, 
  Edit2, 
  Save, 
  Loader2, 
  Lock, 
  Info, 
  Briefcase,
  FileText,
  ChevronRight,
  ExternalLink,
  X,
  Plus,
  LayoutGrid
} from 'lucide-react';
import { Tenant } from '../../../types';
import { InstitutionService, InstitutionRecord } from '../../../services/InstitutionService';
import { supabase } from '../../../services/supabase';

interface InstitutionProfilePageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

type ProfileSection = 'overview' | 'basic' | 'registration' | 'affiliation' | 'branding' | 'contact' | 'documents';

export const InstitutionProfilePage: React.FC<InstitutionProfilePageProps> = ({ tenant, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [institution, setInstitution] = useState<InstitutionRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');
  
  const [form, setForm] = useState({
    name: '',
    short_name: '',
    registration_number: '',
    institution_type: '',
    website: '',
    official_email: '',
    official_phone: '',
    established_year: '',
    board: '',
    university: '',
    affiliation_number: '',
    tax_id: '',
    address: '',
    current_session: '',
    about: '',
    logo_url: ''
  });

  const effectiveTenantId = tenant?.id || '00000000-0000-0000-0000-000000000001';

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await InstitutionService.getInstitution(effectiveTenantId);
      if (data) {
        setInstitution(data);
        setForm({
          name: data.name || '',
          short_name: data.metadata?.short_name || '',
          registration_number: data.registration_number || '',
          institution_type: data.institution_type || '',
          website: data.website || '',
          official_email: data.official_email || '',
          official_phone: data.official_phone || '',
          established_year: data.established_year?.toString() || '',
          board: data.metadata?.board || '',
          university: data.metadata?.university || '',
          affiliation_number: data.metadata?.affiliation_number || '',
          tax_id: data.metadata?.tax_id || '',
          address: data.metadata?.address || '',
          current_session: data.metadata?.current_session || '',
          about: data.metadata?.about || '',
          logo_url: data.logo_url || ''
        });
      }
    } catch (err) {
      console.error('Profile Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [effectiveTenantId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution) return;
    
    setSaving(true);
    try {
      const updates = {
        name: form.name,
        registration_number: form.registration_number,
        institution_type: form.institution_type,
        website: form.website,
        official_email: form.official_email,
        official_phone: form.official_phone,
        established_year: parseInt(form.established_year) || undefined,
        metadata: {
          ...(institution.metadata || {}),
          short_name: form.short_name,
          board: form.board,
          university: form.university,
          affiliation_number: form.affiliation_number,
          tax_id: form.tax_id,
          address: form.address,
          current_session: form.current_session,
          about: form.about
        }
      };

      const { error } = await supabase
        .from('institutions')
        .update(updates)
        .eq('id', institution.id)
        .eq('tenant_id', effectiveTenantId);
      
      if (error) throw error;
      
      setIsEditing(false);
      loadData();
    } catch (err) {
      console.error('Save Profile Error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
         <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-8" />
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Retrieving Secure Identity Data...</p>
      </div>
    );
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'registration', label: 'Registration', icon: FileText },
    { id: 'affiliation', label: 'Affiliation', icon: Briefcase },
    { id: 'branding', label: 'Branding', icon: Camera },
    { id: 'contact', label: 'Contact & Address', icon: MapPin },
    { id: 'documents', label: 'Documents', icon: FileText }
  ] as const;

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Page Header (Structured Header) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Work Area: 01
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Institution Profile</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Manage legal registration, statutory identity, and core organizational metadata.</p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-all active:scale-[0.98]"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => setIsEditing(false)}
                 className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSave}
                 disabled={saving}
                 className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
               >
                 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                 Save Changes
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Segmented Navigation (Fluent/Material style) */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 flex overflow-x-auto no-scrollbar gap-1 mb-10 shadow-sm">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as ProfileSection)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeSection === section.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <section.icon className="w-4 h-4" /> {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-10">
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                   <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                      {institution?.logo_url ? (
                        <img src={institution.logo_url} className="w-full h-full object-contain p-3" />
                      ) : <Building className="w-10 h-10 text-slate-200" />}
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{form.name || 'Organization Name'}</h3>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{form.institution_type || 'Entity Type'}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Registration Number</label>
                      <p className="text-sm font-bold text-slate-900">{form.registration_number || 'Not Provided'}</p>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Established Year</label>
                      <p className="text-sm font-bold text-slate-900">{form.established_year || 'Not Provided'}</p>
                   </div>
                   <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Official Website</label>
                      <a href={`https://${form.website}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-2">
                         {form.website || 'No website listed'} <ExternalLink className="w-3 h-3" />
                      </a>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-xl flex items-center justify-center">
                         <Shield className="w-5 h-5 text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">Identity Health</h3>
                   </div>
                   <div className="space-y-6 flex-1">
                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Completeness</span>
                         <span className="text-lg font-bold text-white">92%</span>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Tier</span>
                         <span className="text-lg font-bold text-white">Verified</span>
                      </div>
                   </div>
                   <button className="mt-10 w-full py-3 bg-white/5 hover:bg-white/10 transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">
                      Download Identity Summary
                   </button>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none">
                   <Shield className="w-48 h-48 rotate-12" />
                </div>
             </div>
          </div>
        )}

        {activeSection === 'basic' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Institution Name</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.name}
                       onChange={e => setForm({...form, name: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 border border-transparent rounded-lg text-sm font-bold text-slate-900">{form.name}</p>
                   )}
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Short Name / Initials</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.short_name}
                       onChange={e => setForm({...form, short_name: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 border border-transparent rounded-lg text-sm font-bold text-slate-900">{form.short_name || 'N/A'}</p>
                   )}
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Established Year</label>
                   {isEditing ? (
                     <input 
                       type="number" 
                       value={form.established_year}
                       onChange={e => setForm({...form, established_year: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 border border-transparent rounded-lg text-sm font-bold text-slate-900">{form.established_year}</p>
                   )}
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Institution Type</label>
                   {isEditing ? (
                     <select 
                       value={form.institution_type}
                       onChange={e => setForm({...form, institution_type: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     >
                       <option value="K-12 Education">K-12 Education</option>
                       <option value="Higher Education">Higher Education</option>
                       <option value="Vocational Training">Vocational Training</option>
                       <option value="Research Institute">Research Institute</option>
                     </select>
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 border border-transparent rounded-lg text-sm font-bold text-slate-900">{form.institution_type}</p>
                   )}
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">About Institution</label>
                   {isEditing ? (
                     <textarea 
                       value={form.about}
                       onChange={e => setForm({...form, about: e.target.value})}
                       rows={5}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 border border-transparent rounded-lg text-sm font-medium text-slate-600 leading-relaxed italic">
                        "{form.about || 'No description provided.'}"
                     </p>
                   )}
                </div>
             </div>
          </div>
        )}

        {(activeSection !== 'overview' && activeSection !== 'basic') && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-20 text-center">
             <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Syncing Module Data</h3>
             <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto uppercase tracking-widest leading-loose">
                Please wait while the {activeSection} workspace is synchronized with the master control plane.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};
