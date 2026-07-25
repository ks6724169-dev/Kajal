import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/auth/LoginForm';
import { MobileLoginForm } from '../../components/auth/MobileLoginForm';
import { Languages, HelpCircle, ShieldCheck } from 'lucide-react';
import { authStore } from '../../store/authStore';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const [loginMode, setLoginMode] = useState<'mobile' | 'password'>('mobile');

  const handleTestOwnerLogin = () => {
    authStore.login({
      id: 'dev-owner-1',
      name: 'Development Owner',
      role: 'organization_owner',
      email: 'owner@example.com'
    }, false);
    navigate('/app');
  };

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

      {/* Global Portal Utility Actions */}
      <div className="text-center pt-10 border-t border-slate-200 mt-12">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-6">
          Institutional Gateway
        </p>
        <div className="flex justify-center items-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-8">
          <button 
            onClick={() => navigate('register')}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Register
          </button>
          <button 
            type="button"
            onClick={() => navigate('/login-help')}
            className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>
        </div>

        {/* Developer/Testing Tool */}
        <div className="pt-4 border-t border-slate-100/50">
          <button
            onClick={handleTestOwnerLogin}
            className="group flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm border border-indigo-100/50"
          >
            <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Test Owner Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
