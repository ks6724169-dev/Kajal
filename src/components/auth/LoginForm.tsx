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
      <div className="text-center mb-6">
        <div className="flex flex-col items-center">
          <GalaxyLogo size="xl" showText={true} />
        </div>
      </div>

      {/* Main Login Form Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/70 relative overflow-hidden">
        
        {showMFAChallenge ? (
          <MFAChallenge
            onSuccess={handleMFASuccess}
            onCancel={() => setShowMFAChallenge(false)}
          />
        ) : (
          <>
            {/* Security badge notice */}
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-slate-700 font-bold">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                {language === 'hi' ? 'सर्वर-प्रमाणित भूमिका पहुँच' : 'Server-Authoritative Role Verification'}
              </span>
              <span className="text-[11px] text-indigo-600 uppercase tracking-wider font-black bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100/80">SECURE V2</span>
            </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold text-rose-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
          {/* 1. School Unique ID */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label htmlFor="school-id-input" className="block text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                {language === 'hi' ? 'स्कूल यूनिक आईडी' : 'School Unique ID'} <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'स्कूल खोजें' : 'Lookup School'}</span>
              </button>
            </div>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
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
                className={`w-full pl-12 pr-24 py-3.5 sm:py-4 bg-slate-50 border ${
                  fieldErrors.schoolId ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500'
                } rounded-2xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400`}
              />
              <button
                type="button"
                onClick={handleValidateSchoolCode}
                disabled={isValidatingSchool}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 text-xs font-extrabold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition cursor-pointer"
              >
                {isValidatingSchool ? <Loader2 className="w-4 h-4 animate-spin" /> : 'VALIDATE'}
              </button>
            </div>
            {fieldErrors.schoolId && (
              <p className="text-xs font-bold text-rose-500 mt-1.5 ml-1">{fieldErrors.schoolId}</p>
            )}
          </div>

          {/* 2. Institutional Email */}
          <div>
            <label htmlFor="email-input" className="block text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-2 ml-1">
              {language === 'hi' ? 'ईमेल आईडी / उपयोगकर्ता नाम' : 'Institutional Email / Username'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                id="email-input"
                type="email"
                placeholder="e.g. user@school.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border ${
                  fieldErrors.email ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500'
                } rounded-2xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:font-normal placeholder:text-slate-400`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs font-bold text-rose-500 mt-1.5 ml-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* 3. Password */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label htmlFor="password-input" className="block text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                {language === 'hi' ? 'पासवर्ड' : 'Password'} <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('/forgot-password') : null}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer transition"
              >
                {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 border ${
                  fieldErrors.password ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500'
                } rounded-2xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs font-bold text-rose-500 mt-1.5 ml-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* 4. Remember Me & Support */}
          <div className="flex items-center justify-between pt-2">
            <label htmlFor="remember_me_check" className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                id="remember_me_check"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                {language === 'hi' ? 'मुझे याद रखें' : 'Remember me'}
              </span>
            </label>

            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/contact') : null}
              className="text-xs sm:text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'hi' ? 'सहायता' : 'Help / Support'}</span>
            </button>
          </div>

          {/* 5. Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO GALAXY ERP</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 font-semibold mt-6">
          🔒 Encrypted enterprise connection. Unauthorized access attempts are logged and reported.
        </p>
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
