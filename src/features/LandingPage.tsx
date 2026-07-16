import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Smile, 
  Cloud, 
  Headphones, 
  Users, 
  CalendarCheck, 
  IndianRupee, 
  FileEdit, 
  Calendar, 
  BookOpen, 
  Bus, 
  Home, 
  FileText, 
  PieChart,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onOpenTeacherPanel?: () => void;
  onOpenRegistration: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onOpenTeacherPanel, onOpenRegistration }) => {
  const features = [
    { icon: Users, title: 'Student Management', desc: 'Manage student records, admissions, promotions & academic history.', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: CalendarCheck, title: 'Attendance Management', desc: 'Track student & staff attendance in real-time with Face ID.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: IndianRupee, title: 'Fee Management', desc: 'Collect fees via UPI, manage dues & generate instant receipts.', color: 'text-violet-500', bg: 'bg-violet-50' },
    { icon: FileEdit, title: 'Exam Management', desc: 'Create exams, schedule, evaluate OMR & publish AI results.', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Calendar, title: 'Timetable Management', desc: 'Create and manage AI conflict-free class timetables & allocation.', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { icon: BookOpen, title: 'Library Management', desc: 'Manage books, issued/returned, fines & library members.', color: 'text-pink-500', bg: 'bg-pink-50' },
    { icon: Bus, title: 'Transport Management', desc: 'Manage routes, live GPS tracking, drivers & student transport.', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: Home, title: 'Hostel Management', desc: 'Manage rooms, allocations, mess, & monthly payments.', color: 'text-teal-500', bg: 'bg-teal-50' },
    { icon: FileText, title: 'Accounts & Payroll', desc: 'Manage accounts, expenses, staff salary, tax & payslips.', color: 'text-rose-500', bg: 'bg-rose-50' },
    { icon: PieChart, title: 'Reports & Analytics', desc: 'Get detailed BI reports & AI analytics for data-driven decisions.', color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-2xl tracking-tight text-indigo-950">Galaxy</span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest leading-none">School + College ERP</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                const el = document.getElementById('features');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Features
            </button>
            <button 
              onClick={() => {
                alert("Galaxy ERP Help & Support:\n\n• Email: support@galaxyerp.edu\n• Helpline: +91 1800-420-9999\n• WhatsApp Support: +91 98765 43210\n\nOur technical team is available 24/7 to assist with onboarding, fee gateway integration, and biometric setup.");
              }}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Help
            </button>
            {onOpenTeacherPanel && (
              <button 
                onClick={onOpenTeacherPanel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 animate-pulse"
              >
                <span>🚀 Direct Test: Teacher Panel</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
          <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-50 to-purple-100 blur-3xl opacity-70"></div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold text-indigo-950 leading-tight mb-6">
              Complete ERP Solution <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">for Schools & Colleges</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Galaxy ERP automates academic and administrative processes, improves communication, and empowers institutions to deliver excellence with AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-bold text-base transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
              >
                <span>Try Demo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-indigo-950 border border-slate-200 px-6 py-3.5 rounded-xl font-bold text-base transition flex items-center justify-center shadow-sm"
              >
                Login
              </button>
              <button 
                onClick={onOpenRegistration}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-indigo-950 border border-slate-200 px-6 py-3.5 rounded-xl font-bold text-base transition flex items-center justify-center shadow-sm"
              >
                Registration
              </button>
              {onOpenTeacherPanel && (
                <button 
                  onClick={onOpenTeacherPanel}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold text-base transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
                >
                  <span>🚀 Open Teacher Panel (Testing)</span>
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-6 md:gap-12 text-slate-600 text-sm font-medium">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smile className="w-5 h-5 text-indigo-500" />
                <span>Easy to Use</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-indigo-500" />
                <span>Cloud Based</span>
              </div>
              <div className="flex items-center space-x-2">
                <Headphones className="w-5 h-5 text-indigo-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Abstract representation of the dashboard */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-2 hover:rotate-0 transition duration-500">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-100"></div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl space-y-2">
                  <div className="h-3 w-20 bg-indigo-200 rounded"></div>
                  <div className="h-6 w-16 bg-indigo-600 rounded"></div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl space-y-2">
                  <div className="h-3 w-20 bg-emerald-200 rounded"></div>
                  <div className="h-6 w-16 bg-emerald-600 rounded"></div>
                </div>
                <div className="col-span-2 bg-slate-50 p-4 rounded-xl h-32 border border-slate-100 flex items-end space-x-2">
                  {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                    <div key={i} className="w-full bg-indigo-200 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating Mobile App representation */}
            <div className="absolute -bottom-8 -right-8 w-48 bg-white rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden transform -rotate-6 hover:rotate-0 transition duration-500 hidden md:block">
              <div className="bg-indigo-600 text-white p-4 h-24">
                <div className="text-xs font-semibold mb-1">Galaxy Mobile</div>
                <div className="text-[10px] text-indigo-200">Hello, Admin</div>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2 bg-slate-50">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm">
                    <div className="w-6 h-6 rounded bg-slate-100"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-950 mb-4">Powerful Features to Simplify Your Management</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to run your educational institution efficiently, from admissions to alumni management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition bg-white group cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-indigo-300">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold">Trusted by 1000+ Schools & Colleges</span>
          </div>
          <div className="text-sm text-slate-400">
            Secure • Reliable • Scalable
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>© 2026 Galaxy ERP Solutions. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
