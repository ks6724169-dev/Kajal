import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Home, Sparkles, BrainCircuit, IndianRupee, 
  Play, BookOpen, HelpCircle, Phone, Key, Building2,
  ChevronRight, Users, UserSquare, ShieldCheck, 
  Home as HomeIcon, CalendarCheck, FileText, Briefcase, 
  Calculator, Library, Bus, Building, Package, 
  MessageSquare, Activity, ShieldAlert, Crown,
  Sun, Moon, Globe
} from 'lucide-react';
import { useTheme } from '../../../core/theme/ThemeContext';
import { useTranslation } from '../../../core/i18n/I18nContext';
import { RolePreviewButtons } from '../../../components/common/RolePreviewButtons';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const mainLinks = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Sparkles, label: 'Features', path: '/features' },
  { icon: BrainCircuit, label: 'Intelligence', path: '/intelligence' },
  { icon: IndianRupee, label: 'Pricing', path: '/pricing' },
  { icon: Play, label: 'Live Demo', path: '/demo' },
  { icon: BookOpen, label: 'Documentation', path: '/docs' },
  { icon: Phone, label: 'Contact', path: '/contact' },
];

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage } = useTranslation();

  const handleLinkClick = (link: any) => {
    if (link.path?.startsWith('/')) {
      onNavigate(link.path);
    } else if (link.path) {
      document.querySelector(link.path)?.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-900 z-[70] shadow-2xl flex flex-col transition-colors"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                MENU
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
                  className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  {resolvedTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-1">
                {mainLinks.map((link, i) => (
                  <button
                    key={i}
                    onClick={() => handleLinkClick(link)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {link.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
              <RolePreviewButtons variant="drawer" onNavigate={(path) => { onNavigate(path); onClose(); }} />

              <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${
                    language === 'en' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('hi')}
                  className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${
                    language === 'hi' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
              <button 
                onClick={() => { onNavigate('/login'); onClose(); }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Key className="w-5 h-5 text-slate-400" />
                Login to Workspace
              </button>
              <button 
                onClick={() => { onNavigate('/register'); onClose(); }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-2xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
              >
                <Building2 className="w-5 h-5" />
                Register School
              </button>
            </div>
          </motion.div>

          {/* Mega Menu Overlay */}
          <FeaturesMegaMenu 
            isOpen={showMegaMenu} 
            onClose={() => setShowMegaMenu(false)} 
            onCloseAll={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};

const featureCategories = [
  {
    name: 'Academic & People',
    items: [
      { title: 'Academic Management', desc: 'Curriculum, timetables, and lesson plans', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
      { title: 'Student Portal', desc: 'Assignments, progress, and history', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
      { title: 'Teacher Dashboard', desc: 'Attendance grading and schedules', icon: UserSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
      { title: 'Parent App', desc: 'Real-time updates and fee payments', icon: HomeIcon, color: 'text-pink-500', bg: 'bg-pink-50' },
    ]
  },
  {
    name: 'Administration & Finance',
    items: [
      { title: 'Principal Workspace', desc: 'Complete institutional oversight', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
      { title: 'Administration', desc: 'Admissions and compliance', icon: Building2, color: 'text-orange-500', bg: 'bg-orange-50' },
      { title: 'Finance & Fees', desc: 'Automated billing and accounting', icon: IndianRupee, color: 'text-green-500', bg: 'bg-green-50' },
      { title: 'HR & Payroll', desc: 'Staff attendance and salaries', icon: Briefcase, color: 'text-teal-500', bg: 'bg-teal-50' },
    ]
  },
  {
    name: 'Operations & Facilities',
    items: [
      { title: 'Transport', desc: 'Live GPS tracking and routes', icon: Bus, color: 'text-yellow-500', bg: 'bg-yellow-50' },
      { title: 'Library', desc: 'Digital catalog and checkout', icon: Library, color: 'text-sky-500', bg: 'bg-sky-50' },
      { title: 'Hostel', desc: 'Room allocation and mess', icon: Building, color: 'text-rose-500', bg: 'bg-rose-50' },
      { title: 'Inventory', desc: 'Stock tracking and purchase orders', icon: Package, color: 'text-lime-500', bg: 'bg-lime-50' },
    ]
  },
  {
    name: 'Intelligence & Core',
    items: [
      { title: 'Galaxy AI', desc: 'Generative AI for daily tasks', icon: BrainCircuit, color: 'text-indigo-600', bg: 'bg-indigo-100' },
      { title: 'Communication', desc: 'SMS, Email, and Push Notifications', icon: MessageSquare, color: 'text-cyan-500', bg: 'bg-cyan-50' },
      { title: 'Reports & Analytics', desc: 'Data-driven insights', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { title: 'Security', desc: 'Role-based access and data protection', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
    ]
  }
];

const FeaturesMegaMenu: React.FC<{ isOpen: boolean; onClose: () => void; onCloseAll: () => void }> = ({ isOpen, onClose, onCloseAll }) => {
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-white z-[80] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-10 px-6 py-4 flex items-center justify-between">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              Back
            </button>
            <span className="font-black text-xl tracking-tight text-slate-900">
              GALAXY FEATURES
            </span>
            <button 
              onClick={onCloseAll}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                Enterprise Modules
              </h2>
              <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                Discover the comprehensive suite of tools designed to transform your educational institution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12">
              {featureCategories.map((category, idx) => (
                <div key={idx} className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                    {category.name}
                  </h3>
                  <div className="space-y-4">
                    {category.items.map((item, i) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedFeature(item)}
                        className="group cursor-pointer p-4 -mx-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                      >
                        <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                              {item.title}
                            </h4>
                            <p className="text-sm font-medium text-slate-500 line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedFeature && (
              <FeatureModal 
                feature={selectedFeature} 
                onClose={() => setSelectedFeature(null)} 
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FeatureModal: React.FC<{ feature: any; onClose: () => void }> = ({ feature, onClose }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[90]"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-white rounded-3xl z-[100] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bg} ${feature.color} shadow-sm`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{feature.title}</h2>
              <p className="text-sm font-bold text-slate-500">{feature.desc}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-4">Key Benefits</h3>
              <ul className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Experience seamless workflow automation with enterprise-grade security and AI-powered insights tailored for {feature.title}.
                    </p>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-black text-slate-900 mt-10 mb-4">Included Features</h3>
              <div className="flex flex-wrap gap-2">
                {['Analytics', 'Export', 'Real-time Sync', 'Mobile Ready'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              {/* Mockup Image Area */}
              <div className="w-full aspect-video bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative flex flex-col border-[4px] border-slate-800">
                <div className="h-6 bg-slate-950 flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
                <div className="flex-1 bg-slate-50 p-4 flex flex-col gap-3">
                  <div className="h-8 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center px-3 gap-2">
                    <div className="w-4 h-4 rounded-md bg-slate-200"></div>
                    <div className="w-32 h-2 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex gap-4">
                    <div className="w-32 h-full bg-slate-50 rounded-md"></div>
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="w-full h-24 bg-indigo-50 rounded-md border border-indigo-100"></div>
                      <div className="flex-1 bg-slate-50 rounded-md"></div>
                    </div>
                  </div>
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none"></div>
              </div>
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                Interactive Preview
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
