import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/auth/LoginForm';
import { Languages } from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <div id="login-page-container" className="w-full max-w-md mx-auto relative select-none">
      {/* Language Header Toggle */}
      <div className="absolute top-0 right-0 flex items-center gap-2 z-20">
        <button
          id="lang-toggle-btn"
          type="button"
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs hover:bg-slate-50 hover:shadow-sm transition-all duration-150 cursor-pointer"
        >
          <Languages className="h-3.5 w-3.5 text-indigo-500" />
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      <div className="animate-in fade-in zoom-in duration-500">
        <LoginForm 
          language={lang} 
          onSuccess={() => {
            // Success is handled by authStore subscription in App.tsx
          }} 
        />
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
          <span className="text-slate-200">/</span>
          <button 
            onClick={() => navigate('verify-otp')}
            className="hover:text-indigo-600 hover:underline cursor-pointer transition"
          >
            {lang === 'en' ? 'Verify OTP' : 'OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};
