import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const PricingFAQ: React.FC = () => {
  const faqs = [
    {
      q: "How does billing work?",
      a: "Galaxy ERP offers both monthly and annual billing options. With annual billing, you save equivalent to 2 months of subscription. All payments are processed securely via our encrypted payment gateway."
    },
    {
      q: "Can I upgrade or downgrade later?",
      a: "Yes! You can upgrade your plan at any time through your management dashboard. Plan downgrades or cancellations will take effect at the end of your current billing cycle."
    },
    {
      q: "What is the One-Time Setup Fee for?",
      a: "The setup fee covers data migration from your old software, custom branding configuration, server provisioning, and intensive staff training to ensure a smooth transition."
    },
    {
      q: "Who owns my data?",
      a: "You do. Your institution maintains 100% ownership of all student, teacher, and academic records. We provide easy-to-use export tools so you can download your data at any time."
    },
    {
      q: "Is there a refund policy?",
      a: "We offer a 14-day full money-back guarantee for all new subscriptions. If you're not satisfied within the first two weeks, we'll refund your payment, no questions asked."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-10 justify-center">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Pricing FAQ</h2>
      </div>

      {faqs.map((faq, idx) => (
        <div 
          key={idx} 
          className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <span className="font-bold text-slate-900 pr-8">{faq.q}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${openIdx === idx ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
              {openIdx === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>
          <AnimatePresence>
            {openIdx === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 pb-6 text-sm font-medium text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
