import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Lock, Eye, ShieldCheck, 
  Server, HardDrive, Key, Fingerprint,
  FileLock2, RefreshCw, Activity, Heart
} from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const SecurityPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-24 h-24 rounded-[2rem] bg-white shadow-sm flex items-center justify-center mb-10 border border-slate-200/50"
            >
              <ShieldCheck className="w-12 h-12 text-emerald-500" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-[1.02] mb-12 max-w-4xl"
            >
              Your data is yours. <br />
              <span className="text-slate-400">By design.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl text-slate-500 max-w-3xl font-medium leading-tight tracking-tight"
            >
              We believe in absolute data sovereignty. Our security infrastructure is built on zero-trust principles to ensure your institution stays private.
            </motion.p>
          </div>

          {/* Core Principles */}
          <div className="grid md:grid-cols-3 gap-8 mb-40">
            {[
              { 
                title: "Encryption", 
                desc: "Every byte of data is encrypted using AES-256 standard before it hits our storage layers.",
                icon: FileLock2,
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              { 
                title: "Transit", 
                desc: "TLS 1.3 encryption for all data movement between your devices and our core servers.",
                icon: RefreshCw,
                color: "text-indigo-500",
                bg: "bg-indigo-50"
              },
              { 
                title: "Identity", 
                desc: "Biometric and hardware-based MFA ensures only verified personnel gain access.",
                icon: Fingerprint,
                color: "text-emerald-500",
                bg: "bg-emerald-50"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-12 rounded-[3.5rem] bg-white border border-slate-200/50 shadow-sm flex flex-col items-start hover:shadow-xl transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] ${item.bg} flex items-center justify-center mb-8`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-xl text-slate-500 font-medium leading-relaxed tracking-tight">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Technical Specs */}
          <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden mb-40 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-5xl font-bold text-white mb-12 tracking-tight leading-tight">Enterprise <br />Infrastructure.</h2>
                <div className="space-y-12">
                  {[
                    { label: "Uptime SLA", value: "99.99%", desc: "Guaranteed availability for critical school operations." },
                    { label: "Compliance", value: "GDPR/SOC2", desc: "Adhering to the world's strictest data privacy standards." },
                    { label: "Backups", value: "Real-time", desc: "Point-in-time recovery for absolute peace of mind." }
                  ].map((stat, i) => (
                    <div key={i} className="flex gap-8 items-start">
                      <div className="w-1.5 h-16 bg-indigo-500/30 rounded-full" />
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                          <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <p className="text-slate-400 text-lg font-medium tracking-tight leading-snug">{stat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="aspect-square rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl p-12 flex flex-col justify-center">
                <div className="flex items-center gap-6 mb-12">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  <span className="text-[13px] font-bold text-white uppercase tracking-[0.2em]">Global Network Health</span>
                </div>
                <div className="space-y-8">
                  {[
                    { label: "Vulnerability Scans", status: "Clean", color: "text-emerald-400" },
                    { label: "Encryption Health", status: "Optimal", color: "text-emerald-400" },
                    { label: "Intrusion Detection", status: "Active", color: "text-indigo-400" },
                    { label: "System Latency", status: "0.02ms", color: "text-slate-400" }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/5">
                      <span className="text-lg font-medium text-slate-300 tracking-tight">{row.label}</span>
                      <span className={`text-lg font-bold ${row.color}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection onNavigate={navigate} />
    </div>
  );
};
