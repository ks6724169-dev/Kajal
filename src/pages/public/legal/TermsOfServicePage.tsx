import React from 'react';
import { motion } from 'motion/react';
import { FileText, Scale, Zap, Globe, ShieldCheck } from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const TermsOfServicePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-40 pb-32">
        <div className="max-w-4xl mx-auto px-8 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8">Terms of Service</h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-tight tracking-tight max-w-3xl">
              Effective Date: July 24, 2026. <br />
              Please read these terms carefully. By accessing our platform, you agree to the conditions outlined below.
            </p>
          </motion.div>

          <div className="space-y-24">
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200/50 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-indigo-600" />
                </div>
                1. Service Agreement
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium tracking-tight">
                Galaxy provides cloud-based institutional management software. We grant you a non-exclusive, non-transferable license to use our platform for your institution's internal administrative and educational purposes.
              </p>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200/50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                2. User Obligations
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium tracking-tight">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to use the platform for any unlawful activities or in a way that compromises the security of the systems.
              </p>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200/50 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                3. Payment & Billing
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium tracking-tight">
                Fees are billed in advance on a monthly or annual basis as selected during registration. All fees are non-refundable except as required by law. Failure to pay fees may result in temporary suspension of service.
              </p>
            </section>

            <section className="bg-slate-900 p-16 rounded-[3.5rem] text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Questions about these terms?</h3>
                <p className="text-slate-400 text-lg font-medium mb-12 max-w-xl">Our legal team is available to discuss specific compliance requirements or enterprise service level agreements.</p>
                <button 
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg shadow-black/20"
                >
                  Contact Legal
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <FooterSection onNavigate={navigate} />
    </div>
  );
};
