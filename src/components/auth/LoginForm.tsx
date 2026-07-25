import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Search, 
  XCircle, 
  Loader2, 
  HelpCircle, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CentralAuthService } from '../../core/auth/auth.service';
import { formatAuthError } from '../../core/auth/auth.errors';
import { GalaxyLogo } from '../common/GalaxyLogo';
import { SchoolSearchModal } from './SchoolSearchModal';
import { MFAChallenge } from './MFAChallenge';
import { useTenant } from '../../hooks/useTenant';
import { authStore } from '../../store/authStore';

interface LoginFormProps {
  onSuccess?: () => void;
  language?: string;
  onNavigate?: (path: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  language = 'en',
  onNavigate
}) => {
  const { currentTenant, selectTenantByCode, branding } = useTenant();

  // Form State
  const [schoolId, setSchoolId] = useState(currentTenant?.schoolCode || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // UI / Action State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isValidatingSchool, setIsValidatingSchool] = useState(false);

  const handleValidateSchoolCode = async () => {
    if (!schoolId.trim()) {
      setFieldErrors(prev => ({ ...prev, schoolId: language === 'hi' ? 'स्कूल आईडी आवश्यक है' : 'School Unique ID is required' }));
      return;
    }
    setFieldErrors(prev => ({ ...prev, schoolId: '' }));
    setIsValidatingSchool(true);
    try {
      await selectTenantByCode(schoolId.trim());
    } catch {
      // Non-blocking tenant resolution
    } finally {
      setIsValidatingSchool(false);
    }
  };

  const [showMFAChallenge, setShowMFAChallenge] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    setError(null);
    setFieldErrors({});

    // Client-side validation checks
    const errors: { [key: string]: string } = {};

    if (!schoolId.trim()) {
      errors.schoolId = language === 'hi' ? 'स्कूल यूनिक आईडी आवश्यक है' : 'School Unique ID is required';
    }

    if (!email.trim()) {
      errors.email = language === 'hi' ? 'ईमेल आईडी आवश्यक है' : 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = language === 'hi' ? 'अमान्य ईमेल प्रारूप' : 'Please enter a valid email address';
      }
    }

    if (!password) {
      errors.password = language === 'hi' ? 'पासवर्ड आवश्यक है' : 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(language === 'hi' ? 'कृपया हाइलाइट किए गए फ़ील्ड सही करें' : 'Please fix the errors below before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const result = await CentralAuthService.login({
        schoolId: schoolId.trim(),
        email: email.trim(),
        password,
        rememberMe
      });

      if (result.success) {
        if (result.mfaRequired) {
          setPendingUser(result.user);
          setShowMFAChallenge(true);
        } else {
          if (onSuccess) onSuccess();
        }
      } else {
        setError(result.error || (language === 'hi' ? 'प्रमाणीकरण विफल रहा' : 'Authentication failed. Check your credentials.'));
      }
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASuccess = () => {
    if (pendingUser) {
      authStore.login(pendingUser, rememberMe);
    }
    setShowMFAChallenge(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div id="galaxy-erp-login-card" className="w-full max-w-xl mx-auto">
      {/* Institution / Branding Header */}
      <div className="text-center mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <GalaxyLogo size="xl" />
        </motion.div>
      </div>

      {/* Main Login Form Container */}
      <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
        
        {showMFAChallenge ? (
          <MFAChallenge
            onSuccess={handleMFASuccess}
            onCancel={() => setShowMFAChallenge(false)}
          />
        ) : (
          <>
            {/* Security badge notice */}
            <div className="mb-10 flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                Sign in
              </h2>
              <p className="text-[13px] text-slate-500 font-medium tracking-tight">
                Enter your institutional credentials below.
              </p>
            </div>

        {/* Global Error Banner */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-start gap-3"
          >
            <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-[13px] font-bold text-rose-800">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
          {/* 1. School Unique ID */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label htmlFor="school-id-input" className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {language === 'hi' ? 'स्कूल यूनिक आईडी' : 'School ID'}
              </label>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {language === 'hi' ? 'स्कूल खोजें' : 'Lookup School'}
              </button>
            </div>
            <div className="relative">
              <input
                id="school-id-input"
                type="text"
                placeholder="e.g. SCH-1002"
                value={schoolId}
                onChange={(e) => {
                  setSchoolId(e.target.value.toUpperCase());
                  if (fieldErrors.schoolId) setFieldErrors(prev => ({ ...prev, schoolId: '' }));
                }}
                onBlur={handleValidateSchoolCode}
                className={`w-full px-5 py-4 bg-white border ${
                  fieldErrors.schoolId ? 'border-rose-300 focus:ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500'
                } rounded-2xl text-[15px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all uppercase placeholder:normal-case placeholder:font-medium placeholder:text-slate-300`}
              />
              <button
                type="button"
                onClick={handleValidateSchoolCode}
                disabled={isValidatingSchool}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition cursor-pointer uppercase tracking-tighter"
              >
                {isValidatingSchool ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Check'}
              </button>
            </div>
            {fieldErrors.schoolId && (
              <p className="text-[11px] font-bold text-rose-500 mt-1.5 ml-1">{fieldErrors.schoolId}</p>
            )}
          </div>

          {/* 2. Institutional Email */}
          <div>
            <label htmlFor="email-input" className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              {language === 'hi' ? 'ईमेल आईडी' : 'Email Address'}
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="name@school.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`w-full px-5 py-4 bg-white border ${
                fieldErrors.email ? 'border-rose-300 focus:ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500'
              } rounded-2xl text-[15px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:font-medium placeholder:text-slate-300`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] font-bold text-rose-500 mt-1.5 ml-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* 3. Password */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label htmlFor="password-input" className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {language === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('/forgot-password') : null}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot?'}
              </button>
            </div>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`w-full px-5 py-4 bg-white border ${
                  fieldErrors.password ? 'border-rose-300 focus:ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500'
                } rounded-2xl text-[15px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] font-bold text-rose-500 mt-1.5 ml-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* 4. Remember Me & Support */}
          <div className="flex items-center justify-between pt-2">
            <label htmlFor="remember_me_check" className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  id="remember_me_check"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500/20 transition cursor-pointer"
                />
              </div>
              <span className="text-[13px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                {language === 'hi' ? 'मुझे याद रखें' : 'Stay signed in'}
              </span>
            </label>
          </div>

          {/* 5. Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[15px] rounded-2xl shadow-[0_10px_25px_rgba(79,70,229,0.2)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted Session</span>
        </div>
          </>
        )}
      </div>

      <SchoolSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={(school) => {
          setSchoolId(school.schoolCode || '');
          setIsSearchOpen(false);
          selectTenantByCode(school.schoolCode || '');
        }}
      />
    </div>
  );
};
