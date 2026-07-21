import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { KeyRound, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VerifyOTPPageProps {
  navigate: (path: string) => void;
}

export const VerifyOTPPage: React.FC<VerifyOTPPageProps> = ({ navigate }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '').substring(0, 1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto focus next box
    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setError('');
    alert('A fresh 6-digit secure authentication code was dispatched to your registered device.');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fullCode = otp.join('');

    if (fullCode.length < 6) {
      setError('Please provide the full 6-digit verification pin.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Let's accept standard code (e.g. 123456) or anything for demo
      if (fullCode === '000000' || fullCode.length === 6) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Verification code is invalid or has expired.');
      }
    }, 1500);
  };

  return (
    <div id="verify-otp-page" className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 space-y-6"
      >
        <div className="space-y-1.5 text-center">
          <div className="flex justify-center mb-1">
            <span className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-900">
              <KeyRound className="h-6 w-6" />
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-50">
            Verify Dynamic OTP Passcode
          </h2>
          <p className="text-xs text-slate-400">
            A temporary 6-digit authorization PIN has been dispatched to your active enterprise device.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3 animate-pulse">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Passcode Authenticated!
            </h4>
            <p className="text-xs text-slate-400">
              Verifying credentials footprint. Access granted...
            </p>
          </div>
        ) : (
          <form id="otp-verify-form" onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-lg font-extrabold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </p>
            )}

            <button
              id="otp-verify-submit-btn"
              type="submit"
              disabled={isLoading || otp.join('').length < 6}
              className="w-full py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-all duration-150 shadow-sm flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Authorizing pin...
                </>
              ) : (
                'Verify & Proceed'
              )}
            </button>

            <div className="text-center space-y-1.5">
              <p className="text-xs text-slate-400">
                {canResend ? (
                  <span>Didn't receive codes?</span>
                ) : (
                  <span>Resend code link in <strong className="text-indigo-600 font-mono font-bold">{timer}s</strong></span>
                )}
              </p>
              
              <button
                id="otp-resend-btn"
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline disabled:opacity-50"
              >
                Resend Verification PIN
              </button>
            </div>

            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-900">
              <button
                id="otp-cancel-btn"
                type="button"
                onClick={() => navigate('/auth/login')}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold hover:underline"
              >
                ← Return to Sign In Screen
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
