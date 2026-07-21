import React from 'react';
import { motion } from 'motion/react';
import { TenantSelector } from '../../components/auth/TenantSelector';

interface TenantSelectorPageProps {
  navigate: (path: string) => void;
}

export const TenantSelectorPage: React.FC<TenantSelectorPageProps> = ({ navigate }) => {
  const handleSelected = (tenantId: string) => {
    console.log('Tenant chosen:', tenantId);
    navigate('/auth/login');
  };

  return (
    <div id="tenant-selector-page" className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-50">
            Tenant Workspace Discovery
          </h2>
          <p className="text-xs text-slate-400">
            Locate your school, university, or educational corporate portal.
          </p>
        </div>

        <TenantSelector onSelected={handleSelected} />

        <div className="text-center pt-2">
          <button
            id="tenant-sel-back-btn"
            type="button"
            onClick={() => navigate('/auth/login')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Return to Login Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
