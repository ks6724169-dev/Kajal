import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Minus } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose }) => {
  const [comparison, setComparison] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/v1/pricing/compare')
        .then(res => res.json())
        .then(data => setComparison(data));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-white rounded-[2.5rem] z-[110] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Compare Plans</h2>
                <p className="text-sm font-medium text-slate-500">Detailed feature breakdown for every tier.</p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="text-left py-6 px-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-white sticky top-0">Feature</th>
                    <th className="text-center py-6 px-4 text-sm font-black text-slate-900 bg-white sticky top-0">Silver</th>
                    <th className="text-center py-6 px-4 text-sm font-black text-indigo-600 bg-white sticky top-0">Gold</th>
                    <th className="text-center py-6 px-4 text-sm font-black text-purple-600 bg-white sticky top-0">Platinum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {comparison.map((row, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-4 text-sm font-bold text-slate-700">{row.feature}</td>
                      <td className="py-5 px-4 text-center">
                        {row.silver ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <Minus className="w-5 h-5 text-slate-200 mx-auto" />}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {row.gold ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <Minus className="w-5 h-5 text-slate-200 mx-auto" />}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {row.platinum ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <Minus className="w-5 h-5 text-slate-200 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-center gap-4">
              <button className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors" onClick={onClose}>
                Close
              </button>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                Start Free Trial
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
