import React, { useState } from 'react';
import { 
  Building2, MapPin, Phone, Mail, Globe, Shield, UserCheck, 
  CheckCircle, ArrowLeft, Save, FileText, Bus, Home, BookOpen, 
  Clock, Languages, ShieldCheck, AlertCircle, PlusCircle 
} from 'lucide-react';
import { CampusService } from '../../services/CampusService';
import { Tenant } from '../../types';

interface CreateNewCampusPageProps {
  tenant?: Tenant;
  onNavigate?: (path: string) => void;
}

export const CreateNewCampusPage: React.FC<CreateNewCampusPageProps> = ({ tenant, onNavigate }) => {
  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('Branch Campus');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [affiliation, setAffiliation] = useState('CBSE');
  const [academicSession, setAcademicSession] = useState('2026-2027');
  const [logo, setLogo] = useState('');

  // Principal Assignment
  const [principalName, setPrincipalName] = useState('');
  const [principalEmail, setPrincipalEmail] = useState('');
  const [principalPhone, setPrincipalPhone] = useState('');
  const [principalStatus, setPrincipalStatus] = useState<'Active' | 'Pending Invitation'>('Active');

  // Campus Settings
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [language, setLanguage] = useState('English');
  const [academicStructure, setAcademicStructure] = useState('K-12');
  const [feeConfig, setFeeConfig] = useState('Standard Regional Slab');
  const [transport, setTransport] = useState(true);
  const [hostel, setHostel] = useState(false);
  const [library, setLibrary] = useState(true);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const validate = () => {
    if (!name.trim()) {
      setErrorMsg('Campus Name is required.');
      return false;
    }
    if (!code.trim()) {
      setErrorMsg('Campus Code is required (e.g. CP-NORTH).');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleCreate = async (isDraft: boolean = false) => {
    if (!isDraft && !validate()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await CampusService.createCampus({
        name,
        code,
        type,
        address,
        city,
        state,
        pincode,
        phone,
        email,
        status: isDraft ? 'ARCHIVED' : 'ACTIVE',
      }, tenant?.id);

      if (error) throw error;
      if (!data) throw new Error('Failed to create campus');

      setSuccessMsg(`Campus "${data.name}" (${data.code}) ${isDraft ? 'saved as draft' : 'successfully created'} in Database!`);

      setTimeout(() => {
        if (onNavigate) {
          onNavigate('dashboard');
        }
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to persist campus record in database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Create New Campus</h1>
            </div>
            <p className="text-xs text-slate-500">Add a new educational branch to your organization tenant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => handleCreate(true)}
            disabled={loading}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleCreate(false)}
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Creating...' : 'Create Campus'}</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">1. Campus Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex International North Campus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. CP-NORTH-01"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Main Campus">Main Campus</option>
              <option value="Branch Campus">Branch Campus</option>
              <option value="Senior Wing">Senior Wing</option>
              <option value="Primary Branch">Primary Branch</option>
              <option value="Residential Wing">Residential Wing</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Street Address</label>
            <input
              type="text"
              placeholder="e.g. Sector 18, Knowledge Park II"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
            <input
              type="text"
              placeholder="e.g. Jaipur"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">State & PIN</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-1/2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="PIN"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-1/2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Phone</label>
            <input
              type="text"
              placeholder="+91 98765 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
            <input
              type="email"
              placeholder="north.campus@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Affiliation / Board</label>
            <select
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="CBSE">CBSE Board</option>
              <option value="ICSE">ICSE / CISCE</option>
              <option value="State Board">State Board</option>
              <option value="IB">IB World School</option>
              <option value="Cambridge">Cambridge IGCSE</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Academic Session</label>
            <input
              type="text"
              placeholder="2026-2027"
              value={academicSession}
              onChange={(e) => setAcademicSession(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Campus Administration (Principal Create / Assign) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">2. Campus Administration & Principal Assignment</h2>
          </div>
          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">ROLE = PRINCIPAL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Principal Full Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. Rajesh Verma"
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Principal Gmail / Email</label>
            <input
              type="email"
              placeholder="principal.north@gmail.com"
              value={principalEmail}
              onChange={(e) => setPrincipalEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Principal Mobile</label>
            <input
              type="text"
              placeholder="+91 98123 45678"
              value={principalPhone}
              onChange={(e) => setPrincipalPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <label className="text-xs font-bold text-slate-700">Principal Activation Status:</label>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                name="status" 
                checked={principalStatus === 'Active'} 
                onChange={() => setPrincipalStatus('Active')} 
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Active immediately</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                name="status" 
                checked={principalStatus === 'Pending Invitation'} 
                onChange={() => setPrincipalStatus('Pending Invitation')} 
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Send Email/SMS Invitation</span>
            </label>
          </div>
        </div>
      </div>

      {/* Section 3: Campus Configuration & Facilities */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">3. Campus Settings & Infrastructure Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Time Zone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Default Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Bilingual">Bilingual (English + Hindi)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Academic Structure</label>
            <input
              type="text"
              value={academicStructure}
              onChange={(e) => setAcademicStructure(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fee Configuration</label>
            <input
              type="text"
              value={feeConfig}
              onChange={(e) => setFeeConfig(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-indigo-50/50 transition">
            <div className="flex items-center gap-2.5">
              <Bus className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Transport Facility</span>
                <span className="text-[10px] text-slate-500">Bus routes & GPS tracking</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={transport}
              onChange={(e) => setTransport(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-indigo-50/50 transition">
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Hostel / Residential</span>
                <span className="text-[10px] text-slate-500">Dormitories & mess allocation</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hostel}
              onChange={(e) => setHostel(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-indigo-50/50 transition">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Library System</span>
                <span className="text-[10px] text-slate-500">Digital catalog & textbook loans</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={library}
              onChange={(e) => setLibrary(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleCreate(true)}
          disabled={loading}
          className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleCreate(false)}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Persisting Campus...' : 'Create Campus'}</span>
        </button>
      </div>
    </div>
  );
};
