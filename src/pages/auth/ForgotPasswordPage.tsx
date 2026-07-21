import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send, CheckCircle, RefreshCw } from 'lucide-react';
import { AuthService } from '../../services/AuthService';

interface ForgotPasswordPageProps {
  navigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please specify a valid registered account email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.requestPasswordReset(email);
      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setError('Failed to initiate password recovery.');
      }
    } catch (err) {
      setError('Connection timeout. Please retry in a few moments.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="forgot-password-page" className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 space-y-6"
      >
        <div className="space-y-1.5 text-center">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-50">
            Recover Access Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Specify your employee or student email to receive a secure recovery code link.
          </p>
        </div>

        {successMsg ? (
          <div className="space-y-4 text-center py-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {successMsg}
            </p>
            <button
              id="return-login-after-success"
              type="button"
              onClick={() => navigate('/auth/login')}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-150 shadow-sm"
            >
              Return to Login Portal
            </button>
          </div>
        ) : (
          <form id="forgot-password-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="recovery-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alok.m@galaxy.edu"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
            )}

            <button
              id="request-reset-submit-btn"
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-all duration-150 shadow-sm flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Generating secure token...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send Reset Link
                </>
              )}
            </button>

            <button
              id="back-to-login-btn"
              type="button"
              onClick={() => navigate('/auth/login')}
              className="w-full py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-150 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Login Screen
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
