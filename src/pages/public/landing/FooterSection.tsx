import React from 'react';

export const FooterSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white">
                <span className="font-black text-lg leading-none">G</span>
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                GALAXY <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">ERP</span>
              </span>
            </div>
            <p className="text-sm font-medium mb-6 max-w-sm">
              The world's most advanced Enterprise Operating System for educational institutions. Designed to power the next generation of learning.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Community</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">About</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Terms</a></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Galaxy ERP Systems. All rights reserved.
          </p>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Systems Normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
