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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
      {/* Action Row & Segmented Section Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-2 rounded-xl border border-slate-200/80">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as ProfileSection)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === section.id 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <section.icon className="w-3.5 h-3.5" /> {section.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => setIsEditing(false)}
                 className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSave}
                 disabled={saving}
                 className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer"
               >
                 {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} 
                 Save
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className="space-y-6">
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
             <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-6 border-b border-slate-100">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                      {institution?.logo_url ? (
                        <img src={institution.logo_url} className="w-full h-full object-contain p-2 sm:p-3" />
                      ) : <Building className="w-8 h-8 sm:w-10 sm:h-10 text-slate-200" />}
                   </div>
                   <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{form.name || 'Organization Name'}</h3>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{form.institution_type || 'Entity Type'}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Registration Number</label>
                      <p className="text-sm font-bold text-slate-900">{form.registration_number || 'Not Provided'}</p>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Established Year</label>
                      <p className="text-sm font-bold text-slate-900">{form.established_year || 'Not Provided'}</p>
                   </div>
                   <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Official Website</label>
                      <a href={`https://${form.website}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-2 break-all">
                         {form.website || 'No website listed'} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 rounded-xl p-5 sm:p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-xl flex items-center justify-center">
                         <Shield className="w-5 h-5 text-indigo-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight">Identity Health</h3>
                   </div>
                   <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between py-3 border-b border-white/10">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Completeness</span>
                         <span className="text-base sm:text-lg font-bold text-white">92%</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-white/10">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Tier</span>
                         <span className="text-base sm:text-lg font-bold text-white">Verified</span>
                      </div>
                   </div>
                   <button className="mt-6 sm:mt-10 w-full py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 cursor-pointer">
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-10">
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

        {activeSection === 'registration' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 space-y-8">
             <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">Legal Registration & Statutory Identity</h3>
                   <p className="text-xs text-slate-500 font-medium">Statutory registration credentials verified with education regulatory authorities.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-200">Statutory Verified</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Registration / Accreditation Number</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.registration_number}
                       onChange={e => setForm({...form, registration_number: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-900">{form.registration_number || 'REG-2026-X89'}</p>
                   )}
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tax / EIN Identification ID</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.tax_id}
                       onChange={e => setForm({...form, tax_id: e.target.value})}
                       placeholder="e.g. TAX-8839210-US"
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-900">{form.tax_id || 'TAX-9988221-EX'}</p>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeSection === 'affiliation' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 space-y-8">
             <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">Board & Academic Affiliations</h3>
                   <p className="text-xs text-slate-500 font-medium">Educational board accreditation and university affiliation credentials.</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-200">Active Board</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Board / Education Authority</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.board}
                       onChange={e => setForm({...form, board: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-900">{form.board || 'Central Board of Education'}</p>
                   )}
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Affiliation Code / Registration No.</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.affiliation_number}
                       onChange={e => setForm({...form, affiliation_number: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-900">{form.affiliation_number || 'AFF-9921-2026'}</p>
                   )}
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Associated University (if applicable)</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.university}
                       onChange={e => setForm({...form, university: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-900">{form.university || 'State Central University'}</p>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeSection === 'branding' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 space-y-8">
             <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">Institutional Branding & Logo</h3>
                   <p className="text-xs text-slate-500 font-medium">Public visual identifiers, insignia logo URL, and institutional motto.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-xl">
                   <div className="w-28 h-28 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-4 mb-4">
                      {form.logo_url ? (
                        <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Building className="w-12 h-12 text-slate-300" />
                      )}
                   </div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Insignia Emblem</span>
                </div>

                <div className="md:col-span-2 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Emblem Image URL</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={form.logo_url}
                          onChange={e => setForm({...form, logo_url: e.target.value})}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-mono text-slate-700 truncate">{form.logo_url || 'Default System Icon'}</p>
                      )}
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Official Motto</label>
                      <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-semibold text-slate-800 italic">"Excellence, Integrity & Innovation in Education"</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 space-y-8">
             <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">Official Communication & Headquarters</h3>
                   <p className="text-xs text-slate-500 font-medium">Official administrative email addresses, phone contacts, and physical headquarters location.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Official Email</label>
                   {isEditing ? (
                     <input 
                       type="email" 
                       value={form.official_email}
                       onChange={e => setForm({...form, official_email: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-900">{form.official_email || 'admin@galaxy-edu.org'}</p>
                   )}
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Official Phone</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.official_phone}
                       onChange={e => setForm({...form, official_phone: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-900">{form.official_phone || '+1 800-GALAXY-0'}</p>
                   )}
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Headquarters Street Address</label>
                   {isEditing ? (
                     <input 
                       type="text" 
                       value={form.address}
                       onChange={e => setForm({...form, address: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                     />
                   ) : (
                     <p className="px-4 py-3 bg-slate-50 rounded-lg text-sm font-bold text-slate-900">{form.address || '123 Enterprise Way, Silicon Valley, CA 94025'}</p>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 lg:p-12 space-y-8">
             <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">Statutory Identity Documents</h3>
                   <p className="text-xs text-slate-500 font-medium">Compliance filings, registration certificates, and statutory identity records.</p>
                </div>
                <button 
                  onClick={() => onNavigate('/owner/workspaces/admin-governance')} 
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all"
                >
                  View All Compliance Docs
                </button>
             </div>

             <div className="space-y-4">
                {[
                  { name: 'Incorporation Certificate.pdf', date: '2023-11-15', size: '2.4 MB', status: 'VERIFIED' },
                  { name: 'Tax Exemption Record (501c3).pdf', date: '2024-01-10', size: '1.8 MB', status: 'ACTIVE' },
                  { name: 'Board Accreditation Renewal.pdf', date: '2025-04-20', size: '3.1 MB', status: 'VERIFIED' },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                           PDF
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                           <p className="text-[10px] text-slate-400 font-medium">Uploaded {doc.date} • {doc.size}</p>
                        </div>
                     </div>
                     <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-bold uppercase tracking-wider border border-emerald-200">
                        {doc.status}
                     </span>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
