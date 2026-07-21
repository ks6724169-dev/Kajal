import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, GraduationCap, Library, Users, UserCheck, UsersRound, 
  Activity, ArrowRightLeft, Clock, ShieldCheck, Cpu, Database, 
  Lock, Globe, Cloud, Sparkles, Smartphone, BarChart3, Fingerprint,
  Award, CheckCircle2
} from 'lucide-react';

export const TrustSection: React.FC = () => {
  const counters = [
    { label: 'Schools', value: '2,500+', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Colleges', value: '850+', icon: GraduationCap, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Universities', value: '120+', icon: Library, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Students', value: '3.5M+', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Teachers', value: '150K+', icon: UserCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Parents', value: '5.2M+', icon: UsersRound, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Daily Active', value: '1.8M+', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Transactions/mo', value: '₹400Cr+', icon: ArrowRightLeft, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Uptime', value: '99.99%', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  const trustBadges = [
    { icon: Cpu, label: 'AI Powered' },
    { icon: Database, label: 'Offline First' },
    { icon: Globe, label: 'Multi-Tenant SaaS' },
    { icon: Lock, label: 'End-to-End Encryption' },
    { icon: ShieldCheck, label: 'Enterprise Security' },
    { icon: Clock, label: '99.99% Uptime' },
    { icon: Sparkles, label: 'Fast Support' },
    { icon: Cloud, label: 'Cloud Native' },
  ];

  const bentoFeatures = [
    {
      title: 'One Platform',
      description: 'Replace multiple fragmented tools with a single, unified operating system.',
      icon: Globe,
      className: 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
      iconClass: 'text-white bg-white/20'
    },
    {
      title: 'AI Automation',
      description: 'Auto-generate reports, manage schedules, and predict student performance.',
      icon: Cpu,
      className: 'md:col-span-2 lg:col-span-1 bg-white border border-slate-100',
      iconClass: 'text-cyan-600 bg-cyan-50'
    },
    {
      title: 'Secure Data',
      description: 'Military-grade encryption for all institutional and personal data.',
      icon: ShieldCheck,
      className: 'md:col-span-1 lg:col-span-1 bg-slate-900 text-white',
      iconClass: 'text-emerald-400 bg-emerald-400/20'
    },
    {
      title: 'Fast Admission',
      description: 'Streamline onboarding with OCR and digital document verification.',
      icon: UserCheck,
      className: 'md:col-span-1 lg:col-span-1 bg-white border border-slate-100',
      iconClass: 'text-indigo-600 bg-indigo-50'
    },
    {
      title: 'Smart Attendance',
      description: 'RFID, Biometric, and AI Face Recognition support built-in.',
      icon: Fingerprint,
      className: 'md:col-span-2 lg:col-span-1 bg-white border border-slate-100',
      iconClass: 'text-orange-600 bg-orange-50'
    },
    {
      title: 'Analytics',
      description: 'Real-time dashboards for management and administrators.',
      icon: BarChart3,
      className: 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white',
      iconClass: 'text-white bg-white/20'
    },
    {
      title: 'Mobile Experience',
      description: 'Native offline-first apps for teachers, parents, and students.',
      icon: Smartphone,
      className: 'md:col-span-2 lg:col-span-2 bg-white border border-slate-100',
      iconClass: 'text-purple-600 bg-purple-50'
    }
  ];

  const certifications = [
    'ISO 27001 Ready',
    'GDPR Compliant',
    'SOC2 Type II Ready',
    'Multi-Tenant Architecture',
    'Secure Cloud Infrastructure'
  ];

  return (
    <div className="py-24 bg-slate-50 relative overflow-hidden" id="trust">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-100/50 to-transparent rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-100/40 to-transparent rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
        
        {/* Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
          {counters.map((counter, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-xl ${counter.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <counter.icon className={`w-5 h-5 ${counter.color}`} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {counter.value}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center mt-1">
                {counter.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Badges */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">Enterprise Grade</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">Built for scale and security</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50 transition-all cursor-default"
              >
                <badge.icon className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-700">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scrolling Logo Wall (Placeholder Ed-Orgs) */}
        <div className="relative w-full overflow-hidden flex flex-col gap-8">
          <div className="text-center">
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trusted by 3,000+ Institutions</p>
          </div>
          <div className="flex w-[200%] md:w-[150%] lg:w-[120%] animate-[slide-infinite_40s_linear_infinite] gap-8 items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
            {[...Array(2)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                <div className="flex items-center gap-2 text-xl font-black text-slate-400 mx-8 whitespace-nowrap"><Building2 className="w-6 h-6"/> Global International School</div>
                <div className="flex items-center gap-2 text-xl font-black text-slate-400 mx-8 whitespace-nowrap"><GraduationCap className="w-6 h-6"/> Cambridge Academy</div>
                <div className="flex items-center gap-2 text-xl font-black text-slate-400 mx-8 whitespace-nowrap"><Library className="w-6 h-6"/> Oxford High</div>
                <div className="flex items-center gap-2 text-xl font-black text-slate-400 mx-8 whitespace-nowrap"><Building2 className="w-6 h-6"/> DPS Society</div>
                <div className="flex items-center gap-2 text-xl font-black text-slate-400 mx-8 whitespace-nowrap"><GraduationCap className="w-6 h-6"/> St. Xavier's Trust</div>
                <div className="flex items-center gap-2 text-xl font-black text-slate-400 mx-8 whitespace-nowrap"><Library className="w-6 h-6"/> Harvard Public School</div>
                <div className="flex items-center gap-2 text-xl font-black text-slate-400 mx-8 whitespace-nowrap"><Building2 className="w-6 h-6"/> Allen Institutes</div>
                <div className="flex items-center gap-2 text-xl font-black text-slate-400 mx-8 whitespace-nowrap"><GraduationCap className="w-6 h-6"/> Resonance Academy</div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bento Grid: Why Institutions Trust Galaxy ERP */}
        <div>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">The Galaxy Advantage</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Why leading institutions choose us
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-[220px]">
            {bentoFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-3xl p-8 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden relative ${feature.className}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feature.iconClass}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-black tracking-tight mb-2">{feature.title}</h4>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{feature.description}</p>
                </div>
                {/* Decorative background element for bento boxes */}
                <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
                  <feature.icon className="w-40 h-40" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enterprise Statistics & Awards */}
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">AI Requests Served</p>
                <p className="text-4xl font-black text-slate-900 mb-6">45.2M+</p>
              </div>
              <div className="h-24 flex items-end gap-2 mt-4">
                {[40, 50, 30, 60, 45, 75, 55, 80, 65, 90, 70, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-50 rounded-t-sm" style={{ height: '100%' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="w-full bg-indigo-500 rounded-t-sm"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">System Reliability</p>
                <p className="text-4xl font-black text-white mb-6">100%</p>
              </div>
              <div className="relative z-10 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>Core Systems</span>
                    <span className="text-emerald-400">Operational</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>Database Clusters</span>
                    <span className="text-emerald-400">Operational</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 border border-indigo-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Certifications</h3>
            </div>
            
            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span className="text-sm font-bold text-slate-700">{cert}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-indigo-100">
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Committed to global standards in data protection, privacy, and enterprise infrastructure security.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
