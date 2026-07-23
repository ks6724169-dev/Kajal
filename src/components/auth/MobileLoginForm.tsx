import React, { useState } from 'react';
import { 
  Phone,
  ArrowRight,
  Loader2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Building2,
  Lock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import { useTenant } from '../../hooks/useTenant';
import { GalaxyLogo } from '../common/GalaxyLogo';
import { MFAChallenge } from './MFAChallenge';
import { authStore } from '../../store/authStore';

interface MobileLoginFormProps {
  onSuccess?: () => void;
  language?: string;
  onNavigate?: (path: string) => void;
  onSwitchToPassword?: () => void;
}

type LoginStep = 'phone' | 'select_institution' | 'delivery' | 'otp';

export const MobileLoginForm: React.FC<MobileLoginFormProps> = ({ 
  onSuccess, 
  language = 'en',
  onNavigate,
  onSwitchToPassword
}) => {
  const { selectTenantByCode } = useTenant();

  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState('');
  
  const [showMFAChallenge, setShowMFAChallenge] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setFieldError('');

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFieldError(language === 'hi' ? 'मान्य मोबाइल नंबर दर्ज करें' : 'Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const activeInstitutions = await AuthService.lookupInstitutionsByPhone(cleanPhone);
      
      if (!activeInstitutions || activeInstitutions.length === 0) {
        setError(language === 'hi' ? 'यह मोबाइल नंबर किसी सक्रिय पंजीकृत संस्थान से जुड़ा नहीं है।' : 'This mobile number is not associated with any active registered institution.');
      } else if (activeInstitutions.length === 1) {
        setSelectedInstitution(activeInstitutions[0]);
        setStep('delivery');
      } else {
        setInstitutions(activeInstitutions);
        setStep('select_institution');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to lookup mobile number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstitutionSelect = (inst: any) => {
    setSelectedInstitution(inst);
    setStep('delivery');
  };

  const handleRequestOtp = async (selectedChannel: 'sms' | 'whatsapp') => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    setChannel(selectedChannel);

    try {
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      let finalPhone = cleanPhone;
      if (!finalPhone.startsWith('+')) {
        finalPhone = `+91${finalPhone}`;
      }
      const result = await AuthService.requestMobileOtp(finalPhone, selectedChannel);
      
      if (result.success) {
        setStep('otp');
      } else {
        setError(result.error || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setFieldError('');

    if (!otp || otp.length < 6) {
      setFieldError(language === 'hi' ? 'मान्य 6-अंकीय OTP दर्ज करें' : 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      let finalPhone = cleanPhone;
      if (!finalPhone.startsWith('+')) {
        finalPhone = `+91${finalPhone}`;
      }
      const result = await AuthService.verifyMobileOtp(
        finalPhone, 
        otp, 
        { tenantId: selectedInstitution.tenant_id, schoolCode: selectedInstitution.code },
        rememberMe
      );

      if (result.success) {
        if (result.mfaRequired) {
          setPendingUser(result.user);
          setShowMFAChallenge(true);
        } else {
          if (onSuccess) onSuccess();
        }
      } else {
        setError(result.error || (language === 'hi' ? 'OTP सत्यापन विफल रहा' : 'OTP verification failed.'));
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during verification.');
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
    <div id="galaxy-erp-mobile-login" className="w-full max-w-xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex flex-col items-center">
          <GalaxyLogo size="xl" showText={true} />
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/70 relative overflow-hidden">
        {showMFAChallenge ? (
          <MFAChallenge
            onSuccess={handleMFASuccess}
            onCancel={() => setShowMFAChallenge(false)}
          />
        ) : (
          <>
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-slate-700 font-bold">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                {language === 'hi' ? 'सर्वर-प्रमाणित भूमिका पहुँच' : 'Server-Authoritative Role Verification'}
              </span>
              <span className="text-[11px] text-indigo-600 uppercase tracking-wider font-black bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100/80">SECURE V2</span>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-rose-800">{error}</p>
                </div>
              </div>
            )}

            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-slate-800">
                    {language === 'hi' ? 'वापसी पर स्वागत है' : 'Welcome Back'}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">
                    {language === 'hi' ? 'अपना पंजीकृत मोबाइल नंबर दर्ज करें' : 'Enter your registered mobile number'}
                  </p>
                </div>

                <div>
                  <label htmlFor="phone-input" className="block text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-2 ml-1">
                    {language === 'hi' ? 'पंजीकृत मोबाइल नंबर' : 'Registered Mobile Number'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      id="phone-input"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldError) setFieldError('');
                        if (error) setError(null);
                      }}
                      className={`w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border ${
                        fieldError ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500'
                      } rounded-2xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all`}
                    />
                  </div>
                  {fieldError && (
                    <p className="text-xs font-bold text-rose-500 mt-1.5 ml-1">{fieldError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>{language === 'hi' ? 'खोज रहा है...' : 'LOOKING UP...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'जारी रखें' : 'CONTINUE'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'select_institution' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-slate-800">
                    {language === 'hi' ? 'संस्थान चुनें' : 'Select Institution'}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">
                    {language === 'hi' ? 'यह नंबर कई संस्थानों से जुड़ा है' : 'This number is registered to multiple institutions'}
                  </p>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {institutions.map((inst, idx) => (
                    <button
                      key={inst.tenant_id || idx}
                      onClick={() => handleInstitutionSelect(inst)}
                      className="w-full text-left p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl transition-colors group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {inst.logo ? (
                            <img src={inst.logo} alt={inst.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900">{inst.name}</h3>
                          <p className="text-xs font-bold text-slate-500">{inst.city}, {inst.state} • Role: <span className="capitalize">{inst.role}</span></p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </button>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mt-2"
                >
                  {language === 'hi' ? 'पीछे जाएं' : 'Go Back'}
                </button>
              </div>
            )}

            {step === 'delivery' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-slate-800">
                    {language === 'hi' ? 'सत्यापन विधि चुनें' : 'Choose Verification Method'}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">
                    {language === 'hi' ? 'हम आपको OTP कैसे भेजें?' : 'How should we send you the OTP?'}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRequestOtp('sms')}
                  disabled={isLoading}
                  className="w-full p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all group flex items-center gap-4 text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">Send OTP via SMS</h3>
                    <p className="text-xs font-bold text-slate-500">Standard text message delivery</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRequestOtp('whatsapp')}
                  disabled={isLoading}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 text-left opacity-60 cursor-not-allowed"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">Send OTP via WhatsApp</h3>
                    <p className="text-xs font-bold text-rose-500">WhatsApp OTP temporarily unavailable</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(institutions.length > 1 ? 'select_institution' : 'phone')}
                  disabled={isLoading}
                  className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mt-2"
                >
                  {language === 'hi' ? 'पीछे जाएं' : 'Go Back'}
                </button>
              </div>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-slate-800">
                    {language === 'hi' ? 'OTP दर्ज करें' : 'Enter OTP'}
                  </h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">
                    {language === 'hi' ? 'हमने आपके मोबाइल पर OTP भेजा है' : 'We sent an OTP to your mobile number'}
                  </p>
                  <div className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block">
                    {phone}
                  </div>
                </div>

                <div>
                  <label htmlFor="otp-input" className="block text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-2 ml-1">
                    {language === 'hi' ? 'OTP दर्ज करें' : 'OTP'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      id="otp-input"
                      type="text"
                      placeholder="••••••"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/[^0-9]/g, ''));
                        if (fieldError) setFieldError('');
                      }}
                      className={`w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border ${
                        fieldError ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500'
                      } rounded-2xl text-lg text-center tracking-widest font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all`}
                    />
                  </div>
                  {fieldError && (
                    <p className="text-xs font-bold text-rose-500 mt-1.5 ml-1 text-center">{fieldError}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <label htmlFor="remember_me_check_mobile" className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      id="remember_me_check_mobile"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-slate-700">
                      {language === 'hi' ? 'मुझे याद रखें' : 'Remember me'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>{language === 'hi' ? 'सत्यापित कर रहा है...' : 'VERIFYING...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'लॉगिन करें' : 'LOGIN SECURELY'}</span>
                      <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep('delivery')}
                  disabled={isLoading}
                  className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mt-2"
                >
                  {language === 'hi' ? 'पीछे जाएं' : 'Go Back'}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onSwitchToPassword}
                className="w-full py-3 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'पासवर्ड से लॉगिन करें' : 'Login with Password'}
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-400 font-semibold mt-4">
              🔒 Encrypted enterprise connection. Unauthorized access attempts are logged and reported.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
