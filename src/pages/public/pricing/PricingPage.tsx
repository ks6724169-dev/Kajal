import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, BrainCircuit, X, Sparkles
} from 'lucide-react';
import { PricingSection } from '../landing/pricing/PricingSection';

interface PricingPageProps {
  navigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ navigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-slate-900 leading-none mb-1">
                  Galaxy Pricing
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                  Institutional Plans
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Close
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="pt-20">
        <PricingSection />
      </main>
    </div>
  );
};
