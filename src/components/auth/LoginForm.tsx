import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { 
  User, 
  Lock, 
  ArrowRight, 
  Mail, 
  Building2, 
  Search, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Smartphone,
  Globe,
  Loader2
} from 'lucide-react';
import { SchoolSearchModal } from './SchoolSearchModal';

interface LoginFormProps {
  onSuccess?: () => void;
  language?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  language = 'en' 
}) => {
  const { login, isLoading: authLoading } = useAuth();
  const { currentTenant, selectTenantByCode, branding } = useTenant();
  
  const [schoolCode, setSchoolCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [step, setStep] = useState<'school' | 'credentials'>('school');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync school code if tenant is already selected from domain or storage
  useEffect(() => {
    if (currentTenant?.schoolCode) {
      setSchoolCode(currentTenant.schoolCode);
      setStep('credentials');
    }
  }, [currentTenant]);

  const handleValidateSchool = async () => {
    if (!schoolCode.trim()) {
      setError(language === 'hi' ? 'कृपया स्कूल कोड दर्ज करें' : 'Please enter school code');
      return;
    }

    setIsValidatingCode(true);
    setError(null);
    
    try {
      const success = await selectTenantByCode(schoolCode.trim());
      if (success) {
        setStep('credentials');
      } else {
        setError(language === 'hi' ? 'अमान्य स्कूल कोड' : 'Invalid school code');
      }
    } catch (err) {
      setError('System resolution error. Please try again.');
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError(language === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all fields');
      return;
    }

    setError(null);
    try {
      await login(username, password, rememberMe);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const resetSchool = () => {
    setStep('school');
    setError(null);
  };

  return (
    <div id="enterprise-login-terminal" className="w-full max-w-md mx-auto">
      {/* Branding Header */}
      <div className="text-center mb-8">
        {step === 'credentials' && branding ? (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-20 h-20 bg-white p-2 rounded-2xl shadow-xl shadow-indigo-500/10 border border-slate-100 mb-4 overflow-hidden flex items-center justify-center">
              <img 
                src={branding.logo} 
                alt={currentTenant?.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {currentTenant?.name}
            </h1>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {currentTenant?.city}, {currentTenant?.state}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center text-white mb-4">
              <Building2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'गैलेक्सी ईआरपी' : 'Galaxy ERP'}
            </h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.25em] mt-1">
              Enterprise Suite
            </p>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        {/* Step 1: School Code Resolution */}
        {step === 'school' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                {language === 'hi' ? 'स्कूल कोड' : 'School Code'}
              </label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="e.g. ABC123"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-bold"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateSchool()}
                />
              </div>
            </div>

            <button
              onClick={handleValidateSchool}
              disabled={isValidatingCode}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isValidatingCode ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>RESOLVING TENANT...</span>
                </>
              ) : (
                <>
                  <span>VALIDATE SCHOOL</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Or</span>
              </div>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full py-4 bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-slate-600 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Search className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span>SEARCH YOUR SCHOOL</span>
            </button>

            <p className="text-[10px] text-center text-slate-400 font-bold leading-relaxed px-4">
              Authorized institutions only. Unauthorized access attempts are monitored and logged via Galaxy Sentinel.
            </p>
          </div>
        )}

        {/* Step 2: Credentials */}
        {step === 'credentials' && (
          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                {language === 'hi' ? 'उपयोगकर्ता नाम' : 'Username / Email'}
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Enter username"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2.5 ml-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <button type="button" className="text-[10px] font-black text-indigo-600 hover:text-indigo-500 uppercase tracking-widest">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember_me" className="ml-3 text-xs font-bold text-slate-500 select-none">
                {language === 'hi' ? 'मुझे याद रखें' : 'Keep me logged in on this workstation'}
              </label>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-shake">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <p className="text-xs font-bold text-rose-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={resetSchool}
                className="py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black text-sm rounded-2xl transition-all border border-slate-100"
              >
                BACK
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {authLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>ENTER SYSTEM</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-center gap-6 pt-2">
              <button type="button" className="p-3 bg-slate-50 hover:bg-white hover:shadow-md rounded-xl border border-slate-100 transition-all">
                <Smartphone className="w-5 h-5 text-slate-400" />
              </button>
              <button type="button" className="p-3 bg-slate-50 hover:bg-white hover:shadow-md rounded-xl border border-slate-100 transition-all">
                <Globe className="w-5 h-5 text-slate-400" />
              </button>
              <button type="button" className="p-3 bg-slate-50 hover:bg-white hover:shadow-md rounded-xl border border-slate-100 transition-all">
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </form>
        )}
      </div>

      <SchoolSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={(school) => {
          setSchoolCode(school.schoolCode || '');
          setIsSearchOpen(false);
          setStep('credentials');
          selectTenantByCode(school.schoolCode || '');
        }}
      />
    </div>
  );
};
