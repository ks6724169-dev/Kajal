import React from 'react';
import { MessageSquare, Mail, Phone, Calendar, Ticket, Users, Play, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const DocsSupport: React.FC = () => {
  const supportCards = [
    { icon: MessageSquare, label: 'Live Chat', desc: 'Typical response time: 2 mins', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Mail, label: 'Email Support', desc: 'support@galaxy-erp.com', color: 'bg-indigo-50 text-indigo-600' },
    { icon: Phone, label: 'WhatsApp', desc: 'Chat with our support bot', color: 'bg-green-50 text-green-600' },
    { icon: Calendar, label: 'Book Meeting', desc: 'Schedule a discovery call', color: 'bg-purple-50 text-purple-600' },
    { icon: Ticket, label: 'Raise Ticket', desc: 'For technical bug reports', color: 'bg-amber-50 text-amber-600' },
    { icon: Users, label: 'Community', desc: 'Join our user forum', color: 'bg-rose-50 text-rose-600' }
  ];

  return (
    <div className="space-y-32">
      <div className="space-y-12">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Contact Support</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportCards.map((card, idx) => (
            <div key={idx} className="p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl transition-all group flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${card.color}`}>
                <card.icon className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-1">{card.label}</h3>
              <p className="text-sm font-medium text-slate-500 mb-8">{card.desc}</p>
              <button className="px-6 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all w-full">
                Connect Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="relative rounded-[3rem] overflow-hidden group p-8 md:p-20 text-center">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px] -mr-300 -mt-300" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500 rounded-full blur-[120px] -ml-300 -mb-300" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Need More Help?
          </h2>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Our enterprise support team is available 24/7 to assist with your institutional needs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-2xl flex items-center gap-2">
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-10 py-5 bg-white/10 text-white border border-white/10 backdrop-blur-md rounded-2xl font-black text-sm hover:bg-white/20 transition-all flex items-center gap-2">
              <Play className="w-4 h-4" />
              Book Live Demo
            </button>
            <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
