import React from 'react';

export const FooterSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-white text-slate-400 py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                <span className="font-bold text-lg leading-none">G</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Galaxy <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded-full">Pro</span>
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6 max-w-xs leading-relaxed">
              The world's most advanced Enterprise Operating System for educational institutions. Designed for precision.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-[10px]">Product</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('/features')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Features</button></li>
              <li><button onClick={() => onNavigate('/intelligence')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Intelligence</button></li>
              <li><button onClick={() => onNavigate('/pricing')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Pricing</button></li>
              <li><button onClick={() => onNavigate('/security')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Security</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-[10px]">Resources</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('/docs')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Documentation</button></li>
              <li><button onClick={() => onNavigate('/help')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Help Center</button></li>
              <li><button onClick={() => onNavigate('/community')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Community</button></li>
              <li><button onClick={() => onNavigate('/status')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Status</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-[10px]">Company</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('/about')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">About</button></li>
              <li><button onClick={() => onNavigate('/privacy')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('/terms')} className="text-sm font-medium hover:text-slate-900 transition-colors text-left">Terms of Service</button></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Galaxy ERP. Engineered with clarity.
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

