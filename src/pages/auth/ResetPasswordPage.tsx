import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { supabase } from '../../services/supabase';
import { GalaxyLogo } from '../../components/common/GalaxyLogo';

interface ResetPasswordPageProps {
  navigate: (path: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ navigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has an active recovery session or authenticated session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setHasRecoverySession(true);
      } else {
        // Look for hash fragments or query tokens from Supabase reset email
        const hash = window.location.hash;
        if (hash.includes('access_token=') || hash.includes('type=recovery')) {
          setHasRecoverySession(true);
        } else {
          setHasRecoverySession(false);
        }
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('दोनों password match होने चाहिए। (Passwords must match)');
      return;
    }

    const strength = AuthService.checkPasswordStrength(password);
    if (strength.score < 3) {
      setError('Password requirements meet नहीं हो रहे हैं।');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await AuthService.confirmPasswordReset('supabase_recovery_token', password);
      if (ok) {
        setIsSuccess(true);
      } else {
        setError('Recovery link expired or session invalid. Please request a new password reset email.');
      }
    } catch (err) {
      setError('Connection failure. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="reset-password-page" className="w-full max-w-md mx-auto pt-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 space-y-6"
      >
        <div className="space-y-1.5 text-center mb-4">
          <h2 className="text-xl font-black text-slate-800">
            Create New Password
          </h2>
        </div>

        {hasRecoverySession === false ? (
          <div className="space-y-4 text-center py-6">
            <div className="flex justify-center mb-4">
              <ShieldAlert className="h-16 w-16 text-rose-500" />
            </div>
            <h4 className="text-base font-black text-rose-600">
              Invalid or Expired Link
            </h4>
            <p className="text-sm font-bold text-slate-600 pb-4">
              यह password reset link expire हो चुका है या invalid है। कृपया नया link request करें।
            </p>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="w-full py-4 text-sm font-black rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-150 shadow-sm"
            >
              Request New Link
            </button>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4 text-center py-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <h4 className="text-base font-black text-emerald-600">
              ✓ Password Successfully Updated
            </h4>
            <p className="text-sm font-bold text-slate-600 pb-4">
              अब आप अपने नए password से Galaxy ERP में login कर सकते हैं।
            </p>
            <button
              id="return-login-after-success"
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-4 text-sm font-black rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-150 shadow-sm"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form id="reset-password-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="new-password" className="block text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-2 ml-1">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
                <button
                  id="toggle-reset-pwd-view"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="block text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-2 ml-1">
                Confirm New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-600 mb-2">Password requirements दिखाएँ:</p>
              <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4 font-semibold">
                <li className={password.length >= 8 ? 'text-emerald-600' : ''}>Minimum strong password length (8+ chars)</li>
                <li className={/[A-Z]/.test(password) ? 'text-emerald-600' : ''}>Uppercase letter</li>
                <li className={/[a-z]/.test(password) ? 'text-emerald-600' : ''}>Lowercase letter</li>
                <li className={/[0-9]/.test(password) ? 'text-emerald-600' : ''}>Number</li>
                <li className={/[^A-Za-z0-9]/.test(password) ? 'text-emerald-600' : ''}>Special character</li>
              </ul>
              {password.length > 0 && <div className="mt-3"><PasswordStrength password={password} /></div>}
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-bold text-center flex items-center justify-center gap-1">
                <ShieldAlert className="h-4 w-4" />
                {error}
              </p>
            )}

            <button
              id="confirm-reset-pwd-btn"
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Updating secure keys...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
