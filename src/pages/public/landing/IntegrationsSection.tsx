import React from 'react';
import { motion } from 'motion/react';
import { Database, Mail, MessageSquare, Phone, Server, CreditCard, Link, Zap, Globe, Smartphone, Lock } from 'lucide-react';

const integrations = [
  { name: 'Supabase', icon: Database, color: 'text-emerald-500' },
  { name: 'Google Workspace', icon: Globe, color: 'text-blue-500' },
  { name: 'Microsoft 365', icon: Server, color: 'text-blue-600' },
  { name: 'WhatsApp', icon: Phone, color: 'text-green-500' },
  { name: 'Razorpay', icon: CreditCard, color: 'text-blue-400' },
  { name: 'UPI', icon: Smartphone, color: 'text-slate-700' },
  { name: 'Email', icon: Mail, color: 'text-rose-500' },
  { name: 'SMS', icon: MessageSquare, color: 'text-indigo-500' },
  { name: 'REST API', icon: Link, color: 'text-cyan-500' },
  { name: 'AI Gateway', icon: Zap, color: 'text-purple-500' },
  { name: 'Future Ready', icon: Lock, color: 'text-slate-900' },
];

export const IntegrationsSection: React.FC = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden" id="integrations">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">Premium Integrations</h2>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Connects with tools you already love.
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {integrations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-default"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-bold text-slate-700">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
