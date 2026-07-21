import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, ArrowRight, Play, Phone, ShieldCheck, 
  Database, GraduationCap, Users, Sparkles, Gem, ArrowUpRight
} from 'lucide-react';
import { PricingToggle } from './PricingToggle';
import { StudentSlider } from './StudentSlider';
import { ROICalculator } from './ROICalculator';
import { ComparisonModal } from './ComparisonModal';
import { PricingFAQ } from './PricingFAQ';

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [students, setStudents] = useState(500);
  const [plans, setPlans] = useState<any[]>([]);
  const [tiers, setTiers] = useState<number[]>([]);
  const [setupFees, setSetupFees] = useState<any[]>([]);
  const [setupIncludes, setSetupIncludes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/pricing/plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data.plans);
        setTiers(data.tiers);
        setSetupFees(data.setupFees);
        setSetupIncludes(data.setupIncludes);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load pricing plans', err);
        setIsLoading(false);
      });
  }, []);

  const calculatePrice = (plan: any) => {
    const basePrice = plan.prices[students] || plan.prices[5000];
    if (billingCycle === 'yearly') {
      return Math.round((basePrice * 10) / 12); // Save 2 months
    }
    return basePrice;
  };

  const getYearlyLabel = (plan: any) => {
    const monthlyPrice = plan.prices[students] || plan.prices[5000];
    return `₹${(monthlyPrice * 10).toLocaleString()}/year`;
  };

  if (isLoading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Plans...</p>
        </div>
      </div>
    );
  }

  return (
    <section id="pricing" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-4"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              Flexible Enterprise Pricing
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto"
          >
            Simple Pricing. Powerful AI. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Unlimited Growth.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium max-w-2xl mx-auto"
          >
            Choose the perfect Galaxy ERP plan for your school, college, or university. Everything grows with your institution.
          </motion.p>
        </div>

        {/* Controls */}
        <div className="mb-20 space-y-16">
          <PricingToggle billingCycle={billingCycle} onChange={setBillingCycle} />
          <StudentSlider value={students} tiers={tiers} onChange={setStudents} />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-white rounded-[2.5rem] p-8 md:p-10 border transition-all duration-500 flex flex-col ${
                plan.isPopular 
                ? 'border-indigo-200 shadow-[0_32px_64px_-16px_rgba(79,70,229,0.15)] scale-105 z-10' 
                : 'border-slate-100 shadow-xl hover:shadow-2xl hover:border-slate-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    plan.id === 'silver' ? 'bg-slate-100 text-slate-600' :
                    plan.id === 'gold' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    {plan.id === 'silver' && <GraduationCap className="w-7 h-7" />}
                    {plan.id === 'gold' && <Sparkles className="w-7 h-7" />}
                    {plan.id === 'platinum' && <Gem className="w-7 h-7" />}
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {plan.suitableFor}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    ₹{calculatePrice(plan).toLocaleString()}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">/month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-emerald-600 text-xs font-bold mt-2">
                    Billed annually: {getYearlyLabel(plan)}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                  Included Features
                </p>
                {plan.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      feature.includes('Everything in') ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={`text-sm font-medium ${
                      feature.includes('Everything in') ? 'text-slate-900 font-black' : 'text-slate-600'
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                plan.isPopular 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20' 
                : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-100'
              }`}>
                {plan.id === 'platinum' ? 'Contact Sales' : 'Start Free Trial'}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Button */}
        <div className="flex justify-center mb-32">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-900 hover:border-indigo-100 hover:text-indigo-600 transition-all shadow-xl shadow-slate-200/20"
          >
            Compare All Features
            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center">
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        </div>

        {/* Setup Fee Section */}
        <div className="mb-32">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -mr-300 -mt-300 pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight">One-Time Setup & Onboarding</h3>
                  <p className="text-slate-400 font-medium text-lg max-w-md">
                    A professional jumpstart for your institution with zero downtime and expert guidance.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {setupFees.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                      <span className="font-bold text-slate-300">{item.range}</span>
                      <span className="font-black text-xl text-white">{item.fee}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {setupIncludes.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-slate-200">{item}</span>
                  </div>
                ))}
                <div className="col-span-full mt-4 flex items-center gap-3 p-5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Enterprise Dedicated Server Provisioning Included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Calculate Your Savings</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">See how much time and money Galaxy ERP can save your institution every year.</p>
          </div>
          <ROICalculator />
        </div>

        {/* FAQ */}
        <div className="mb-32">
          <PricingFAQ />
        </div>

        {/* Final CTA */}
        <div className="relative rounded-[3rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative z-10 px-8 py-20 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-xl text-indigo-100 font-medium mb-12 max-w-2xl mx-auto opacity-90">
              Join 500+ schools and colleges using Galaxy ERP to power their educational operations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-2xl">
                Start 14-Day Free Trial
              </button>
              <button className="px-10 py-5 bg-slate-900/40 text-white border border-white/20 backdrop-blur-md rounded-2xl font-black text-sm hover:bg-slate-900/60 transition-all flex items-center gap-2">
                <Play className="w-4 h-4" />
                Book Live Demo
              </button>
              <button className="px-10 py-5 bg-transparent text-white border border-white/10 rounded-2xl font-black text-sm hover:bg-white/5 transition-all flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      <ComparisonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
