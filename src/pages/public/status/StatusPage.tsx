import React from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, AlertCircle, Clock, Server, Globe, Database, ShieldCheck } from 'lucide-react';
import { Navigation } from '../landing/Navigation';
import { FooterSection } from '../landing/FooterSection';

export const StatusPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const systems = [
    { name: "Global API", status: "Operational", uptime: "99.99%", latency: "24ms" },
    { name: "Core Database", status: "Operational", uptime: "100%", latency: "12ms" },
    { name: "Galaxy AI Engine", status: "Operational", uptime: "99.98%", latency: "145ms" },
    { name: "Document Storage", status: "Operational", uptime: "99.99%", latency: "42ms" },
    { name: "Authentication Service", status: "Operational", uptime: "100%", latency: "18ms" },
    { name: "Mobile Push Gateway", status: "Operational", uptime: "99.95%", latency: "88ms" }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] selection:bg-slate-900 selection:text-white">
      <Navigation onNavigate={navigate} />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-24">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-bold text-slate-900 tracking-tight mb-4"
              >
                System Status
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-500 font-medium tracking-tight"
              >
                Real-time reliability and performance metrics.
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-8 py-5 rounded-[2rem] bg-white border border-slate-200/50 flex items-center gap-5 shadow-sm"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900 tracking-tight text-xl">All Systems Online</span>
            </motion.div>
          </div>

          {/* System Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-32">
            {systems.map((system, idx) => (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-10 rounded-[2.5rem] bg-white border border-slate-200/50 flex items-center justify-between group hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-[#F5F5F7] flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {system.name.includes("API") ? <Activity className="w-8 h-8" /> : system.name.includes("Database") ? <Database className="w-8 h-8" /> : <Server className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">{system.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{system.uptime} Uptime</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{system.latency} Latency</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Incident History */}
          <div className="py-32 border-t border-slate-200">
            <h2 className="text-4xl font-bold text-slate-900 mb-16 tracking-tight">Incident History</h2>
            <div className="space-y-12">
              {[
                { date: "July 22, 2026", title: "Regional Latency Handshake", status: "Resolved", desc: "Identified and resolved an optimization bottleneck affecting administrative dashboards in the APAC region." },
                { date: "June 14, 2026", title: "Database Architecture Sync", status: "Completed", desc: "Core engine migration to version 4.2 was completed successfully with zero service interruption." }
              ].map((incident, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 md:gap-24">
                  <div className="w-32 shrink-0 md:pt-1">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{incident.date}</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <h4 className="font-bold text-slate-900 text-2xl tracking-tight">{incident.title}</h4>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">{incident.status}</span>
                    </div>
                    <p className="text-xl text-slate-500 font-medium leading-tight tracking-tight max-w-3xl">{incident.desc}</p>
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
