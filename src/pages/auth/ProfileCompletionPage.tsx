import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Globe, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import { useAuth } from '../../hooks/useAuth';

interface ProfileCompletionPageProps {
  navigate: (path: string) => void;
}

export const ProfileCompletionPage: React.FC<ProfileCompletionPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setError('Please provide a valid 10-digit mobile contact number.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await AuthService.completeProfileSetup({
        userId: user?.id || 'usr-temp',
        phoneNumber,
        operatingLanguage: language,
        avatarUrl: avatar || undefined
      });

      if (ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Failed to save profile attributes.');
      }
    } catch (err) {
      setError('A connection timeout occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="profile-completion-page" className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 space-y-6"
      >
        <div className="space-y-1.5 text-center">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-50">
            Complete Enterprise Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set up your secondary profile requirements before accessing the operational system grids.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-3 text-center py-6 animate-pulse">
            <div className="flex justify-center">
              <UserCheck className="h-12 w-12 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Profile Completed!
            </h4>
            <p className="text-xs text-slate-400">
              Saving configurations. Redirecting to your workspace...
            </p>
          </div>
        ) : (
          <form id="profile-completion-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="comp-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Contact Mobile Number (MFA Destination)
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="comp-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Default Workspace Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="lang-opt-en"
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-2 text-xs font-bold rounded-lg border text-center transition-all duration-150 ${
                    language === 'en'
                      ? 'border-indigo-500 bg-indigo-50/40 text-indigo-700 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  English
                </button>
                <button
                  id="lang-opt-hi"
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`py-2 text-xs font-bold rounded-lg border text-center transition-all duration-150 ${
                    language === 'hi'
                      ? 'border-indigo-500 bg-indigo-50/40 text-indigo-700 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="comp-avatar" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Avatar Image URL (Optional)
              </label>
              <input
                id="comp-avatar"
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center flex items-center justify-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}

            <button
              id="profile-comp-submit-btn"
              type="submit"
              disabled={isLoading || phoneNumber.length < 10}
              className="w-full py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-all duration-150 shadow-sm flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Updating Onboarding Profiles...
                </>
              ) : (
                'Finalize Profile'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
