import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '₹2,999',
    period: '/mo',
    desc: 'For small schools starting their digital journey.',
    features: ['Up to 500 Students', 'Basic ERP Modules', 'Email Support', 'Standard Reports'],
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹7,999',
    period: '/mo',
    desc: 'Advanced tools for growing institutions.',
    features: ['Up to 2,000 Students', 'All ERP Modules', 'Galaxy AI Basic', 'Priority Support', 'Mobile App'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Complete control for large universities and multi-campus chains.',
    features: ['Unlimited Students', 'Full Galaxy AI Suite', 'Dedicated Success Manager', 'Custom API Access', 'On-premise option'],
    popular: false,
  }
];

export const PricingSection: React.FC = () => {
  return (
    <div id="pricing" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg font-medium text-slate-500">
            No hidden fees. No surprise charges. Choose the plan that best fits your institution's size and needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-3xl border p-8 flex flex-col ${
                plan.popular 
                  ? 'bg-slate-900 border-slate-800 text-white shadow-2xl shadow-indigo-500/20 scale-105 z-10' 
                  : 'bg-white border-slate-200 text-slate-900 hover:shadow-xl hover:border-slate-300 transition-all z-0'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-black mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                <p className={`text-sm font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                <span className={`text-sm font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={`text-sm font-bold ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-black text-sm transition-all ${
                plan.popular 
                  ? 'bg-white text-slate-900 hover:bg-slate-100' 
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}>
                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
