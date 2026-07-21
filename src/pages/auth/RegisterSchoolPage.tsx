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
  Cpu,
  Zap,
  Award,
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
  HelpCircle
} from 'lucide-react';

interface RegisterSchoolPageProps {
  navigate: (path: string) => void;
}

export const RegisterSchoolPage: React.FC<RegisterSchoolPageProps> = ({ navigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const totalPages = 5;

  // Form State
  const [formData, setFormData] = useState({
    // Page 1: Institution Information (Phase 01)
    schoolName: '',
    schoolType: 'Co-Educational',
    schoolCategory: 'K-12',
    boardType: 'CBSE',
    establishedYear: new Date().getFullYear().toString(),
    country: 'India',
    state: '',
    district: '',
    city: '',
    pincode: '',
    address: '',
    
    // Page 2: Admin & Principal Info
    principalName: '',
    principalEmail: '',
    principalPhone: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    totalStudents: '1200',
    totalTeachers: '65',

    // Page 3: Plan & Billing
    selectedPlan: 'Standard ERP',
    billingCycle: 'Annual',

    // Page 4: Documents & Logo Upload
    logoUrl: '',
    agreeTerms: false
  });

  // Custom visual States
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Save & Auto-save States
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('just now');
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, progress: number}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
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
      if (!formData.schoolName.trim()) errors.push('School Name is required');
      if (!formData.boardType) errors.push('Affiliation Board is required');
      if (!formData.state.trim()) errors.push('State is required');
      if (!formData.district.trim()) errors.push('District is required');
      if (!formData.city.trim()) errors.push('City is required');
      if (!formData.pincode.trim()) {
        errors.push('PIN Code is required');
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        errors.push('PIN Code must be a 6-digit number');
      }
      if (!formData.address.trim()) errors.push('Street Address is required');
    } else if (step === 2) {
      if (!formData.principalName.trim()) errors.push('Principal Name is required');
      if (!formData.principalEmail.trim()) {
        errors.push('Principal Email is required');
      } else if (!validateEmail(formData.principalEmail)) {
        errors.push('Principal Email is invalid');
      }
      if (!formData.principalPhone.trim()) {
        errors.push('Principal Contact number is required');
      } else if (!validatePhone(formData.principalPhone)) {
        errors.push('Principal Contact number is invalid');
      }

      if (!formData.adminName.trim()) errors.push('Admin Name is required');
      if (!formData.adminEmail.trim()) {
        errors.push('Administrator Email is required');
      } else if (!validateEmail(formData.adminEmail)) {
        errors.push('Administrator Email is invalid');
      }
      if (!formData.adminPhone.trim()) {
        errors.push('Administrator Contact number is required');
      } else if (!validatePhone(formData.adminPhone)) {
        errors.push('Administrator Contact number is invalid');
      }

      if (password && password.length < 8) {
        errors.push('Administrative Password must be at least 8 characters long');
      }
    } else if (step === 4) {
      if (formData.logoUrl && !validateURL(formData.logoUrl)) {
        errors.push('Logo URL must be a valid image link');
      }
    } else if (step === 5) {
      if (!formData.agreeTerms) {
        errors.push('You must agree to the Terms of Service & SLA Covenant');
      }
    }
    return errors;
  };

  const handleNext = async () => {
    const stepErrors = getStepValidationErrors(currentPage);
    if (stepErrors.length > 0) {
      setError(stepErrors[0]);
      // Mark all fields in current page as touched to trigger inline red styling
      if (currentPage === 1) {
        setTouchedFields({
          schoolName: true,
          boardType: true,
          state: true,
          district: true,
          city: true,
          pincode: true,
          address: true
        });
      } else if (currentPage === 2) {
        setTouchedFields({
          principalName: true,
          principalEmail: true,
          principalPhone: true,
          adminName: true,
          adminEmail: true,
          adminPhone: true
        });
      }
      return;
    }
    setError('');

    // Phase 01: Integrate Backend call on Step 1 Next
    if (currentPage === 1 && !registrationId) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/v1/school-registration/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolName: formData.schoolName,
            schoolType: formData.schoolType,
            schoolCategory: formData.schoolCategory,
            board: formData.boardType,
            establishmentYear: parseInt(formData.establishedYear),
            country: formData.country,
            state: formData.state,
            district: formData.district,
            city: formData.city,
            pincode: formData.pincode,
            address: formData.address,
          })
        });

        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to start registration');

        const regId = data.data?.registration_id;
        if (!regId) {
          throw new Error('Registration ID was not returned by the server');
        }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalErrors = getStepValidationErrors(5);
    if (finalErrors.length > 0) {
      setError(finalErrors[0]);
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/school-registration/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId,
          formData,
          password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      setIsSuccess(true);
      // Clean up draft on successful registration
      try {
        localStorage.removeItem('galaxy_erp_reg_draft');
      } catch (err) {}
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
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
              // Set logo URL for form context if image was uploaded
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
      
      {/* BACKGROUND DECORATIVE BLUR BLOBS (Subtle light grays, indigos - NO neon effects) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-50/40 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-50/30 blur-[130px] pointer-events-none z-0"></div>

      {/* LEFT PANEL - 40% Width (Hidden on smaller viewports, beautiful premium slide-in on desktop) */}
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

        {/* Live CSS Interactive Dashboard Graphic / Mock Panel */}
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
                  <h4 className="text-[11px] font-bold text-slate-900">Biometric Facial Attendance</h4>
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

        {/* Trust Badges & Secure Footer */}
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

      {/* RIGHT PANEL - 60% Width (Fully responsive, occupies 100vh on small screens) */}
      <div className="w-full lg:w-[60%] flex flex-col justify-between min-h-screen bg-white relative overflow-y-auto z-10">
        
        {/* TOP STATUS BAR & HEADER NAVIGATION */}
        <div className="px-6 py-4 md:px-12 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2.5 lg:hidden" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-11.795H13.62l1.317-7.3H9L6 11.23H10.5l-1.688 4.674z" />
              </svg>
            </div>
            <span className="font-display font-extrabold text-sm tracking-wide text-slate-900">GALAXY ERP</span>
          </div>

          {/* Save Draft Indicator (Floating Status indicator) */}
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
                  title="Manual Save"
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

        {/* MODERN WIZARD PROGRESS BAR */}
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
            
            {/* Step Titles under Progress */}
            <div className="max-w-xl mx-auto flex justify-between text-[10px] font-bold text-slate-400 mt-2 tracking-wider uppercase">
              <span className={currentPage === 1 ? 'text-indigo-600' : ''}>01. Profile</span>
              <span className={currentPage === 2 ? 'text-indigo-600' : ''}>02. Admin</span>
              <span className={currentPage === 3 ? 'text-indigo-600' : ''}>03. License</span>
              <span className={currentPage === 4 ? 'text-indigo-600' : ''}>04. Upload</span>
              <span className={currentPage === 5 ? 'text-indigo-600' : ''}>05. Consent</span>
            </div>
          </div>
        )}

        {/* WIZARD CONTENT - WRAPPED IN FRAMER MOTION DIRECTIONS */}
        <div className="flex-1 flex items-center justify-center py-8 px-6 md:px-12">
          <div className="w-full max-w-xl mx-auto">
            
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {isSuccess ? (
                // SUCCESS STATE PANEL WITH TICKET DESIGN
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
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Onboarding Initiated</span>
                    <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                      Institutional Node Configured
                    </h2>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Congratulations! Your university/school node has been provisionally provisioned. Galaxy compliance operators are review-locking your state affiliation parameters to unlock live logins.
                    </p>
                  </div>

                  {/* Summary Ticket Details */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl text-left overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-100/40 flex justify-between items-center">
                      <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">PROVISIONAL ID CARRIER</span>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">GALAXY-V4-SYS</span>
                    </div>
                    <div className="p-5 space-y-3.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Campus Unit Name:</span>
                        <strong className="text-slate-800">{formData.schoolName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Platform Board:</span>
                        <strong className="text-slate-800">{formData.boardType} Board</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Assigned Admin ID:</span>
                        <strong className="text-indigo-600 font-mono">{formData.adminEmail}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">License Subscribed:</span>
                        <strong className="text-slate-800">{formData.selectedPlan} ({formData.billingCycle})</strong>
                      </div>
                    </div>
                    <div className="p-4 bg-indigo-50/50 border-t border-slate-100 text-[11px] text-indigo-950 flex gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Next steps dispatch:</strong> Temporary credential keys are routed to your administrator inbox. Onboard advisors will dial <strong className="text-slate-900">{formData.adminPhone || '+91 9123456789'}</strong> to aid terminal configurations.
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      id="reg-success-proceed-btn"
                      onClick={() => navigate('/auth/login')}
                      className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                      Proceed to Secure Console Gate <ArrowRight className="w-4 h-4" />
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
                  
                  {/* STEP TITLE HEADER */}
                  <div>
                    {currentPage === 1 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 01 / 05</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Institutional Profile</h3>
                        <p className="text-xs text-slate-500 mt-1">Set up your campus registry parameters, affiliation codes, and geographic site coordinates.</p>
                      </div>
                    )}
                    {currentPage === 2 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 02 / 05</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Principal & ERP Administrator</h3>
                        <p className="text-xs text-slate-500 mt-1">Configure campus credentials and key administrative points of contact.</p>
                      </div>
                    )}
                    {currentPage === 3 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 03 / 05</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Platform License Tier</h3>
                        <p className="text-xs text-slate-500 mt-1">Select a service plan scaled precisely to your campus demographics.</p>
                      </div>
                    )}
                    {currentPage === 4 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 04 / 05</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Institutional Branding</h3>
                        <p className="text-xs text-slate-500 mt-1">Upload school/university logo assets and official registration logs.</p>
                      </div>
                    )}
                    {currentPage === 5 && (
                      <div>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">Step 05 / 05</span>
                        <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">Review & Sign Consent</h3>
                        <p className="text-xs text-slate-500 mt-1">Verify all parameters lock and sign off the Educational Operating Covenant.</p>
                      </div>
                    )}
                  </div>

                  {/* FORM FIELDS PER STEP */}
                  <div className="space-y-4">
                    
                    {/* STEP 1 FIELDS (Phase 01) */}
                    {currentPage === 1 && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label htmlFor="reg-school-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            School / Institution Name *
                          </label>
                          <div className="relative flex items-center">
                            <School className="absolute left-3 w-4 h-4 text-slate-400" />
                            <input 
                              id="reg-school-name"
                              type="text" 
                              required
                              value={formData.schoolName}
                              onChange={(e) => handleInputChange('schoolName', e.target.value)}
                              onBlur={() => handleMarkTouched('schoolName')}
                              placeholder="e.g. Apex International School"
                              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none placeholder:text-slate-400 ${
                                touchedFields.schoolName && !formData.schoolName.trim()
                                  ? 'border-rose-300 focus:border-rose-500'
                                  : 'border-slate-200 focus:border-indigo-600'
                              }`}
                            />
                            {touchedFields.schoolName && formData.schoolName.trim() && (
                              <CheckCircle className="absolute right-3 w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">School Type</label>
                            <select 
                              value={formData.schoolType}
                              onChange={(e) => handleInputChange('schoolType', e.target.value)}
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
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Board *</label>
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
                              Establishment Year
                            </label>
                            <div className="relative flex items-center">
                              <Calendar className="absolute left-3 w-4 h-4 text-slate-400" />
                              <input 
                                id="reg-est-year"
                                type="number" 
                                value={formData.establishedYear}
                                onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                                placeholder="e.g. 2010"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none"
                              />
                            </div>
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

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">District *</label>
                            <input 
                              type="text"
                              value={formData.district}
                              onChange={(e) => handleInputChange('district', e.target.value)}
                              onBlur={() => handleMarkTouched('district')}
                              placeholder="e.g. Mumbai City"
                              className={`w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none ${
                                touchedFields.district && !formData.district.trim() ? 'border-rose-300' : 'border-slate-200'
                              }`}
                            />
                          </div>

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
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pincode *</label>
                            <input 
                              type="text"
                              value={formData.pincode}
                              onChange={(e) => handleInputChange('pincode', e.target.value)}
                              onBlur={() => handleMarkTouched('pincode')}
                              placeholder="400001"
                              maxLength={6}
                              className={`w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none ${
                                touchedFields.pincode && !/^\d{6}$/.test(formData.pincode) ? 'border-rose-300' : 'border-slate-200'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="reg-street-address" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Address *</label>
                          <div className="relative flex items-center">
                            <MapPin className="absolute left-3 w-4 h-4 text-slate-400" />
                            <textarea 
                              id="reg-street-address"
                              required
                              rows={2}
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              onBlur={() => handleMarkTouched('address')}
                              placeholder="e.g. Sector 62, Landmark Gate"
                              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none placeholder:text-slate-400 resize-none ${
                                touchedFields.address && !formData.address.trim()
                                  ? 'border-rose-300 focus:border-rose-500'
                                  : 'border-slate-200 focus:border-indigo-600'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 FIELDS */}
                    {currentPage === 2 && (
                      <div className="space-y-5">
                        
                        {/* Principal Profile Box */}
                        <div className="bg-slate-50/60 p-5 border border-slate-100 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4.5 h-4.5 text-indigo-600" />
                            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">1. Institution Principal Persona</h4>
                          </div>

                          <div className="space-y-3.5">
                            <div className="space-y-1.5">
                              <label htmlFor="reg-principal-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                              <input 
                                id="reg-principal-name"
                                type="text"
                                required
                                value={formData.principalName}
                                onChange={(e) => handleInputChange('principalName', e.target.value)}
                                placeholder="e.g. Dr. Arthur Pendelton"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label htmlFor="reg-principal-email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Official Email *</label>
                                <div className="relative flex items-center">
                                  <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                                  <input 
                                    id="reg-principal-email"
                                    type="email"
                                    required
                                    value={formData.principalEmail}
                                    onChange={(e) => handleInputChange('principalEmail', e.target.value)}
                                    placeholder="principal@academy.edu"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label htmlFor="reg-principal-phone" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Number *</label>
                                <div className="relative flex items-center">
                                  <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                                  <input 
                                    id="reg-principal-phone"
                                    type="tel"
                                    required
                                    value={formData.principalPhone}
                                    onChange={(e) => handleInputChange('principalPhone', e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Admin Persona Box */}
                        <div className="bg-slate-50/60 p-5 border border-slate-100 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
                            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">2. Primary System Administrator Credentials</h4>
                          </div>

                          <div className="space-y-3.5">
                            <div className="space-y-1.5">
                              <label htmlFor="reg-admin-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Administrator Full Name *</label>
                              <input 
                                id="reg-admin-name"
                                type="text"
                                required
                                value={formData.adminName}
                                onChange={(e) => handleInputChange('adminName', e.target.value)}
                                placeholder="e.g. Sarah Jenkins"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label htmlFor="reg-admin-email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sign In Email (Admin ID) *</label>
                                <div className="relative flex items-center">
                                  <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                                  <input 
                                    id="reg-admin-email"
                                    type="email"
                                    required
                                    value={formData.adminEmail}
                                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                                    placeholder="admin@academy.edu"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label htmlFor="reg-admin-phone" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Alert Phone *</label>
                                <div className="relative flex items-center">
                                  <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                                  <input 
                                    id="reg-admin-phone"
                                    type="tel"
                                    required
                                    value={formData.adminPhone}
                                    onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                                    placeholder="+91 91234 56789"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Password input + dynamic strength meter */}
                            <div className="space-y-1.5">
                              <label htmlFor="reg-password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Create Administrative Security Password *</label>
                              <div className="relative flex items-center">
                                <Lock className="absolute left-3 w-4 h-4 text-slate-400" />
                                <input 
                                  id="reg-password"
                                  type={showPassword ? 'text' : 'password'}
                                  required
                                  value={password}
                                  onChange={(e) => handlePasswordChange(e.target.value)}
                                  placeholder="Establish unbreakable root password"
                                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(p => !p)}
                                  className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>

                              {/* PASSWORD STRENGTH METERS */}
                              {password && (
                                <div className="space-y-1 pt-1.5">
                                  <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-slate-400">PASSWORD STRENGTH:</span>
                                    <span className={`${pwdStrength.text} uppercase tracking-wider`}>{pwdStrength.label}</span>
                                  </div>
                                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                                      style={{ width: `${pwdStrength.score}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-[9px] text-slate-400 block leading-tight">Must possess at least 8 characters including mixed casing, numeric digits, and special characters.</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Demographics Estimates */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Student Count</label>
                            <select 
                              value={formData.totalStudents}
                              onChange={(e) => handleInputChange('totalStudents', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none cursor-pointer"
                            >
                              <option value="150">1 - 250 students</option>
                              <option value="500">251 - 500 students</option>
                              <option value="1200">501 - 1,500 students</option>
                              <option value="3000">1,501 - 5,000 students</option>
                              <option value="8000">5000+ Enterprise scale</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Teacher Count</label>
                            <select 
                              value={formData.totalTeachers}
                              onChange={(e) => handleInputChange('totalTeachers', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all outline-none cursor-pointer"
                            >
                              <option value="15">1 - 25 teachers</option>
                              <option value="40">26 - 50 teachers</option>
                              <option value="65">51 - 100 teachers</option>
                              <option value="150">101 - 200 teachers</option>
                              <option value="400">200+ Enterprise scale</option>
                            </select>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* STEP 3 FIELDS */}
                    {currentPage === 3 && (
                      <div className="space-y-6">
                        
                        {/* Billing Cycle Selector Toggle */}
                        <div className="flex justify-center">
                          <div className="bg-slate-100 p-1 rounded-xl inline-flex items-center gap-1 border border-slate-200/50">
                            <button
                              type="button"
                              onClick={() => handleInputChange('billingCycle', 'Monthly')}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                formData.billingCycle === 'Monthly' 
                                  ? 'bg-white text-indigo-600 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Monthly Billing
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInputChange('billingCycle', 'Annual')}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                                formData.billingCycle === 'Annual' 
                                  ? 'bg-white text-indigo-600 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Annual Billing 
                              <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black">SAVE 15%</span>
                            </button>
                          </div>
                        </div>

                        {/* License pricing cards */}
                        <div className="space-y-3">
                          {[
                            { 
                              name: 'Starter Suite', 
                              annPrice: '₹24,999/yr', 
                              monPrice: '₹2,499/mo',
                              desc: 'Built for smaller campus groups. Includes student directories, core marks, basic portals, and online UPI fee desks.',
                              limit: 'Up to 250 Students'
                            },
                            { 
                              name: 'Standard ERP', 
                              annPrice: '₹49,999/yr', 
                              monPrice: '₹4,999/mo',
                              desc: 'The complete digital operating system. Includes CCTV security alerts, parent SMS integration, and face check-ins.',
                              limit: 'Up to 1,500 Students',
                              popular: true
                            },
                            { 
                              name: 'Enterprise Cloud', 
                              annPrice: '₹99,999/yr', 
                              monPrice: '₹9,999/mo',
                              desc: 'Infinite scaling with multi-campus synchronization node capabilities. 24/7 dedicated deployment engineer support.',
                              limit: 'Unlimited Campus Scale'
                            }
                          ].map((plan) => {
                            const isSelected = formData.selectedPlan === plan.name;
                            const priceString = formData.billingCycle === 'Annual' ? plan.annPrice : plan.monPrice;
                            
                            return (
                              <div
                                key={plan.name}
                                onClick={() => handleInputChange('selectedPlan', plan.name)}
                                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                                  isSelected
                                    ? 'border-indigo-600 bg-indigo-50/30 shadow-md ring-4 ring-indigo-50'
                                    : 'border-slate-200 bg-white hover:bg-slate-50/50 hover:border-slate-300'
                                }`}
                              >
                                <div className="space-y-1.5 max-w-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="font-display font-extrabold text-sm text-slate-900">{plan.name}</span>
                                    {plan.popular && <span className="text-[8px] bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">POPULAR choice</span>}
                                  </div>
                                  <p className="text-[11px] text-slate-500 leading-relaxed">{plan.desc}</p>
                                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block">{plan.limit}</span>
                                </div>
                                <div className="sm:text-right flex-shrink-0">
                                  <span className="text-lg font-black text-slate-900 tracking-tight block">{priceString}</span>
                                  <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">Billed {formData.billingCycle}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 4 FIELDS */}
                    {currentPage === 4 && (
                      <div className="space-y-5">
                        
                        <div className="space-y-1.5">
                          <label htmlFor="reg-logo-url" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Institutional Logo URL (Optional)
                          </label>
                          <div className="relative flex items-center">
                            <Globe className="absolute left-3 w-4 h-4 text-slate-400" />
                            <input 
                              id="reg-logo-url"
                              type="url"
                              value={formData.logoUrl}
                              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                              placeholder="e.g. https://domain.edu/assets/logo.png"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all outline-none"
                            />
                          </div>
                        </div>

                        {/* Interactive Drag and Drop Upload Zone */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Verification & Affiliation Documents
                          </label>
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
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
                              accept=".pdf,.png,.jpg,.jpeg,.xlsx"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                              <div className="w-11 h-11 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-3.5">
                                <Upload className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold text-slate-800">Drag Board Affiliation Certificate or spreadsheet</span>
                              <span className="text-[10px] text-indigo-600 font-semibold mt-1">or browse dynamic files on disk</span>
                              <span className="text-[9px] text-slate-400 mt-2">Supported Formats: PDF, PNG, JPG, EXCEL up to 10MB</span>
                            </label>
                          </div>
                        </div>

                        {/* File Upload List with Real progress bar simulation */}
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Artifact queue</span>
                            <div className="space-y-2">
                              {uploadedFiles.map((file, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <FileCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                                      <p className="text-[9px] text-slate-400">{file.size}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {file.progress < 100 ? (
                                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-indigo-600 h-full transition-all duration-200" style={{ width: `${file.progress}%` }}></div>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Uploaded</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-4 bg-slate-50/80 border border-slate-150 rounded-xl text-[11px] text-slate-500 leading-relaxed flex gap-2.5">
                          <Sparkles className="w-4.5 h-4.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <p>
                            Uploading board approval credentials fast-tracks review locks. If unprovided, your node can proceed under a provisional review duration of 48 hours.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STEP 5 FIELDS */}
                    {currentPage === 5 && (
                      <div className="space-y-4">
                        
                        {/* Consolidated Review Cards */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-4 text-xs text-slate-700">
                          <div className="border-b border-slate-200 pb-2.5 flex justify-between items-center">
                            <span className="font-display font-bold text-slate-900 uppercase tracking-wide text-xs">Review registration</span>
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">LOCKED</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Campus Unit Name</span>
                              <strong className="text-slate-800 text-[13px]">{formData.schoolName}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Campus Code ID</span>
                              <strong className="text-slate-800 text-[13px] font-mono">{formData.schoolCode}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Board / Campus Type</span>
                              <strong className="text-slate-800">{formData.boardType} / {formData.schoolType}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Site Location</span>
                              <strong className="text-slate-800">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">School Principal</span>
                              <strong className="text-slate-800">{formData.principalName}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Administrator Email</span>
                              <strong className="text-indigo-600 font-mono">{formData.adminEmail}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">License Tier Selected</span>
                              <strong className="text-slate-800">{formData.selectedPlan} ({formData.billingCycle})</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Students / Staff</span>
                              <strong className="text-slate-800">~{formData.totalStudents} Std / {formData.totalTeachers} Teachers</strong>
                            </div>
                          </div>
                        </div>

                        {/* Interactive custom Checkbox */}
                        <div 
                          onClick={() => handleInputChange('agreeTerms', !formData.agreeTerms)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
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
                            <span className="text-xs font-bold text-slate-900 block mb-0.5">Authorize legal covenant & SLA guidelines</span>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              I certify that I am the legally empowered organizational representative for this school unit. I consent to automatic cloud provisioning, AES-256 secure biometric scanning storage directives, and GALAXY ERP standard privacy covenants. *
                            </p>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* ERROR BANNER ACCENT */}
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

                  {/* ACTIONS DOCK NAVIGATION */}
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
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.agreeTerms}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all shadow-emerald-100"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering Node...
                          </>
                        ) : (
                          <>
                            Deploy School Instance <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
};
