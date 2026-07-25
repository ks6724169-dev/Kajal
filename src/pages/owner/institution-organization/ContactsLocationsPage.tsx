import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ChevronRight,
  Star,
  Map as MapIcon,
  Navigation
} from 'lucide-react';
import { Tenant } from '../../../types';

interface ContactsLocationsPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

const LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Global HQ & Administrative Office',
    type: 'HEADQUARTERS',
    address: '123 Enterprise Way, Innovation District, Silicon Valley, CA 94025',
    phone: '+1 (800) 555-0100',
    email: 'hq@galaxy-edu.org',
    isPrimary: true,
    status: 'ACTIVE'
  },
  {
    id: 'loc-2',
    name: 'Regional Operations Hub - East',
    type: 'REGIONAL_OFFICE',
    address: '505 Tech Square, Suite 200, New York, NY 10001',
    phone: '+1 (212) 555-0200',
    email: 'east-hub@galaxy-edu.org',
    isPrimary: false,
    status: 'ACTIVE'
  }
];

export const ContactsLocationsPage: React.FC<ContactsLocationsPageProps> = ({ tenant, onNavigate }) => {
  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6 mb-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Work Area: 07
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contacts & Locations</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Manage official institutional addresses and primary contact channels.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4" /> Add Location
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Locations List */}
        <div className="xl:col-span-8 space-y-6">
           {LOCATIONS.map((loc) => (
             <div key={loc.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row gap-8 hover:shadow-md hover:border-indigo-200 transition-all relative group overflow-hidden">
                {loc.isPrimary && (
                   <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-indigo-600 text-white rounded text-[9px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                         <Star className="w-3 h-3 fill-current" /> Primary HQ
                      </div>
                   </div>
                )}

                <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                   <MapIcon className="w-8 h-8 text-slate-300" />
                </div>

                <div className="flex-1 space-y-5">
                   <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{loc.name}</h3>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">{loc.type.replace('_', ' ')}</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <MapPin className="w-4 h-4" />
                         </div>
                         <p className="text-xs font-semibold text-slate-500 leading-relaxed">{loc.address}</p>
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                               <Phone className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-900">{loc.phone}</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                               <Mail className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-bold text-slate-900">{loc.email}</p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-5 border-t border-slate-100 flex items-center gap-3">
                      <button className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-indigo-100 transition-all">Edit Details</button>
                      <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-slate-200 transition-all">View Map</button>
                      <button className="ml-auto p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Global Directory Info */}
        <div className="xl:col-span-4 space-y-6 sticky top-32">
           <div className="bg-slate-900 rounded-xl p-8 text-white shadow-lg relative overflow-hidden h-full flex flex-col border border-slate-800">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <Navigation className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Institutional Geography</h3>
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Central management of physical operational nodes and digital contact channels.
                 </p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
                       <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center font-bold shadow-md">1</div>
                       <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">HQ Location</p>
                          <p className="text-xs font-bold">Silicon Valley, CA</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
                       <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold">4</div>
                       <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Regional Nodes</p>
                          <p className="text-xs font-bold">NY, LDN, TKY, DXB</p>
                       </div>
                    </div>
                 </div>
              </div>
              
              <button className="mt-10 pt-6 border-t border-white/5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors flex items-center justify-between group">
                 Directory Audit Trail <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none">
                 <Globe className="w-48 h-48" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
