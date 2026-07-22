import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, RefreshCw, Key } from 'lucide-react';
import { MFAService } from '../../services/MFAService';

interface MFAChallengeProps {
  factorId?: string;
  ticket?: string;
  type?: 'totp' | 'backup';
  onSuccess: (mfaToken: string) => void;
  onCancel: () => void;
}

export const MFAChallenge: React.FC<MFAChallengeProps> = ({
  factorId: propFactorId,
  onSuccess,
  onCancel
}) => {
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState('');
  const [activeFactorId, setActiveFactorId] = useState<string>(propFactorId || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingFactor, setIsLoadingFactor] = useState(!propFactorId);

  // Auto-discover enrolled factor if factorId not passed in props
  useEffect(() => {
    if (propFactorId) {
      setActiveFactorId(propFactorId);
      setIsLoadingFactor(false);
      return;
    }

    const loadEnrolledFactor = async () => {
      setIsLoadingFactor(true);
      try {
        const aal = await MFAService.getAssuranceLevel();
        if (aal.enrolledFactors.length > 0) {
          setActiveFactorId(aal.enrolledFactors[0].id);
        } else {
          setError('No enrolled TOTP MFA factor found for this account.');
        }
      } catch (err) {
        setError('Failed to query enrolled MFA factors.');
      } finally {
        setIsLoadingFactor(false);
      }
    };

    loadEnrolledFactor();
  }, [propFactorId]);

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
          setError('Invalid 8-digit emergency recovery code.');
        }
      } else {
        if (!activeFactorId) {
          // If no active factor ID, try with fallback identifier
          const res = await MFAService.challengeAndVerify('default_totp_factor', code);
          if (res.success && res.token) {
            onSuccess(res.token);
          } else {
            setError(res.error || 'Verification failed. Please retry.');
          }
        } else {
          const res = await MFAService.challengeAndVerify(activeFactorId, code);
          if (res.success && res.token) {
            onSuccess(res.token);
          } else {
            setError(res.error || 'Invalid code.');
          }
        }
      }
    } catch (err) {
      setError('A connection error occurred during verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoadingFactor) {
    return (
      <div className="py-8 text-center space-y-2">
        <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-semibold">Locating Authenticator MFA Challenge...</p>
      </div>
    );
  }

  return (
    <div id="mfa-challenge-component" className="space-y-4">
      <div className="text-center pb-2">
        <div className="inline-flex p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 mb-2">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {useBackupCode ? 'Use Emergency Recovery Code' : 'Two-Factor Authentication'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {useBackupCode
            ? 'Enter one of your 8-digit emergency recovery codes.'
            : 'Enter the 6-digit verification code from your Authenticator App (Google Authenticator / Authy).'}
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
              6-Digit Authenticator Code
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
                autoFocus
              />
            </div>
          </div>
        )}

        {error && (
          <p id="mfa-error" className="text-[11px] text-red-500 font-medium text-center flex items-center gap-1 justify-center">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
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
            Cancel
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
              'Verify & Grant Access'
            )}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between text-[11px] pt-1">
        {useBackupCode ? (
          <button
            id="mfa-toggle-normal-btn"
            type="button"
            onClick={() => setUseBackupCode(false)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold mx-auto"
          >
            Return to Authenticator App
          </button>
        ) : (
          <button
            id="mfa-toggle-backup-btn"
            type="button"
            onClick={() => setUseBackupCode(true)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold mx-auto"
          >
            Use Emergency Recovery Code
          </button>
        )}
      </div>
    </div>
  );
};
