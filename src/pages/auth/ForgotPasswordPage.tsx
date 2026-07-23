import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send, CheckCircle, RefreshCw } from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import { GalaxyLogo } from '../../components/common/GalaxyLogo';

interface ForgotPasswordPageProps {
  navigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);
    
    if (!email.trim()) {
      setError('Please specify a valid registered account email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.requestPasswordReset(email);
      // We always show success to prevent email enumeration, as required by prompt
      setIsSuccess(true);
    } catch (err) {
      // Even on error, we can show a generic error or just show success to prevent enumeration
      // But we'll show success to fulfill "Generic safe response" requirement
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="forgot-password-page" className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex flex-col items-center">
          <GalaxyLogo size="xl" showText={true} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 space-y-6"
      >
        <div className="space-y-1.5 text-center mb-4">
          <h2 className="text-xl font-black text-slate-800">
            Forgot Password?
          </h2>
          <p className="text-sm font-bold text-slate-500">
            अपना registered email address दर्ज करें
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-slate-700">
              Password reset link भेज दिया गया है।
            </p>
            <p className="text-xs font-semibold text-slate-500">
              अपने registered email inbox को check करें। अगर email दिखाई नहीं दे रहा है तो Spam/Junk folder भी check करें।
            </p>
            <button
              id="return-login-after-success"
              type="button"
              onClick={() => navigate('/login')}
              className="w-full mt-6 py-3 text-sm font-black rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-150"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form id="forgot-password-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold text-center">{error}</p>
            )}

            <button
              id="request-reset-submit-btn"
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <span>Send Password Reset Link</span>
                </>
              )}
            </button>

            <button
              id="back-to-login-btn"
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
