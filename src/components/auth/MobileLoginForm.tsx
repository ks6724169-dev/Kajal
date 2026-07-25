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
import { motion, AnimatePresence } from 'motion/react';
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
      <div className="text-center mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <GalaxyLogo size="xl" />
        </motion.div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
        {showMFAChallenge ? (
          <MFAChallenge
            onSuccess={handleMFASuccess}
            onCancel={() => setShowMFAChallenge(false)}
          />
        ) : (
          <>
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

            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    {language === 'hi' ? 'वापसी पर स्वागत है' : 'Sign in with phone'}
                  </h2>
                  <p className="text-[13px] text-slate-500 font-medium tracking-tight">
                    {language === 'hi' ? 'अपना पंजीकृत मोबाइल नंबर दर्ज करें' : 'Enter your registered mobile number.'}
                  </p>
                </div>

                <div>
                  <label htmlFor="phone-input" className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {language === 'hi' ? 'पंजीकृत मोबाइल नंबर' : 'Phone Number'}
                  </label>
                  <div className="relative group">
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
                      className={`w-full px-5 py-4 bg-white border ${
                        fieldError ? 'border-rose-300 focus:ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500'
                      } rounded-2xl text-[15px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:font-medium placeholder:text-slate-300`}
                    />
                  </div>
                  {fieldError && (
                    <p className="text-[11px] font-bold text-rose-500 mt-1.5 ml-1">{fieldError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[15px] rounded-2xl shadow-[0_10px_25px_rgba(79,70,229,0.2)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'जारी रखें' : 'Continue'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'select_institution' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    {language === 'hi' ? 'संस्थान चुनें' : 'Select Institution'}
                  </h2>
                  <p className="text-[13px] text-slate-500 font-medium tracking-tight">
                    {language === 'hi' ? 'यह नंबर कई संस्थानों से जुड़ा है' : 'Multiple institutions found for this number.'}
                  </p>
                </div>
                
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {institutions.map((inst, idx) => (
                    <button
                      key={inst.tenant_id || idx}
                      onClick={() => handleInstitutionSelect(inst)}
                      className="w-full text-left p-5 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all duration-300 group flex items-center justify-between shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {inst.logo ? (
                            <img src={inst.logo} alt={inst.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-6 h-6 text-indigo-200" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-900">{inst.name}</h3>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{inst.city} • {inst.role}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </button>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full py-4 text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {language === 'hi' ? 'पीछे जाएं' : 'Back to phone'}
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
              <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    {language === 'hi' ? 'OTP दर्ज करें' : 'Verify OTP'}
                  </h2>
                  <p className="text-[13px] text-slate-500 font-medium tracking-tight mb-4">
                    {language === 'hi' ? 'हमने आपके मोबाइल पर OTP भेजा है' : 'Sent to '}
                    <span className="text-indigo-600 font-bold">{phone}</span>
                  </p>
                </div>

                <div>
                  <label htmlFor="otp-input" className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 text-center">
                    {language === 'hi' ? 'OTP दर्ज करें' : 'Enter 6-digit code'}
                  </label>
                  <div className="relative group">
                    <input
                      id="otp-input"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/[^0-9]/g, ''));
                        if (fieldError) setFieldError('');
                      }}
                      className={`w-full px-5 py-6 bg-white border ${
                        fieldError ? 'border-rose-300 focus:ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500'
                      } rounded-[2rem] text-3xl text-center tracking-[0.5em] font-black text-slate-900 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all tabular-nums`}
                    />
                  </div>
                  {fieldError && (
                    <p className="text-[11px] font-bold text-rose-500 mt-3 ml-1 text-center">{fieldError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[15px] rounded-2xl shadow-[0_10px_25px_rgba(79,70,229,0.2)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'लॉगिन करें' : 'Login Securely'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep('delivery')}
                  disabled={isLoading}
                  className="w-full py-4 text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {language === 'hi' ? 'पीछे जाएं' : 'Back to delivery'}
                </button>
              </form>
            )}

            <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col items-center">
              <button
                type="button"
                onClick={onSwitchToPassword}
                className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {language === 'hi' ? 'पासवर्ड से लॉगिन करें' : 'Sign in with password instead'}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted Session</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
