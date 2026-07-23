import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/auth/LoginForm';
import { MobileLoginForm } from '../../components/auth/MobileLoginForm';
import { Languages } from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [loginMode, setLoginMode] = useState<'mobile' | 'password'>('mobile');

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <div id="login-page-container" className="w-full max-w-xl mx-auto relative select-none">
      {/* Language Header Toggle */}
      <div className="flex justify-end mb-3">
        <button
          id="lang-toggle-btn"
          type="button"
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 text-xs text-slate-600 font-bold bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs hover:bg-slate-50 hover:shadow-sm transition-all duration-150 cursor-pointer"
        >
          <Languages className="h-4 w-4 text-indigo-600" />
          <span>{lang === 'en' ? 'हिंदी में देखें' : 'Switch to English'}</span>
        </button>
      </div>

      <div className="animate-in fade-in duration-300">
        {loginMode === 'mobile' ? (
          <MobileLoginForm
            language={lang}
            onNavigate={navigate}
            onSuccess={() => navigate('/app')}
            onSwitchToPassword={() => setLoginMode('password')}
          />
        ) : (
          <div>
            <LoginForm 
              language={lang} 
              onNavigate={navigate}
              onSuccess={() => navigate('/app')} 
            />
            <div className="mt-4 px-6 sm:px-8 md:px-10 max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => setLoginMode('mobile')}
                className="w-full py-3 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm"
              >
                {lang === 'en' ? 'Login with Mobile OTP' : 'मोबाइल OTP से लॉगिन करें'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global Portal Utility Actions */}
      <div className="text-center pt-8 border-t border-slate-100 space-y-4 select-none mt-8">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
          Institutional Directory Gateway
        </p>
        <div className="flex justify-center items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-wider">
          <button 
            onClick={() => navigate('school-lookup')}
            className="hover:text-indigo-600 hover:underline cursor-pointer transition"
          >
            {lang === 'en' ? 'Lookup School' : 'स्कूल खोजें'}
          </button>
          <span className="text-slate-200">/</span>
          <button 
            onClick={() => navigate('register')}
            className="hover:text-indigo-600 hover:underline cursor-pointer transition"
          >
            {lang === 'en' ? 'Register' : 'पंजीकरण'}
          </button>
        </div>
      </div>
    </div>
  );
};
