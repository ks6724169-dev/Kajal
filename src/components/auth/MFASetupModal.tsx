import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, QrCode, Lock, RefreshCw, CheckCircle, ShieldAlert, X, Copy, Trash2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { MFAService, TOTPEnrollmentResult } from '../../services/MFAService';

interface MFASetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MFASetupModal: React.FC<MFASetupModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'status' | 'enroll' | 'verify' | 'success'>('status');
  const [enrollment, setEnrollment] = useState<TOTPEnrollmentResult | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([]);
  const [currentAAL, setCurrentAAL] = useState<'aal1' | 'aal2'>('aal1');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch current AAL and factors when modal opens
  useEffect(() => {
    if (!isOpen) return;
    loadStatus();
  }, [isOpen]);

  const loadStatus = async () => {
    setIsLoading(true);
    setError('');
    try {
      const aal = await MFAService.getAssuranceLevel();
      setCurrentAAL(aal.currentLevel);
      setEnrolledFactors(aal.enrolledFactors);
      setStep('status');
    } catch (err) {
      setError('Failed to check MFA status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEnrollment = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await MFAService.enrollTOTP('Galaxy ERP Authenticator');
      if (res.success && res.factorId) {
        setEnrollment(res);
        setStep('enroll');
      } else {
        setError(res.error || 'Failed to initialize TOTP enrollment.');
      }
    } catch (err: any) {
      setError('An error occurred during enrollment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollment?.factorId) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await MFAService.challengeAndVerify(enrollment.factorId, verificationCode);
      if (res.success) {
        setStep('success');
        setTimeout(() => {
          loadStatus();
        }, 1500);
      } else {
        setError(res.error || 'Verification failed. Please check the code in your Authenticator App.');
      }
    } catch (err) {
      setError('Network failure during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFactor = async (factorId: string) => {
    if (!confirm('Are you sure you want to remove this MFA factor? Your security assurance level will decrease.')) {
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await MFAService.unenrollFactor(factorId);
      if (res.success) {
        await loadStatus();
      } else {
        setError(res.error || 'Failed to remove factor.');
      }
    } catch (err) {
      setError('Failed to unenroll factor.');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecretToClipboard = () => {
    if (enrollment?.secret) {
      navigator.clipboard.writeText(enrollment.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
              Two-Factor Authentication (TOTP)
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-100 dark:border-rose-900">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          {step === 'status' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Assurance Level</span>
                  <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    {currentAAL === 'aal2' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> AAL2 (MFA Verified)
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">AAL1 (Standard Password)</span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold">
                  {enrolledFactors.length} Factor(s) Enrolled
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Enrolled Security Factors</h4>
                {enrolledFactors.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No TOTP authenticator app enrolled yet.</p>
                ) : (
                  enrolledFactors.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-indigo-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{f.friendly_name || 'Authenticator App'}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Factor ID: {f.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFactor(f.id)}
                        disabled={isLoading}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove Factor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleStartEnrollment}
                  disabled={isLoading}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />}
                  Enroll Authenticator App
                </button>
              </div>
            </div>
          )}

          {step === 'enroll' && enrollment && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Scan QR Code with Authenticator App</p>
                <p className="text-[11px] text-slate-400">Use Google Authenticator, Authy, or Microsoft Authenticator.</p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 dark:border-slate-800 flex justify-center w-fit mx-auto shadow-inner">
                <QRCode value={enrollment.uri || ''} size={160} />
              </div>

              {/* Manual Entry Secret */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Manual Setup Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={enrollment.secret}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={copySecretToClipboard}
                    className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleVerifyEnrollment} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enter 6-Digit Code from Authenticator
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full text-center tracking-[0.5em] font-mono font-bold py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('status')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || verificationCode.length !== 6}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Verify & Enable MFA'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                Two-Factor Authentication Enabled!
              </h4>
              <p className="text-xs text-slate-400">
                Your account is now upgraded to AAL2 assurance level. Every subsequent login will require your TOTP Authenticator code.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
