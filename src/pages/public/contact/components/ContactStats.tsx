import React from 'react';
import { motion } from 'motion/react';
import { Users, Building, GraduationCap, Globe, CheckCircle, Star } from 'lucide-react';

export const ContactStats: React.FC<{ stats: any }> = ({ stats }) => {
  const statItems = [
    { icon: Building, label: 'Schools', value: stats.schools + '+', sub: 'Global Institutions', color: 'bg-indigo-50 text-indigo-600' },
    { icon: GraduationCap, label: 'Students', value: '2.5L+', sub: 'Managed Daily', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Users, label: 'Teachers', value: '15K+', sub: 'Active Educators', color: 'bg-purple-50 text-purple-600' },
    { icon: Globe, label: 'Presence', value: stats.countries, sub: 'Countries Worldwide', color: 'bg-blue-50 text-blue-600' },
    { icon: CheckCircle, label: 'Uptime', value: '99.9%', sub: 'Platform Stability', color: 'bg-amber-50 text-amber-600' },
    { icon: Star, label: 'Rating', value: stats.rating + '/5', sub: 'Customer Support', color: 'bg-rose-50 text-rose-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, idx) => (
        <motion.div 
          key={idx}
          whileHover={{ y: -5 }}
          className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center space-y-3"
        >
          <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center ${item.color}`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</div>
          </div>
          <div className="text-[9px] font-bold text-slate-500">{item.sub}</div>
        </motion.div>
      ))}
    </div>
  );
};

export const ContactTestimonials: React.FC<{ testimonials: any[] }> = ({ testimonials }) => {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Voices of Success</h2>
        <p className="text-slate-500 font-medium">Join 500+ institutions that trust Galaxy ERP.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((t) => (
          <div key={t.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6 relative group hover:bg-white hover:shadow-2xl transition-all">
            <div className="flex gap-1">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-lg font-bold text-slate-700 italic leading-relaxed">
              "{t.content}"
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div>
                <div className="font-black text-slate-900">{t.name}</div>
                <div className="text-xs font-bold text-slate-500">{t.role}, {t.institution}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
