import React from 'react';
import { motion } from 'motion/react';

interface PricingToggleProps {
  billingCycle: 'monthly' | 'yearly';
  onChange: (cycle: 'monthly' | 'yearly') => void;
}

export const PricingToggle: React.FC<PricingToggleProps> = ({ billingCycle, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center relative">
        <motion.div
          animate={{ x: billingCycle === 'monthly' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute w-1/2 h-[calc(100%-12px)] bg-white rounded-xl shadow-sm z-0"
          style={{ left: 6 }}
        />
        <button
          onClick={() => onChange('monthly')}
          className={`relative z-10 px-8 py-2.5 text-sm font-bold transition-colors ${
            billingCycle === 'monthly' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onChange('yearly')}
          className={`relative z-10 px-8 py-2.5 text-sm font-bold transition-colors ${
            billingCycle === 'yearly' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          Yearly
        </button>
      </div>
      {billingCycle === 'yearly' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider"
        >
          Save 2 Months
        </motion.div>
      )}
    </div>
  );
};
