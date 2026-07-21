import React from 'react';
import { motion } from 'motion/react';
import { MFAChallenge } from '../../components/auth/MFAChallenge';

interface MFAChallengePageProps {
  navigate: (path: string) => void;
}

export const MFAChallengePage: React.FC<MFAChallengePageProps> = ({ navigate }) => {
  const handleSuccess = (mfaToken: string) => {
    console.log('MFA verification success', mfaToken);
    navigate('/dashboard');
  };

  return (
    <div id="mfa-challenge-page" className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8"
      >
        <MFAChallenge
          ticket="ticket_standalone_mfa"
          type="totp"
          onSuccess={handleSuccess}
          onCancel={() => navigate('/auth/login')}
        />
      </motion.div>
    </div>
  );
};
