import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, BrainCircuit, Phone, Play, HelpCircle, 
  ArrowRight, MessageSquare, Mail, PhoneCall, Calendar,
  Star, Headphones, X
} from 'lucide-react';
import { ContactForm } from './components/ContactForm';
import { DemoBooking } from './components/DemoBooking';
import { ContactOffices, SupportTicket } from './components/ContactOffices';
import { ContactStats, ContactTestimonials } from './components/ContactStats';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [offices, setOffices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [supportOptions, setSupportOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      fetch('/api/v1/contact/statistics').then(res => res.json()),
      fetch('/api/v1/contact/offices').then(res => res.json()),
      fetch('/api/v1/contact/testimonials').then(res => res.json()),
      fetch('/api/v1/contact/support-options').then(res => res.json())
    ]).then(([s, o, t, sup]) => {
      setStats(s);
      setOffices(o);
      setTestimonials(t);
      setSupportOptions(sup);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl animate-pulse">
            <PhoneCall className="w-8 h-8" />
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-bounce">
            Connecting to Sales...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-slate-900 leading-none mb-1">
                  GALAXY ERP
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                  Contact & Sales Center
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button className="px-6 py-3 bg-slate-50 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" /> Call Sales
            </button>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
              Book Demo
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Galaxy ERP.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Whether you're looking for a personalized demo, technical support, or partnership opportunities, our enterprise team is here to assist you.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            {supportOptions.map((opt) => (
              <button 
                key={opt.id}
                className="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left min-w-[240px] group"
              >
                <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1 group-hover:translate-x-1 transition-transform">{opt.label}</div>
                <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  {opt.desc}
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Form & Support Section */}
        <section className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform" />
              <Headphones className="w-12 h-12 text-indigo-200" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Need Immediate Help?</h3>
                <p className="text-indigo-100 font-medium">Our customer success managers are available 24/7 for our institutional partners.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-2 px-4 py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                  <MessageSquare className="w-4 h-4" /> Live Chat
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" /> Email Us
                </button>
              </div>
            </div>

            <SupportTicket />

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">Premium Onboarding</h4>
                    <p className="text-xs font-bold text-slate-500">Fast-track your implementation</p>
                  </div>
               </div>
               <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6">
                  Experience a white-glove migration and setup process tailored for large educational networks and universities.
               </p>
               <button className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Learn about Migration <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </section>

        {/* Live Demo Experience */}
        <DemoBooking />

        {/* Statistics */}
        <ContactStats stats={stats} />

        {/* Office Locations */}
        <ContactOffices offices={offices} />

        {/* Testimonials */}
        <ContactTestimonials testimonials={testimonials} />

        {/* Final CTA */}
        <section className="relative rounded-[4rem] bg-slate-900 p-12 md:p-24 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#4f46e5,transparent)]" />
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
              Ready to Transform Your Educational Institution?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button className="px-10 py-6 bg-white text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                Start Free Trial
              </button>
              <button className="px-10 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                Talk to Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* WhatsApp Floating Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl z-50"
      >
        <MessageSquare className="w-8 h-8 fill-current" />
      </motion.button>
    </div>
  );
};
