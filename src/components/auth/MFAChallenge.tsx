import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, ShieldAlert, KeyRound, RefreshCw, Key, Landmark } from 'lucide-react';
import { MFAService } from '../../services/MFAService';

interface MFAChallengeProps {
  ticket: string;
  type: 'otp_email' | 'otp_sms' | 'totp';
  onSuccess: (mfaToken: string) => void;
  onCancel: () => void;
}

export const MFAChallenge: React.FC<MFAChallengeProps> = ({
  ticket,
  type,
  onSuccess,
  onCancel
}) => {
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verification timer countdown
  useEffect(() => {
    if (timer <= 0 || useBackupCode) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, useBackupCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      if (useBackupCode) {
        const ok = await MFAService.verifyBackupCode(backupCode);
        if (ok) {
          onSuccess(`backup_bypass_${Math.random().toString(36).substring(2)}`);
        } else {
          setError('Invalid backup recovery code.');
        }
      } else {
        const res = await MFAService.verifyChallenge(ticket, code, type);
        if (res.success && res.token) {
          onSuccess(res.token);
        } else {
          setError(res.error || 'Invalid code.');
        }
      }
    } catch (err) {
      setError('A connection error occurred during verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError('');
    const ok = await MFAService.requestCodeResend(ticket, type === 'otp_sms' ? 'sms' : 'email');
    if (ok) {
      setTimer(60);
    } else {
      setError('Failed to resend code.');
    }
  };

  return (
    <div id="mfa-challenge-component" className="space-y-4">
      <div className="text-center pb-2">
        <div className="inline-flex p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 mb-2">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {useBackupCode ? 'Use Backup Recovery Code' : 'Two-Factor Authentication'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {useBackupCode
            ? 'Enter one of your 8-digit emergency recovery codes.'
            : type === 'totp'
            ? 'Enter the 6-digit code from your Authenticator App.'
            : `Enter the verification code sent to your registered ${
                type === 'otp_sms' ? 'mobile device' : 'email address'
              }.`}
        </p>
      </div>

      <form id="mfa-form" onSubmit={handleSubmit} className="space-y-4">
        {useBackupCode ? (
          <div className="space-y-1">
            <label htmlFor="backup-code" className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              8-Digit Recovery Code
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="backup-code"
                type="text"
                maxLength={8}
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.replace(/\D/g, ''))}
                placeholder="12345678"
                className="w-full pl-9 pr-3 py-2 text-center text-xs tracking-[0.5em] font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <label htmlFor="mfa-code" className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              6-Digit Verification Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="mfa-code"
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full pl-9 pr-3 py-2 text-center text-sm tracking-[0.75em] font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {error && (
          <p id="mfa-error" className="text-[11px] text-red-500 font-medium text-center flex items-center gap-1 justify-center">
            <ShieldAlert className="h-3 w-3" />
            {error}
          </p>
        )}

        <div className="flex gap-2.5 pt-1">
          <button
            id="mfa-cancel-btn"
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-150"
          >
            Go Back
          </button>
          <button
            id="mfa-submit-btn"
            type="submit"
            disabled={isVerifying || (useBackupCode ? backupCode.length !== 8 : code.length !== 6)}
            className="flex-grow py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all duration-150 shadow-sm flex items-center justify-center gap-1.5"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Sign In'
            )}
          </button>
        </div>
      </form>

      {!useBackupCode && (
        <div className="flex items-center justify-between text-[11px] pt-1">
          <button
            id="mfa-resend-btn"
            type="button"
            disabled={timer > 0}
            onClick={handleResend}
            className={`font-semibold ${
              timer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-indigo-600 dark:text-indigo-400 hover:underline'
            }`}
          >
            {timer > 0 ? `Resend code in ${timer}s` : 'Resend Verification Code'}
          </button>
          <button
            id="mfa-toggle-backup-btn"
            type="button"
            onClick={() => setUseBackupCode(true)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Use Recovery Code
          </button>
        </div>
      )}

      {useBackupCode && (
        <div className="text-center text-[11px]">
          <button
            id="mfa-toggle-normal-btn"
            type="button"
            onClick={() => setUseBackupCode(false)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Return to Standard 2FA
          </button>
        </div>
      )}
    </div>
  );
};
