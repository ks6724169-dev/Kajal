import React from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const PrivacyPolicyPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
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
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8">Privacy Policy</h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-tight tracking-tight max-w-3xl">
              Last Updated: July 24, 2026. <br />
              Privacy is fundamental to our design philosophy. We build Galaxy to protect your institution's data at every layer.
            </p>
          </motion.div>

          <div className="space-y-24">
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200/50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-indigo-600" />
                </div>
                1. Data Collection
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium tracking-tight">
                We collect only the minimum necessary data to provide institutional management services. This includes staff profiles, student registration details, and financial records as provided by your institution. We never sell or share this data with third-party advertisers.
              </p>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200/50 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>
                2. Data Sovereignty
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium tracking-tight">
                Your institution retains absolute ownership of all data entered into Galaxy. You can export your data at any time in industry-standard formats. Upon termination of service, we provide a 30-day window for data export before permanent, secure deletion.
              </p>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200/50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                3. Security Measures
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium tracking-tight">
                We utilize enterprise-grade AES-256 encryption for data at rest and TLS 1.3 for data in transit. Our infrastructure is hosted in SOC2-compliant data centers with multi-region redundancy and real-time backup systems.
              </p>
            </section>

            <section className="bg-white p-12 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">Compliance Standards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['GDPR Compliant', 'HIPAA Ready', 'SOC2 Certified', 'ISO 27001', 'FERPA Aligned'].map((std) => (
                  <div key={std} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{std}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <FooterSection onNavigate={navigate} />
    </div>
  );
};
