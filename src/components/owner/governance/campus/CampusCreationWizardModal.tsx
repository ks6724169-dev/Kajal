import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  UserCheck, 
  Layers, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  FileText,
  Bus,
  Video,
  AlertCircle
} from 'lucide-react';
import { CampusRecord } from '../../../../services/CampusService';

interface CampusCreationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campusData: Partial<CampusRecord>) => Promise<void>;
  initialData?: CampusRecord | null;
}

export const CampusCreationWizardModal: React.FC<CampusCreationWizardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isEditMode = !!initialData;

  const [formData, setFormData] = useState<Partial<CampusRecord>>({
    name: initialData?.name || '',
    code: initialData?.code || '',
    type: initialData?.type || 'PRIMARY',
    established_year: initialData?.established_year || new Date().getFullYear(),
    affiliation_board: initialData?.affiliation_board || 'CBSE Board',
    
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
    country: initialData?.country || 'United States',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    
    principal_name: initialData?.principal_name || '',
    principal_email: initialData?.principal_email || '',
    principal_phone: initialData?.principal_phone || '',
    vice_principal_name: initialData?.vice_principal_name || '',
    vice_principal_email: initialData?.vice_principal_email || '',
    admin_officer_name: initialData?.admin_officer_name || '',
    emergency_hotline: initialData?.emergency_hotline || '',
    
    capacity: initialData?.capacity || 1000,
    classrooms_count: initialData?.classrooms_count || 30,
    labs_count: initialData?.labs_count || 6,
    library_capacity: initialData?.library_capacity || 5000,
    
    hostel_capacity: initialData?.hostel_capacity || 200,
    transport_fleet_count: initialData?.transport_fleet_count || 10,
    cctv_cameras_count: initialData?.cctv_cameras_count || 50,
    smart_boards_percent: initialData?.smart_boards_percent || 90,
    
    affiliation_code: initialData?.affiliation_code || '',
    accreditation_rating: initialData?.accreditation_rating || 'A Grade',
    compliance_status: initialData?.compliance_status || 'COMPLIANT',
    
    operational_shifts: initialData?.operational_shifts || 'Morning (08:00 AM - 02:30 PM)',
    academic_session_linked: initialData?.academic_session_linked || 'AY 2026-2027',
    status: initialData?.status || 'ACTIVE'
  });

  if (!isOpen) return null;

  const steps = [
    { num: 1, label: 'Identity & Branch' },
    { num: 2, label: 'Location & Geo' },
    { num: 3, label: 'Leadership' },
    { num: 4, label: 'Academic Infrastructure' },
    { num: 5, label: 'Facilities & Assets' },
    { num: 6, label: 'Compliance & Docs' },
    { num: 7, label: 'Review & Provision' }
  ];

  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.name?.trim() || !formData.code?.trim()) {
        setErrorMsg('Please enter Campus Name and Branch Code.');
        return;
      }
    }
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to provision campus. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl my-8 overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
              <Building2 className="w-3.5 h-3.5" />
              {isEditMode ? 'Branch Profile Update' : 'Multi-Step Campus Provisioning Wizard'}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditMode ? `Edit Campus: ${initialData.name}` : 'Provision New Campus Branch'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Indicator Bar */}
        <div className="bg-slate-100/80 px-6 py-3 border-b border-slate-200 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between gap-2 min-w-[650px]">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              const isCompleted = currentStep > s.num;

              return (
                <div key={s.num} className="flex items-center gap-2">
                  <div 
                    onClick={() => { if (isCompleted) setCurrentStep(s.num); }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : isCompleted 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                      {isCompleted ? <Check className="w-3 h-3 text-emerald-700" /> : s.num}
                    </span>
                    <span>{s.label}</span>
                  </div>
                  {s.num < 7 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Wizard Body Form */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* STEP 1: IDENTITY & BRANCH */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 1: Campus Identity & Branch Registration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Campus / Branch Name *</label>
                  <input 
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Main Heritage Campus"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Branch Identification Code *</label>
                  <input 
                    type="text"
                    value={formData.code || ''}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g. CAMPUS-01"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Campus Classification Type</label>
                  <select 
                    value={formData.type || 'PRIMARY'}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  >
                    <option value="PRIMARY">PRIMARY (Headquarters Node)</option>
                    <option value="SECONDARY">SECONDARY (Regional Campus)</option>
                    <option value="SATELLITE">SATELLITE (Learning Extension Wing)</option>
                    <option value="SPECIALIZATION">SPECIALIZATION (Research & Tech Unit)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Established Year</label>
                  <input 
                    type="number"
                    value={formData.established_year || 2026}
                    onChange={e => setFormData({...formData, established_year: parseInt(e.target.value) || 2026})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Affiliation / Educational Board</label>
                  <input 
                    type="text"
                    value={formData.affiliation_board || ''}
                    onChange={e => setFormData({...formData, affiliation_board: e.target.value})}
                    placeholder="e.g. CBSE / IB World School Alliance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & GEO */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 2: Location & Geographical Coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Street Address</label>
                  <input 
                    type="text"
                    value={formData.address || ''}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="e.g. 101 Education Lane, Academic Enclave"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City / Municipality</label>
                  <input 
                    type="text"
                    value={formData.city || ''}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder="Silicon Valley"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">State / Province</label>
                  <input 
                    type="text"
                    value={formData.state || ''}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    placeholder="CA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Postal Code / Pincode</label>
                  <input 
                    type="text"
                    value={formData.pincode || ''}
                    onChange={e => setFormData({...formData, pincode: e.target.value})}
                    placeholder="94025"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Branch Email</label>
                  <input 
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="heritage@galaxy.edu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Phone Line</label>
                  <input 
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 555-0101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LEADERSHIP */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 3: Governance & Leadership Roster</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Principal Name</label>
                  <input 
                    type="text"
                    value={formData.principal_name || ''}
                    onChange={e => setFormData({...formData, principal_name: e.target.value})}
                    placeholder="e.g. Dr. Sarah Wilson"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Principal Official Email</label>
                  <input 
                    type="email"
                    value={formData.principal_email || ''}
                    onChange={e => setFormData({...formData, principal_email: e.target.value})}
                    placeholder="sarah.wilson@galaxy.edu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Vice Principal Name</label>
                  <input 
                    type="text"
                    value={formData.vice_principal_name || ''}
                    onChange={e => setFormData({...formData, vice_principal_name: e.target.value})}
                    placeholder="e.g. Prof. Robert Taylor"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Administrative Officer Name</label>
                  <input 
                    type="text"
                    value={formData.admin_officer_name || ''}
                    onChange={e => setFormData({...formData, admin_officer_name: e.target.value})}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Hotline Number</label>
                  <input 
                    type="text"
                    value={formData.emergency_hotline || ''}
                    onChange={e => setFormData({...formData, emergency_hotline: e.target.value})}
                    placeholder="+1 800-555-GALAXY"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ACADEMIC INFRASTRUCTURE */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 4: Academic Capacity & Infrastructure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Maximum Student Capacity</label>
                  <input 
                    type="number"
                    value={formData.capacity || 1000}
                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Classrooms Count</label>
                  <input 
                    type="number"
                    value={formData.classrooms_count || 30}
                    onChange={e => setFormData({...formData, classrooms_count: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Science & Computing Labs Count</label>
                  <input 
                    type="number"
                    value={formData.labs_count || 6}
                    onChange={e => setFormData({...formData, labs_count: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Library Volume / Capacity</label>
                  <input 
                    type="number"
                    value={formData.library_capacity || 5000}
                    onChange={e => setFormData({...formData, library_capacity: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FACILITIES & ASSETS */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 5: Facilities & Security Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Hostel Bed Capacity</label>
                  <input 
                    type="number"
                    value={formData.hostel_capacity || 0}
                    onChange={e => setFormData({...formData, hostel_capacity: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Transport Fleet Buses Count</label>
                  <input 
                    type="number"
                    value={formData.transport_fleet_count || 0}
                    onChange={e => setFormData({...formData, transport_fleet_count: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">CCTV Cameras Active Count</label>
                  <input 
                    type="number"
                    value={formData.cctv_cameras_count || 0}
                    onChange={e => setFormData({...formData, cctv_cameras_count: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Smart Interactive Classrooms (%)</label>
                  <input 
                    type="number"
                    value={formData.smart_boards_percent || 90}
                    onChange={e => setFormData({...formData, smart_boards_percent: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: COMPLIANCE */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 6: Accreditation & Legal Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Affiliation Code / Registration No.</label>
                  <input 
                    type="text"
                    value={formData.affiliation_code || ''}
                    onChange={e => setFormData({...formData, affiliation_code: e.target.value})}
                    placeholder="e.g. CBSE-CA-88902"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Accreditation Rating Grade</label>
                  <input 
                    type="text"
                    value={formData.accreditation_rating || ''}
                    onChange={e => setFormData({...formData, accreditation_rating: e.target.value})}
                    placeholder="e.g. A++ Excellence Grade"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Compliance Status</label>
                  <select 
                    value={formData.compliance_status || 'COMPLIANT'}
                    onChange={e => setFormData({...formData, compliance_status: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  >
                    <option value="COMPLIANT">COMPLIANT (All Charters Valid)</option>
                    <option value="NEEDS_AUDIT">NEEDS AUDIT (Pending Renewal)</option>
                    <option value="NON_COMPLIANT">NON-COMPLIANT (Action Required)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Linked Academic Session</label>
                  <input 
                    type="text"
                    value={formData.academic_session_linked || 'AY 2026-2027'}
                    onChange={e => setFormData({...formData, academic_session_linked: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Step 7: Final Review & Provisioning Audit</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Campus Name</span>
                    <span className="text-sm font-bold text-slate-900">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Branch Code</span>
                    <span className="text-sm font-mono font-bold text-indigo-600">{formData.code}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Classification</span>
                    <span className="font-bold text-slate-800">{formData.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
                    <span className="font-bold text-slate-800">{formData.city}, {formData.state}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Principal</span>
                    <span className="font-bold text-slate-800">{formData.principal_name || 'Unassigned'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Capacity</span>
                    <span className="font-bold text-slate-800">{formData.capacity?.toLocaleString()} Students</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ready for instant database registration and multi-tenant RLS provisioning.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || saving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStep === 1 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700 transition-all cursor-pointer"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition-all cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditMode ? 'Save Campus Changes' : 'Confirm & Provision Campus'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
