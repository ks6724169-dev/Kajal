import React from 'react';
import { motion } from 'motion/react';
import { Building2, GraduationCap, Library, BookOpen } from 'lucide-react';

export const LogoWallSection: React.FC = () => {
  const logos = [
    { name: 'CBSE School', icon: Building2 },
    { name: 'ICSE School', icon: GraduationCap },
    { name: 'State Board School', icon: BookOpen },
    { name: 'University', icon: Library },
    { name: 'College', icon: Building2 },
    { name: 'Coaching Institute', icon: GraduationCap },
    { name: 'International School', icon: BookOpen },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 text-center">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Trusted by Modern Schools & Colleges
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <div key={idx} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-default">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <logo.icon className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-800">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
};
