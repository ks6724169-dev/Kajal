import React, { useState } from 'react';
import { LoginForm } from '../../components/auth/LoginForm';
import { MobileLoginForm } from '../../components/auth/MobileLoginForm';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const [loginMode, setLoginMode] = useState<'mobile' | 'password'>('mobile');

  return (
    <div id="login-page-container" className="w-full max-w-lg mx-auto relative select-none">
      <div className="animate-in fade-in duration-500">
        {loginMode === 'mobile' ? (
          <MobileLoginForm
            language="en"
            onNavigate={navigate}
            onSuccess={() => navigate('/app')}
            onSwitchToPassword={() => setLoginMode('password')}
          />
        ) : (
          <div className="space-y-6">
            <LoginForm 
              language="en" 
              onNavigate={navigate}
              onSuccess={() => navigate('/app')} 
            />
            <div className="px-12">
              <button
                type="button"
                onClick={() => setLoginMode('mobile')}
                className="w-full py-4 bg-white/80 hover:bg-white text-indigo-600 border border-slate-200/50 rounded-2xl text-[13px] font-bold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                Login with Mobile OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
