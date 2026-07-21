import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import { PasswordStrength } from '../../components/auth/PasswordStrength';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password entries must match exactly.');
      return;
    }

    const strength = AuthService.checkPasswordStrength(password);
    if (strength.score < 3) {
      setError('Password complexity is too low. Follow the checklist below.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate ticket resolution from url
      const ok = await AuthService.confirmPasswordReset('ticket_reset_123', password);
      if (ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        setError('Verification ticket expired or rejected.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="reset-password-page" className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 space-y-6"
      >
        <div className="space-y-1.5 text-center">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-50">
            Configure New Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure a secure login password complying with enterprise safety rules.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-3 text-center py-6">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Password Restored!
            </h4>
            <p className="text-xs text-slate-400">
              Your credentials updated. Returning to sign in workspace...
            </p>
          </div>
        ) : (
          <form id="reset-password-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="new-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
                <button
                  id="toggle-reset-pwd-view"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm-new-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {password.length > 0 && <PasswordStrength password={password} />}

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center flex items-center justify-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                {error}
              </p>
            )}

            <button
              id="confirm-reset-pwd-btn"
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-all duration-150 shadow-sm flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Updating secure keys...
                </>
              ) : (
                'Confirm New Password'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
