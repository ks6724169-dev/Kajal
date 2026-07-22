import { RegistrationCertificateModal } from "../../components/auth/RegistrationCertificateModal";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User, 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  School, 
  FileText, 
  Sparkles,
  Check,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Building,
  Cpu,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Users,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  FileCheck,
  Receipt,
  HelpCircle,
  Award,
  X
} from 'lucide-react';

interface RegisterSchoolPageProps {
  navigate: (path: string) => void;
}

export const RegisterSchoolPage: React.FC<RegisterSchoolPageProps> = ({ navigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const totalPages = 6;

  // Form State
  const [formData, setFormData] = useState({
    // Step 1 — Institution Details
    institutionName: '',
    institutionType: 'Co-Educational',
    schoolCategory: 'K-12',
    boardType: 'CBSE',
    affiliationNumber: '',
    establishmentYear: new Date().getFullYear().toString(),
    officialWebsite: '',

    // Step 2 — Institution Contact
    officialEmail: '',
    officialPhone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',

    // Step 3 — Owner / Authorized Administrator
    ownerName: '',
    administratorName: '',
    administratorDesignation: 'Principal',
    ownerEmail: '',
    ownerMobile: '',
    alternateMobile: '',

    // Step 4 — Branding
    logoUrl: '',
    shortName: '',
    primaryBrandColor: '#4f46e5',
    secondaryBrandColor: '#7c3aed',
    agreeTerms: false
  });

  // Custom visual States
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [finalSchoolUniqueId, setFinalSchoolUniqueId] = useState("");
  const [finalTenantId, setFinalTenantId] = useState("");
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  // Subscription Selector States
  const [selectedPlan, setSelectedPlan] = useState<'silver' | 'gold' | 'platinum'>('silver');
  const [studentCapacity, setStudentCapacity] = useState<number>(500);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  
  // Real-time calculated pricing details
  const [pricing, setPricing] = useState<{
    baseAmount: number;
    setupFee: number;
    totalAmount: number;
    requiredInitialPayment: number;
    remainingAmount: number;
    currency: string;
    discountApplied: boolean;
  }>({
    baseAmount: 150000,
    setupFee: 5000,
    totalAmount: 155000,
    requiredInitialPayment: 38750,
    remainingAmount: 116250,
    currency: 'INR',
    discountApplied: true
  });

  // Save & Auto-save States
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('just now');
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, progress: number}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  // Resume Draft states
  const [resumeIdInput, setResumeIdInput] = useState('');
  const [showResumeInput, setShowResumeInput] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const [isResuming, setIsResuming] = useState(false);

  const handleResumeDraft = async () => {
    if (!resumeIdInput.trim()) {
      setResumeError('Please enter a valid Registration ID');
      return;
    }
    setIsResuming(true);
    setResumeError('');
    try {
      const response = await fetch(`/api/v1/school-registration/${resumeIdInput.trim()}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Draft not found. Please verify the ID.');
      }
      
      const draft = result.data;
      if (!draft) throw new Error('No data returned for this draft ID.');
      
      // Update form fields
      const updatedFormData = {
        ...formData,
        institutionName: draft.institution_name || draft.school_name || formData.institutionName,
        institutionType: draft.institution_type || formData.institutionType,
        schoolCategory: draft.school_category || formData.schoolCategory,
        boardType: draft.board_type || draft.board || formData.boardType,
        affiliationNumber: draft.affiliation_number || formData.affiliationNumber,
        establishmentYear: draft.establishment_year ? String(draft.establishment_year) : formData.establishmentYear,
        officialWebsite: draft.official_website || formData.officialWebsite,
        officialEmail: draft.official_email || formData.officialEmail,
        officialPhone: draft.official_phone || formData.officialPhone,
        address: draft.address || formData.address,
        city: draft.city || formData.city,
        state: draft.state || formData.state,
        country: draft.country || formData.country,
        postalCode: draft.postal_code || draft.pincode || formData.postalCode,
        ownerName: draft.owner_name || formData.ownerName,
        administratorName: draft.administrator_name || formData.administratorName,
        administratorDesignation: draft.administrator_designation || formData.administratorDesignation,
        ownerEmail: draft.owner_email || formData.ownerEmail,
        ownerMobile: draft.owner_mobile || formData.ownerMobile,
        alternateMobile: draft.alternate_mobile || formData.alternateMobile,
        shortName: draft.short_name || formData.shortName,
        logoUrl: draft.logo_url || formData.logoUrl,
        primaryBrandColor: draft.primary_brand_color || formData.primaryBrandColor,
        secondaryBrandColor: draft.secondary_brand_color || formData.secondaryBrandColor,
      };
      
      setFormData(updatedFormData);

      if (draft.metadata?.admin_password) {
        setPassword(draft.metadata.admin_password);
      }

      setRegistrationId(draft.registration_id);
      
      // Map 1-based steps correctly
      const savedStep = draft.current_step || 1;
      const targetPage = Math.min(6, Math.max(1, savedStep));
      setCurrentPage(targetPage);

      // Save to LocalStorage
      localStorage.setItem('galaxy_erp_reg_draft', JSON.stringify({
        formData: updatedFormData,
        password: draft.metadata?.admin_password || '',
        registrationId: draft.registration_id,
        timestamp: Date.now()
      }));

      setSaveStatus('saved');
    } catch (err: any) {
      setResumeError(err.message || 'Failed to resume session');
    } finally {
      setIsResuming(false);
    }
  };
  
  // Fetch pricing dynamically when plan/capacity/cycle changes
  useEffect(() => {
    const calculatePricing = async () => {
      try {
        const response = await fetch('/api/v1/school-registration/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: selectedPlan,
            studentCapacity,
            billingCycle
          })
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setPricing(result.data);
        }
      } catch (err) {
        // Fallback calculations in case of server delay
        const rate = selectedPlan === 'silver' ? 30 : selectedPlan === 'gold' ? 45 : 60;
        const base = rate * studentCapacity * (billingCycle === 'annual' ? 10 : 12);
        let setup = 5000;
        if (studentCapacity <= 100) setup = 2000;
        else if (studentCapacity <= 200) setup = 3000;
        else if (studentCapacity <= 500) setup = 5000;
        else if (studentCapacity <= 1000) setup = 8000;
        else if (studentCapacity <= 2000) setup = 12000;
        else if (studentCapacity <= 3000) setup = 15000;
        else if (studentCapacity <= 4000) setup = 18000;
        else setup = 20000;

        const total = base + setup;
        const initial = Math.round(total * 0.25);
        setPricing({
          baseAmount: base,
          setupFee: setup,
          totalAmount: total,
          requiredInitialPayment: initial,
          remainingAmount: total - initial,
          currency: 'INR',
          discountApplied: billingCycle === 'annual'
        });
      }
    };

    calculatePricing();
  }, [selectedPlan, studentCapacity, billingCycle]);

  // Load draft from LocalStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('galaxy_erp_reg_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsed.formData }));
        if (parsed.password) setPassword(parsed.password);
        if (parsed.registrationId) setRegistrationId(parsed.registrationId);
      }
    } catch (err) {
      console.warn("Failed to load draft from localStorage", err);
    }
  }, []);

  // Auto-save logic debounced
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const triggerAutoSave = (updatedData: typeof formData, pwdString: string, regId: string | null) => {
    setSaveStatus('saving');
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem('galaxy_erp_reg_draft', JSON.stringify({
          formData: updatedData,
          password: pwdString,
          registrationId: regId,
          timestamp: Date.now()
        }));
        setSaveStatus('saved');
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error("Auto-save failed", err);
        setSaveStatus('idle');
      }
    }, 1200);
  };

  // Cleanup autosave on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    triggerAutoSave(updated, password, registrationId);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    triggerAutoSave(formData, value, registrationId);
  };

  const handleMarkTouched = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Unentered', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1: return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
      case 2: return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
      case 3: return { score: 75, label: 'Strong', color: 'bg-indigo-500', text: 'text-indigo-600' };
      case 4: return { score: 100, label: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-600' } as const;
      default: return { score: 10, label: 'Too Short', color: 'bg-rose-500', text: 'text-rose-500' };
    }
  };

  const pwdStrength = calculatePasswordStrength(password);

  // Field level validation helpers
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9+\s-]{10,15}$/.test(phone);
  const validatePincode = (pin: string) => /^[0-9]{6}$/.test(pin);
  const validateURL = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Check if current step fields are fully valid
  const getStepValidationErrors = (step: number) => {
    const errors: string[] = [];
    if (step === 1) {
      if (!formData.institutionName.trim()) errors.push('Institution Name is required');
      if (!formData.institutionType) errors.push('Institution Type is required');
      if (!formData.boardType) errors.push('Board / Affiliation is required');
      if (!formData.establishmentYear.trim()) {
        errors.push('Establishment Year is required');
      } else {
        const yr = parseInt(formData.establishmentYear);
        if (isNaN(yr) || yr < 1800 || yr > new Date().getFullYear()) {
          errors.push('Please enter a valid Establishment Year between 1800 and current year');
        }
      }
    } else if (step === 2) {
      if (!formData.officialEmail.trim()) {
        errors.push('Official Institution Email is required');
      } else if (!validateEmail(formData.officialEmail)) {
        errors.push('Official Institution Email is invalid');
      }
      if (!formData.officialPhone.trim()) {
        errors.push('Official Phone number is required');
      } else if (!validatePhone(formData.officialPhone)) {
        errors.push('Official Phone number is invalid');
      }
      if (!formData.address.trim()) errors.push('Full Address is required');
      if (!formData.city.trim()) errors.push('City is required');
      if (!formData.state.trim()) errors.push('State is required');
      if (!formData.postalCode.trim()) {
        errors.push('PIN Code is required');
      } else if (!validatePincode(formData.postalCode)) {
        errors.push('PIN Code must be a 6-digit number');
      }
    } else if (step === 3) {
      if (!formData.ownerName.trim()) errors.push('Owner / Founder Name is required');
      if (!formData.administratorDesignation.trim()) errors.push('Designation is required');
      if (!formData.ownerEmail.trim()) {
        errors.push('Gmail / Email is required');
      } else if (!validateEmail(formData.ownerEmail)) {
        errors.push('Gmail / Email is invalid');
      }
      if (!formData.ownerMobile.trim()) {
        errors.push('Mobile Number is required');
      } else if (!validatePhone(formData.ownerMobile)) {
        errors.push('Mobile Number is invalid');
      }
      if (!password) {
        errors.push('Administrative Password is required');
      } else if (password.length < 8) {
        errors.push('Administrative Password must be at least 8 characters long');
      }
    } else if (step === 4) {
      if (formData.logoUrl && !validateURL(formData.logoUrl)) {
        errors.push('Logo URL must be a valid image link');
      }
    } else if (step === 6) {
      if (!formData.agreeTerms) {
        errors.push('You must agree to confirm that the information provided is correct.');
      }
    }
    return errors;
  };

  const handleNext = async () => {
    const stepErrors = getStepValidationErrors(currentPage);
    if (stepErrors.length > 0) {
      setError(stepErrors[0]);
      if (currentPage === 1) {
        setTouchedFields({
          institutionName: true,
          institutionType: true,
          boardType: true,
          establishmentYear: true
        });
      } else if (currentPage === 2) {
        setTouchedFields({
          officialEmail: true,
          officialPhone: true,
          address: true,
          city: true,
          state: true,
          postalCode: true
        });
      } else if (currentPage === 3) {
        setTouchedFields({
          ownerName: true,
          administratorDesignation: true,
          ownerEmail: true,
          ownerMobile: true
        });
      }
      return;
    }
    setError('');

    // Save draft immediately on step 1 next to reserve name
    if (currentPage === 1 && !registrationId) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/v1/school-registration/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolName: formData.institutionName,
            schoolType: formData.institutionType,
            schoolCategory: formData.schoolCategory,
            board: formData.boardType,
            establishmentYear: parseInt(formData.establishmentYear),
            country: formData.country,
            institutionName: formData.institutionName,
            institutionType: formData.institutionType,
            boardType: formData.boardType,
            affiliationNumber: formData.affiliationNumber,
            officialWebsite: formData.officialWebsite,
          })
        });

        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to start registration');

        const regId = data.data?.registration_id;
        if (!regId) throw new Error('Registration ID was not returned by server');

        setRegistrationId(regId);
        triggerAutoSave(formData, password, regId);
      } catch (err: any) {
        setError(err.message || 'Server communication failed. Please try again.');
        setIsSubmitting(false);
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    // Standard save draft to update intermediate steps on the server
    if (registrationId && (currentPage === 2 || currentPage === 3 || currentPage === 4)) {
      try {
        await fetch(`/api/v1/school-registration/${registrationId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            official_email: formData.officialEmail,
            official_phone: formData.officialPhone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.postalCode,
            postal_code: formData.postalCode,
            owner_name: formData.ownerName,
            administrator_name: formData.administratorName || formData.ownerName,
            administrator_designation: formData.administratorDesignation,
            owner_email: formData.ownerEmail,
            owner_mobile: formData.ownerMobile,
            alternate_mobile: formData.alternateMobile,
            official_website: formData.officialWebsite,
            short_name: formData.shortName,
            logo_url: formData.logoUrl,
            primary_brand_color: formData.primaryBrandColor,
            secondary_brand_color: formData.secondaryBrandColor,
            metadata: {
              admin_password: password,
              primary_color: formData.primaryBrandColor,
              secondary_color: formData.secondaryBrandColor
            }
          })
        });
      } catch (e) {
        console.warn('Failed to sync draft step to database');
      }
    }

    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setError('');
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleManualSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      try {
        localStorage.setItem('galaxy_erp_reg_draft', JSON.stringify({
          formData,
          password,
          registrationId,
          timestamp: Date.now()
        }));
        setSaveStatus('saved');
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        setSaveStatus('idle');
      }
    }, 600);
  };

  /**
   * Action: Navigates to the dedicated payment page.
   */
  const handleInitiatePayment = () => {
    const finalErrors = getStepValidationErrors(currentPage);
    if (finalErrors.length > 0) {
      setError(finalErrors[0]);
      return;
    }
    
    if (!registrationId) {
      setError('Registration record missing. Please go back and complete step 1.');
      return;
    }

    navigate(`/school-registration/${registrationId}/payment`);
  };

  // Fake drag & drop logo upload logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateFileUpload(file.name, file.size);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateFileUpload(file.name, file.size);
    }
  };

  const simulateFileUpload = (name: string, rawSize: number) => {
    const sizeInKb = (rawSize / 1024).toFixed(1) + ' KB';
    const newFile = { name, size: sizeInKb, progress: 0 };
    setUploadedFiles(prev => [...prev, newFile]);

    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(f => {
          if (f.name === name) {
            const nextProg = f.progress + 25;
            if (nextProg >= 100) {
              clearInterval(interval);
              if (/\.(jpe?g|png|gif|svg|webp)$/i.test(name)) {
                handleInputChange('logoUrl', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128');
              }
              return { ...f, progress: 100 };
            }
            return { ...f, progress: nextProg };
          }
          return f;
        })
      );
    }, 250);
  };

  return (
    <div id="register-school-page" className="w-full min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans relative overflow-hidden selection:bg-indigo-600 selection:text-white">
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-50/40 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-50/30 blur-[130px] pointer-events-none z-0"></div>

      {/* LEFT PANEL - 40% Width */}
      <div className="hidden lg:flex flex-col lg:w-[40%] bg-gradient-to-br from-indigo-50/40 via-slate-50/60 to-purple-50/20 border-r border-slate-200/60 p-12 overflow-y-auto h-screen justify-between relative z-10">
        
        {/* Brand Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.795H13.62l1.317-7.3H9L6 11.23H10.5l-1.688 4.674z" />
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-wide text-slate-950 flex items-center gap-1.5 leading-none">
                GALAXY <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">ERP</span>
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mt-0.5 leading-none">Educational Operating System</span>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            <h1 className="font-display font-extrabold text-3xl leading-tight text-slate-900 tracking-tight">
              Command your campus. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">Fully automated.</span>
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Onboard your institution to GALAXY ERP and experience an integrated operating system for modern administrative control, dynamic security, and predictive insights.
            </p>
          </div>
        </div>

        {/* Live CSS Interactive Dashboard Graphic */}
        <div className="my-8 relative bg-white/80 border border-slate-200/50 p-6 rounded-2xl shadow-xl shadow-slate-100/50 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Galaxy AI Hub Active</span>
            </div>
            <span className="text-[9px] font-mono font-semibold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">SLA UPTIME 99.99%</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900">Biometric Attendance Module</h4>
                  <p className="text-[9px] text-slate-400">Continuous check-in model</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Online</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900">Automated Fee Collection</h4>
                  <p className="text-[9px] text-slate-400">UPI / Cards Gateway sync</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Awaiting Setup</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900">Parent-Teacher Comm Node</h4>
                  <p className="text-[9px] text-slate-400">Interactive SMS/Push triggers</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200/60 pt-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">GDPR Compliant</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Galaxy Educational Operating Systems are hosted across geographically redundant secure data zones. 100% cloud-native SLA guaranteed.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - 60% Width */}
      <div className="w-full lg:w-[60%] flex flex-col justify-between min-h-screen bg-white relative overflow-y-auto z-10">
        
        {/* TOP STATUS BAR */}
        <div className="px-6 py-4 md:px-12 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2.5 lg:hidden" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.795H13.62l1.317-7.3H9L6 11.23H10.5l-1.688 4.674z" />
              </svg>
            </div>
            <span className="font-display font-extrabold text-sm tracking-wide text-slate-900">GALAXY ERP</span>
          </div>

          {/* Save Draft Indicator */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 text-xs">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></div>
                  <span>Saving draft...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span>Draft saved ({lastSavedTime})</span>
                </div>
              )}
              {saveStatus === 'idle' && (
                <button
                  onClick={handleManualSave}
                  className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-xs focus:outline-none"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Draft
                </button>
              )}
            </div>

            <button 
              id="reg-back-to-login"
              onClick={() => navigate('/auth/login')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200/80 px-3 py-1.5 rounded-lg transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </div>

        {/* WIZARD PROGRESS BAR */}
        {!isSuccess && (
          <div className="px-6 py-6 md:px-12 bg-slate-50/50 border-b border-slate-100">
            <div className="max-w-xl mx-auto flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 transition-all duration-300 z-0"
                style={{ width: `${((currentPage - 1) / (totalPages - 1)) * 100}%` }}
              ></div>

              {[...Array(totalPages)].map((_, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentPage;
                const isCompleted = stepNum < currentPage;
                
                return (
                  <button
                    key={stepNum}
                    onClick={() => {
                      if (stepNum < currentPage || getStepValidationErrors(currentPage).length === 0) {
                        setDirection(stepNum > currentPage ? 1 : -1);
                        setCurrentPage(stepNum);
                      }
                    }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-indigo-600 text-white' 
                          : isActive 
                            ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-600 font-extrabold ring-4 ring-indigo-100' 
                            : 'bg-white border border-slate-300 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="max-w-xl mx-auto flex justify-between text-[10px] font-bold text-slate-400 mt-2 tracking-wider uppercase">
              <span className={currentPage === 1 ? 'text-indigo-600' : ''}>01. Profile</span>
              <span className={currentPage === 2 ? 'text-indigo-600' : ''}>02. Contact</span>
              <span className={currentPage === 3 ? 'text-indigo-600' : ''}>03. Security</span>
              <span className={currentPage === 4 ? 'text-indigo-600' : ''}>04. Branding</span>
              <span className={currentPage === 5 ? 'text-indigo-600' : ''}>05. Checkout</span>
            </div>
          </div>
        )}

        {/* WIZARD CONTENT CONTAINER */}
        <div className="flex-1 flex items-center justify-center py-8 px-6 md:px-12">
          <div className="w-full max-w-xl mx-auto">
            
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {isSuccess ? (
                // SUCCESS STATE TICKET DESIGN PANEL
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-emerald-600">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Registration Activated</span>
                    <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight animate-pulse">
                      School Instance Live & Provisioned! 🎉
                    </h2>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Your institutional slice has been fully configured. Print or download your secure registration receipt and official certificate below.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl text-left overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">School Unique ID</span>
                        <div className="text-xl font-mono font-bold text-indigo-700">{finalSchoolUniqueId}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(finalSchoolUniqueId);
                            alert("School ID copied!");
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Copy ID
                        </button>
                        <button 
                          onClick={() => setIsCertificateModalOpen(true)} 
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Print Receipt / SLA
                        </button>
                      </div>
                    </div>
                    <div className="p-5 space-y-3.5 text-xs text-slate-700 bg-white/50">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Registered School:</span>
                        <strong className="text-slate-900">{formData.institutionName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Database Tenant ID:</span>
                        <span className="text-slate-800 font-mono text-[10px] font-semibold">{finalTenantId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Licensing Tier:</span>
                        <strong className="text-indigo-700 uppercase">{selectedPlan} ({studentCapacity} Pupils)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Master Owner Account:</span>
                        <strong className="text-slate-900">{formData.ownerEmail}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Initial Payment (25%):</span>
                        <strong className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">₹{pricing.requiredInitialPayment.toLocaleString('en-IN')}.00 PAID</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      id="reg-success-proceed-btn"
                      onClick={() => navigate('/auth/login')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                      Proceed to Admin Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentPage}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40, scale: 0.99 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -direction * 40, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 w-full"
                >
                  
                  {/* STEP HEADER */}
                  <div>
                    {currentPage === 1 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 01 / 06</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Institution Profile</h3>
                        <p className="text-xs text-slate-500 mt-1">Specify your institution's registration profile and affiliation details.</p>
                      </div>
                    )}
                    {currentPage === 2 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 02 / 06</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Institution Contact</h3>
                        <p className="text-xs text-slate-500 mt-1">Provide direct physical address coordinates and official communication touchpoints.</p>
                      </div>
                    )}
                    {currentPage === 3 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 03 / 06</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Management & Security</h3>
                        <p className="text-xs text-slate-500 mt-1">Establish clear separation between ownership details and administrative login credentials.</p>
                      </div>
                    )}
                    {currentPage === 4 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 04 / 06</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Institution Branding</h3>
                        <p className="text-xs text-slate-500 mt-1">Set up custom themes, abbreviations, and aesthetic identities for the school portal.</p>
                      </div>
                    )}
                    {currentPage === 5 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 05 / 06</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Subscription Plan</h3>
                        <p className="text-xs text-slate-500 mt-1">Select your dynamic operating license capacity and billing cycle.</p>
                      </div>
                    )}
                    {currentPage === 6 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 06 / 06</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Review & Confirm</h3>
                        <p className="text-xs text-slate-500 mt-1">Please review all submitted information carefully before proceeding to secure payment.</p>
                      </div>
                    )}
                  </div>

                  {/* FIELDS PORTAL */}
                  <div className="space-y-4">
                    
                    {/* STEP 1 FIELDS (Institution Details) */}
                    {currentPage === 1 && (
                      <div className="space-y-4">
                        {/* Collapsible Resume Registration ID Panel */}
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                              <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider">Already started registering?</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowResumeInput(!showResumeInput);
                                setResumeError('');
                              }}
                              className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              {showResumeInput ? 'Cancel' : 'Resume Draft'}
                            </button>
                          </div>
                          
                          {showResumeInput && (
                            <div className="space-y-2 pt-2 border-t border-indigo-100/60">
                              <p className="text-[10px] text-slate-500">Enter your Registration ID (UUID format) to resume your saved draft where you left off.</p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                                  value={resumeIdInput}
                                  onChange={(e) => setResumeIdInput(e.target.value)}
                                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder:text-slate-400"
                                />
                                <button
                                  type="button"
                                  onClick={handleResumeDraft}
                                  disabled={isResuming}
                                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1"
                                >
                                  {isResuming ? 'Resuming...' : 'Load'}
                                </button>
                              </div>
                              {resumeError && (
                                <p className="text-[10px] font-bold text-rose-500">{resumeError}</p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="reg-institution-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Institution / School Name *
                          </label>
                          <div className="relative flex items-center">
                            <School className="absolute left-3 w-4 h-4 text-slate-400" />
                            <input 
                              id="reg-institution-name"
                              type="text" 
                              required
                              value={formData.institutionName}
                              onChange={(e) => handleInputChange('institutionName', e.target.value)}
                              onBlur={() => handleMarkTouched('institutionName')}
                              placeholder="e.g. Galaxy Public School"
                              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none placeholder:text-slate-400 ${
                                touchedFields.institutionName && !formData.institutionName.trim()
                                  ? 'border-rose-300 focus:border-rose-500'
                                  : 'border-slate-200 focus:border-indigo-600'
                              }`}
                            />
                            {touchedFields.institutionName && formData.institutionName.trim() && (
                              <CheckCircle className="absolute right-3 w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Institution Type *</label>
                            <select 
                              value={formData.institutionType}
                              onChange={(e) => handleInputChange('institutionType', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none cursor-pointer"
                            >
                              <option value="Co-Educational">Co-Educational</option>
                              <option value="Boys Only">Boys Only</option>
                              <option value="Girls Only">Girls Only</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">School Category</label>
                            <select 
                              value={formData.schoolCategory}
                              onChange={(e) => handleInputChange('schoolCategory', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none cursor-pointer"
                            >
                              <option value="K-12">K-12 (Primary + Secondary)</option>
                              <option value="Primary Only">Primary Only</option>
                              <option value="Secondary Only">Secondary Only</option>
                              <option value="University">Higher Education / University</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Board / Affiliation *</label>
                            <select 
                              value={formData.boardType}
                              onChange={(e) => handleInputChange('boardType', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none cursor-pointer"
                            >
                              <option value="CBSE">CBSE</option>
                              <option value="ICSE">ICSE</option>
                              <option value="State Board">State Board</option>
                              <option value="IB">International Baccalaureate (IB)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="reg-est-year" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Establishment Year *
                            </label>
                            <div className="relative flex items-center">
                              <Calendar className="absolute left-3 w-4 h-4 text-slate-400" />
                              <input 
                                id="reg-est-year"
                                type="number" 
                                required
                                value={formData.establishmentYear}
                                onChange={(e) => handleInputChange('establishmentYear', e.target.value)}
                                onBlur={() => handleMarkTouched('establishmentYear')}
                                placeholder="e.g. 2005"
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none ${
                                  touchedFields.establishmentYear && getStepValidationErrors(1).length > 0
                                    ? 'border-rose-300'
                                    : 'border-slate-200'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="reg-affiliation" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Affiliation Number (Optional)</label>
                            <input 
                              id="reg-affiliation"
                              type="text"
                              value={formData.affiliationNumber}
                              onChange={(e) => handleInputChange('affiliationNumber', e.target.value)}
                              placeholder="e.g. CBSE-110294"
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="reg-website" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Official Website (Optional)</label>
                            <input 
                              id="reg-website"
                              type="url"
                              value={formData.officialWebsite}
                              onChange={(e) => handleInputChange('officialWebsite', e.target.value)}
                              placeholder="e.g. https://school.edu"
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 FIELDS (Institution Contact) */}
                    {currentPage === 2 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="reg-official-email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Official Email *
                            </label>
                            <div className="relative flex items-center">
                              <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                              <input 
                                id="reg-official-email"
                                type="email" 
                                required
                                value={formData.officialEmail}
                                onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                                onBlur={() => handleMarkTouched('officialEmail')}
                                placeholder="contact@school.edu"
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none ${
                                  touchedFields.officialEmail && !formData.officialEmail.trim() ? 'border-rose-300' : 'border-slate-200'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="reg-official-phone" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Official Phone Number *
                            </label>
                            <div className="relative flex items-center">
                              <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                              <input 
                                id="reg-official-phone"
                                type="tel" 
                                required
                                value={formData.officialPhone}
                                onChange={(e) => handleInputChange('officialPhone', e.target.value)}
                                onBlur={() => handleMarkTouched('officialPhone')}
                                placeholder="e.g. +91 11 2345 6789"
                                className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none ${
                                  touchedFields.officialPhone && !formData.officialPhone.trim() ? 'border-rose-300' : 'border-slate-200'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="reg-street-address" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Address *</label>
                          <div className="relative flex items-center">
                            <MapPin className="absolute left-3 w-4 h-4 text-slate-400" />
                            <textarea 
                              id="reg-street-address"
                              required
                              rows={2}
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              onBlur={() => handleMarkTouched('address')}
                              placeholder="e.g. Sector 12, Main Street Road"
                              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none resize-none ${
                                touchedFields.address && !formData.address.trim() ? 'border-rose-300' : 'border-slate-200'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Country</label>
                            <div className="relative flex items-center">
                              <Globe className="absolute left-3 w-4 h-4 text-slate-400" />
                              <input 
                                type="text"
                                disabled
                                value={formData.country}
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-medium outline-none cursor-not-allowed"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">State *</label>
                            <input 
                              type="text"
                              value={formData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              onBlur={() => handleMarkTouched('state')}
                              placeholder="e.g. Maharashtra"
                              className={`w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none ${
                                touchedFields.state && !formData.state.trim() ? 'border-rose-300' : 'border-slate-200'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">City *</label>
                            <input 
                              type="text"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              onBlur={() => handleMarkTouched('city')}
                              placeholder="e.g. Mumbai"
                              className={`w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none ${
                                touchedFields.city && !formData.city.trim() ? 'border-rose-300' : 'border-slate-200'
                              }`}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">PIN Code *</label>
                            <input 
                              type="text"
                              value={formData.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              onBlur={() => handleMarkTouched('postalCode')}
                              placeholder="e.g. 400001"
                              maxLength={6}
                              className={`w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none ${
                                touchedFields.postalCode && !validatePincode(formData.postalCode) ? 'border-rose-300' : 'border-slate-200'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3 FIELDS (Owner & Security) */}
                    {currentPage === 3 && (
                      <div className="space-y-4">
                        <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-xl space-y-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-600" />
                            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Owner / Founder Details</h4>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <label htmlFor="reg-owner-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Owner Full Name *</label>
                              <input 
                                id="reg-owner-name"
                                type="text"
                                required
                                value={formData.ownerName}
                                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                                onBlur={() => handleMarkTouched('ownerName')}
                                placeholder="e.g. Manish Kumar"
                                className={`w-full px-4 py-2.5 bg-white border rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none ${
                                  touchedFields.ownerName && !formData.ownerName.trim() ? 'border-rose-300' : 'border-slate-200'
                                }`}
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label htmlFor="reg-owner-email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Owner Verified Email *</label>
                                <div className="relative flex items-center">
                                  <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                                  <input 
                                    id="reg-owner-email"
                                    type="email"
                                    required
                                    value={formData.ownerEmail}
                                    onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                                    onBlur={() => handleMarkTouched('ownerEmail')}
                                    placeholder="owner@school.com"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none ${
                                      touchedFields.ownerEmail && !validateEmail(formData.ownerEmail) ? 'border-rose-300' : 'border-slate-200'
                                    }`}
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label htmlFor="reg-owner-mobile" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verified Mobile *</label>
                                <div className="relative flex items-center">
                                  <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                                  <input 
                                    id="reg-owner-mobile"
                                    type="tel"
                                    required
                                    value={formData.ownerMobile}
                                    onChange={(e) => handleInputChange('ownerMobile', e.target.value)}
                                    onBlur={() => handleMarkTouched('ownerMobile')}
                                    placeholder="e.g. +91 98765 43210"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none ${
                                      touchedFields.ownerMobile && !validatePhone(formData.ownerMobile) ? 'border-rose-300' : 'border-slate-200'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-xl space-y-3">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">System Master Credentials</h4>
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label htmlFor="reg-admin-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Name (Optional)</label>
                                <input 
                                  id="reg-admin-name"
                                  type="text"
                                  value={formData.administratorName}
                                  onChange={(e) => handleInputChange('administratorName', e.target.value)}
                                  placeholder="Owner is Admin"
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 outline-none"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label htmlFor="reg-admin-designation" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Designation / Role *</label>
                                <input 
                                  id="reg-admin-designation"
                                  type="text"
                                  required
                                  value={formData.administratorDesignation}
                                  onChange={(e) => handleInputChange('administratorDesignation', e.target.value)}
                                  placeholder="e.g. Principal / Director"
                                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label htmlFor="reg-password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Administrative Master Password *</label>
                              <div className="relative flex items-center">
                                <Lock className="absolute left-3 w-4 h-4 text-slate-400" />
                                <input 
                                  id="reg-password"
                                  type={showPassword ? 'text' : 'password'}
                                  required
                                  value={password}
                                  onChange={(e) => handlePasswordChange(e.target.value)}
                                  placeholder="Enter secure master password"
                                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 outline-none font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(p => !p)}
                                  className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {password && (
                              <div className="space-y-1 pt-1">
                                <div className="flex items-center justify-between text-[9px] font-bold">
                                  <span className="text-slate-400">STRENGTH:</span>
                                  <span className={`${pwdStrength.text} uppercase`}>{pwdStrength.label}</span>
                                </div>
                                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                                    style={{ width: `${pwdStrength.score}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4 FIELDS (Branding & Identity) */}
                    {currentPage === 4 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="reg-short-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Institution Abbreviation (Short Name)
                            </label>
                            <input 
                              id="reg-short-name"
                              type="text"
                              value={formData.shortName}
                              onChange={(e) => handleInputChange('shortName', e.target.value)}
                              placeholder="e.g. GPS"
                              maxLength={10}
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="reg-logo-url" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Institutional Logo URL (Optional)
                            </label>
                            <input 
                              id="reg-logo-url"
                              type="url"
                              value={formData.logoUrl}
                              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                              placeholder="e.g. https://domain.edu/logo.png"
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 outline-none"
                            />
                          </div>
                        </div>

                        <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-xl space-y-3.5">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Institution Portal Theme</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase">Primary Brand Color</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="color"
                                  value={formData.primaryBrandColor}
                                  onChange={(e) => handleInputChange('primaryBrandColor', e.target.value)}
                                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer overflow-hidden p-0"
                                />
                                <span className="font-mono text-xs font-bold text-slate-700">{formData.primaryBrandColor}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-400 uppercase">Secondary Brand Color</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="color"
                                  value={formData.secondaryBrandColor}
                                  onChange={(e) => handleInputChange('secondaryBrandColor', e.target.value)}
                                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer overflow-hidden p-0"
                                />
                                <span className="font-mono text-xs font-bold text-slate-700">{formData.secondaryBrandColor}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Affiliation Proof</label>
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                              isDragging 
                                ? 'border-indigo-600 bg-indigo-50/50' 
                                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <input 
                              type="file" 
                              id="file-upload" 
                              className="hidden" 
                              onChange={handleFileChange}
                              accept=".pdf,.png,.jpg,.jpeg"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                              <Upload className="w-5 h-5 text-indigo-600 mb-2" />
                              <span className="text-xs font-bold text-slate-800">Drag & Drop Board Approval Certificate</span>
                              <span className="text-[10px] text-indigo-600 font-semibold mt-0.5">or click to browse PDF / PNG files</span>
                            </label>
                          </div>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-1">
                            {uploadedFiles.map((file, i) => (
                              <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs">
                                  <FileCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Uploaded</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 5 FIELDS (Plans, Capacity Billing & Dynamic Checkout) */}
                    {currentPage === 5 && (
                      <div className="space-y-4">
                        
                        {/* 1. Pricing Plan Selectors */}
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                            { id: 'silver', title: 'SILVER', rate: '₹30', desc: 'Standard administrative node' },
                            { id: 'gold', title: 'GOLD', rate: '₹45', desc: 'SLA priority support + SMS' },
                            { id: 'platinum', title: 'PLATINUM', rate: '₹60', desc: 'Galaxy AI + Smart Bus tracking' }
                          ].map((plan) => (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlan(plan.id as any)}
                              className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                selectedPlan === plan.id 
                                  ? 'border-indigo-600 bg-indigo-50/20' 
                                  : 'border-slate-200 bg-white hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Tier</span>
                                <strong className="text-xs text-slate-900 block mt-0.5">{plan.title}</strong>
                                <span className="text-[10px] text-indigo-600 font-extrabold mt-1 block">{plan.rate}<span className="text-[9px] text-slate-400 font-medium">/pupil</span></span>
                              </div>
                              <p className="text-[8px] text-slate-400 leading-tight mt-2">{plan.desc}</p>
                            </div>
                          ))}
                        </div>

                        {/* 2. Student Capacity Selector & Billing Cycle Toggle */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student Capacity (Pupils)</label>
                            <select 
                              value={studentCapacity}
                              onChange={(e) => setStudentCapacity(Number(e.target.value))}
                              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
                            >
                              {[100, 200, 500, 1000, 2000, 3000, 4000, 5000].map((cap) => (
                                <option key={cap} value={cap}>{cap} Students</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Billing Cycle</label>
                            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => setBillingCycle('monthly')}
                                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                                  billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                Monthly
                              </button>
                              <button
                                type="button"
                                onClick={() => setBillingCycle('annual')}
                                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all relative ${
                                  billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                Annual
                                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[7px] font-extrabold px-1 py-0.5 rounded-full uppercase scale-90 tracking-widest leading-none">2m Free</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 3. Dynamic Server-Synchronized Invoice Breakdown Card */}
                        <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 space-y-3 shadow-md">
                          <div className="border-b border-slate-800 pb-2 flex justify-between items-center text-xs">
                            <span className="font-bold text-[10px] text-indigo-400 uppercase tracking-wider">Dynamic SLA Cost Sheet</span>
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase">INR Currency Zone</span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Subscription Fee:</span>
                              <span>₹{pricing.baseAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Institutional Setup Fee:</span>
                              <span>₹{pricing.setupFee.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold text-slate-50 text-sm">
                              <span>Total Contract Value:</span>
                              <span>₹{pricing.totalAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="flex justify-between border-t border-dashed border-slate-800 pt-1.5 font-bold text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-900/40">
                              <span className="flex items-center gap-1">Required Initial Payment (25%): <HelpCircle className="w-3 h-3 text-emerald-500" title="Galaxy requires a mandatory 25% setup fee & SLA pledge to trigger secure cloud provisioning." /></span>
                              <span>₹{pricing.requiredInitialPayment.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 pt-1 leading-none">
                              <span>Remaining Balance Due (75%):</span>
                              <span>₹{pricing.remainingAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 6 FIELDS (Complete Review & Confirm) */}
                    {currentPage === 6 && (
                      <div className="space-y-6">
                        {/* Summary of Institution Profile */}
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 relative text-left">
                          <button 
                            type="button" 
                            onClick={() => { setDirection(-1); setCurrentPage(1); }} 
                            className="absolute top-3.5 right-3.5 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            Edit
                          </button>
                          <h4 className="text-xs font-bold text-slate-900 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                            <School className="w-3.5 h-3.5 text-slate-500" />
                            Institution Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-700">
                            <div><span className="text-slate-400 font-semibold block sm:inline">Name:</span> <strong className="text-slate-900">{formData.institutionName}</strong></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Type:</span> <span className="text-slate-900">{formData.institutionType}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Category:</span> <span className="text-slate-900">{formData.schoolCategory}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Board/Affiliation:</span> <span className="text-slate-900">{formData.boardType}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Affiliation No:</span> <span className="text-slate-900 font-mono">{formData.affiliationNumber || 'N/A'}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Establishment Year:</span> <span className="text-slate-900">{formData.establishmentYear}</span></div>
                            <div className="col-span-1 sm:col-span-2"><span className="text-slate-400 font-semibold block">Official Website:</span> <span className="text-slate-900 truncate block">{formData.officialWebsite || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* Summary of Institution Contact */}
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 relative text-left">
                          <button 
                            type="button" 
                            onClick={() => { setDirection(-1); setCurrentPage(2); }} 
                            className="absolute top-3.5 right-3.5 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            Edit
                          </button>
                          <h4 className="text-xs font-bold text-slate-900 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            Contact Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-700">
                            <div><span className="text-slate-400 font-semibold block sm:inline">Email:</span> <span className="text-slate-900">{formData.officialEmail}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Phone:</span> <span className="text-slate-900">{formData.officialPhone}</span></div>
                            <div className="col-span-1 sm:col-span-2"><span className="text-slate-400 font-semibold block">Address:</span> <span className="text-slate-900 block">{formData.address}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">City:</span> <span className="text-slate-900">{formData.city}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">State:</span> <span className="text-slate-900">{formData.state}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Country:</span> <span className="text-slate-900">{formData.country}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">PIN Code:</span> <span className="text-slate-900 font-mono">{formData.postalCode}</span></div>
                          </div>
                        </div>

                        {/* Summary of Owner/Admin Details */}
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 relative text-left">
                          <button 
                            type="button" 
                            onClick={() => { setDirection(-1); setCurrentPage(3); }} 
                            className="absolute top-3.5 right-3.5 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            Edit
                          </button>
                          <h4 className="text-xs font-bold text-slate-900 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            Owner & Administrator Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-700">
                            <div><span className="text-slate-400 font-semibold block sm:inline">Owner Name:</span> <strong className="text-slate-900">{formData.ownerName}</strong></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Admin Name:</span> <span className="text-slate-900">{formData.administratorName || 'Owner is Admin'}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Designation:</span> <span className="text-slate-900">{formData.administratorDesignation}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Email (Gmail):</span> <span className="text-slate-900">{formData.ownerEmail}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Mobile No:</span> <span className="text-slate-900 font-mono">{formData.ownerMobile}</span></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Password:</span> <span className="text-slate-900 font-mono">••••••••</span></div>
                          </div>
                        </div>

                        {/* Summary of Branding */}
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 relative text-left">
                          <button 
                            type="button" 
                            onClick={() => { setDirection(-1); setCurrentPage(4); }} 
                            className="absolute top-3.5 right-3.5 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            Edit
                          </button>
                          <h4 className="text-xs font-bold text-slate-900 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                            Institution Branding
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-700">
                            <div><span className="text-slate-400 font-semibold block sm:inline">Short Name:</span> <strong className="text-slate-900">{formData.shortName || 'N/A'}</strong></div>
                            <div>
                              <span className="text-slate-400 font-semibold block sm:inline">Colors:</span> 
                              <div className="flex gap-2 items-center mt-1 sm:mt-0 sm:inline-flex">
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" style={{ backgroundColor: formData.primaryBrandColor }}></span>
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block ml-1" style={{ backgroundColor: formData.secondaryBrandColor }}></span>
                              </div>
                            </div>
                            <div className="col-span-1 sm:col-span-2 flex items-center gap-2 mt-1">
                              <span className="text-slate-400 font-semibold">Logo Preview:</span>
                              {formData.logoUrl ? (
                                <img src={formData.logoUrl} alt="Logo preview" className="w-8 h-8 object-contain rounded border border-slate-200" referrerPolicy="no-referrer" />
                              ) : (
                                <span className="text-slate-500 italic text-[11px]">No custom logo uploaded</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Summary of Subscription */}
                        <div className="bg-slate-950 text-slate-100 border border-slate-800 rounded-xl p-4 relative text-left">
                          <button 
                            type="button" 
                            onClick={() => { setDirection(-1); setCurrentPage(5); }} 
                            className="absolute top-3.5 right-3.5 text-xs text-indigo-400 hover:text-indigo-500 font-bold"
                          >
                            Edit
                          </button>
                          <h4 className="text-xs font-bold text-indigo-400 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                            Subscription Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-300">
                            <div><span className="text-slate-400 font-semibold block sm:inline">Selected Plan:</span> <strong className="text-slate-100 uppercase">{selectedPlan}</strong></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Capacity Limit:</span> <strong className="text-slate-100">{studentCapacity} Pupils</strong></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Billing Cycle:</span> <strong className="text-slate-100 uppercase">{billingCycle}</strong></div>
                            <div><span className="text-slate-400 font-semibold block sm:inline">Setup Fee:</span> <strong className="text-slate-100">₹{pricing.setupFee.toLocaleString('en-IN')}.00</strong></div>
                            <div className="col-span-1 sm:col-span-2 border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold">
                              <span className="text-slate-400">Total Contract Value:</span>
                              <span className="text-slate-100">₹{pricing.totalAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-lg flex justify-between items-center text-sm font-bold text-emerald-400">
                              <span>Payable Now (25% Setup Pledge):</span>
                              <span>₹{pricing.requiredInitialPayment.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2 flex justify-between items-center text-[11px] text-slate-400">
                              <span>Remaining Balance (75% due later):</span>
                              <span>₹{pricing.remainingAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                          </div>
                        </div>

                        {/* Legal Agreement custom Checkbox */}
                        <div 
                          onClick={() => handleInputChange('agreeTerms', !formData.agreeTerms)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none text-left ${
                            formData.agreeTerms 
                              ? 'border-indigo-600 bg-indigo-50/30' 
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all ${
                            formData.agreeTerms 
                              ? 'bg-indigo-600 border-indigo-600 text-white' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {formData.agreeTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div className="flex-1">
                            <span className="text-xs font-bold text-slate-900 block mb-0.5">I confirm that all information provided is correct.</span>
                            <p className="text-[9px] text-slate-500 leading-normal">
                              I certify that all statements above represent authentic institutional data. I consent to secure database provisioning, automated Tenant Unique ID allocation, and Galaxy Cloud services privacy protocols. *
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* ERROR BANNER */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-semibold"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* NAVIGATION DOCK */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    {currentPage > 1 ? (
                      <button
                        id="reg-prev-btn"
                        type="button"
                        onClick={handlePrev}
                        className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Previous Step
                      </button>
                    ) : (
                      <button
                        id="reg-cancel-btn"
                        type="button"
                        onClick={() => navigate('/auth/login')}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all"
                      >
                        Cancel Setup
                      </button>
                    )}

                    {currentPage < totalPages ? (
                      <button
                        id="reg-next-btn"
                        type="button"
                        onClick={handleNext}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all shadow-indigo-100"
                      >
                        Next Step <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        id="reg-submit-btn"
                        type="button"
                        onClick={handleInitiatePayment}
                        disabled={isSubmitting || !formData.agreeTerms}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all shadow-emerald-100"
                      >
                        Pay 25% Initial Registration Amount <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

      <RegistrationCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        registrationId={registrationId || ""}
      />
    </div>
  );
};
