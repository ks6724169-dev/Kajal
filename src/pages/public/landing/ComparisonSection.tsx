import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';

const features = [
  { name: 'Speed & Performance', old: 'Slow & Clunky', new: 'Lightning Fast' },
  { name: 'Offline Capabilities', old: 'No', new: 'Offline First' },
  { name: 'Artificial Intelligence', old: 'None', new: 'Native Galaxy AI' },
  { name: 'Workflow Automation', old: 'Manual', new: 'Fully Automated' },
  { name: 'Data Security', old: 'Basic', new: 'Enterprise Grade' },
  { name: 'Cloud Infrastructure', old: 'Legacy Servers', new: 'Cloud Native' },
  { name: 'Mobile Experience', old: 'Poor/None', new: 'Native Apps' },
  { name: 'Analytics & Reports', old: 'Static', new: 'Real-time Dashboards' },
  { name: 'Customization', old: 'Rigid', new: 'Highly Flexible' },
];

export const ComparisonSection: React.FC = () => {
  return (
    <div className="py-24 bg-slate-50 relative overflow-hidden" id="comparison">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">Why Galaxy ERP</h2>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            The modern standard for education.
          </h3>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-900 text-white p-6">
            <div className="font-bold uppercase tracking-wider text-xs text-slate-400 flex items-center">Feature</div>
            <div className="font-bold uppercase tracking-wider text-xs text-slate-400 text-center">Traditional ERP</div>
            <div className="font-bold uppercase tracking-wider text-xs text-indigo-400 text-center flex items-center justify-center gap-2">
              Galaxy ERP
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-3 p-6 hover:bg-slate-50 transition-colors items-center"
              >
                <div className="font-bold text-slate-700 text-sm">{feat.name}</div>
                <div className="text-center flex flex-col items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-medium text-slate-500">{feat.old}</span>
                </div>
                <div className="text-center flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-900">{feat.new}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
