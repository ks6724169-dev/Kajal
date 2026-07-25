import React from 'react';
import { motion } from 'motion/react';
import { Users, MessageSquare, Globe, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const CommunityPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* Header */}
          <div className="max-w-4xl mb-32">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-[1.02] mb-12"
            >
              Built by educators. <br />
              <span className="text-slate-400">For the future.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-slate-500 font-medium leading-tight tracking-tight max-w-2xl"
            >
              Join a global network of forward-thinking institutions sharing insights, best practices, and pushing the boundaries of what's possible.
            </motion.p>
          </div>

          {/* Community Hubs */}
          <div className="grid md:grid-cols-2 gap-8 mb-40">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-16 rounded-[3.5rem] bg-slate-900 text-white flex flex-col justify-between group cursor-pointer overflow-hidden relative shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <MessageSquare className="w-16 h-16 text-indigo-400 mb-12" />
                <h3 className="text-5xl font-bold mb-8 tracking-tight leading-[1.1]">The Educators Forum.</h3>
                <p className="text-slate-400 text-xl font-medium mb-16 leading-relaxed">Discuss strategies, policy updates, and share success stories with peers worldwide.</p>
                <button className="flex items-center gap-4 font-bold text-white group text-lg">
                  Join the conversation <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-16 rounded-[3.5rem] bg-white border border-slate-200/50 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative z-10">
                <Globe className="w-16 h-16 text-indigo-600 mb-12" />
                <h3 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.1]">Global Events.</h3>
                <p className="text-slate-500 text-xl font-medium mb-16 leading-relaxed">From virtual webinars to regional meetups, connect with the Galaxy community in person.</p>
                <button className="flex items-center gap-4 font-bold text-indigo-600 group text-lg">
                  View calendar <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Testimonial Grid */}
          <div className="py-32 border-t border-slate-200">
            <h2 className="text-4xl font-bold text-slate-900 mb-20 tracking-tight">Loved by 2,500+ institutions.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Chen", role: "Principal, Nexus Academy", quote: "The community support is just as impressive as the software itself." },
                { name: "James Wilson", role: "IT Director, Global School", quote: "Galaxy didn't just fix our management issues; it connected us to better ideas." },
                { name: "Anita Rao", role: "Founder, Zenith International", quote: "Finally, a platform that feels like it was built for us, not just for spreadsheets." }
              ].map((item, idx) => (
                <div key={idx} className="p-12 rounded-[2.5rem] bg-white border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="flex gap-1.5 mb-8">
                    {[...Array(5)].map((_, i) => <Heart key={i} className="w-4 h-4 text-indigo-500 fill-indigo-500" />)}
                  </div>
                  <p className="text-xl font-bold text-slate-900 mb-10 leading-[1.3] tracking-tight">"{item.quote}"</p>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[13px] uppercase tracking-widest">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <FooterSection onNavigate={navigate} />
    </div>
  );
};
