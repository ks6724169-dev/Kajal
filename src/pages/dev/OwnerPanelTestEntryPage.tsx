import React from 'react';
import { Building2, ShieldCheck, X } from 'lucide-react';

interface OwnerPanelTestEntryPageProps {
  onOpen: () => void;
  onBack: () => void;
}

/** TEMPORARY DEVELOPMENT ENTRY POINT. Remove this page and its route before production. */
export const OwnerPanelTestEntryPage: React.FC<OwnerPanelTestEntryPageProps> = ({ onOpen, onBack }) => (
  <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
    <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
      <section className="w-full rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
              <ShieldCheck className="h-3.5 w-3.5" /> Development Only
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Owner Panel Test Entry</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">Temporary direct access for local development and Workspace testing. This entry point must be removed before production deployment.</p>
          </div>
          <button onClick={onBack} aria-label="Back" className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <button onClick={onOpen} className="group flex w-full items-center gap-4 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-5 text-left transition hover:border-indigo-400/40 hover:bg-indigo-500/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"><Building2 className="h-6 w-6" /></div>
          <div className="flex-1"><p className="font-black">Open Owner Panel</p><p className="mt-1 text-xs text-slate-400">Skip login for temporary testing only</p></div>
          <span className="text-indigo-300 transition group-hover:translate-x-1">→</span>
        </button>
      </section>
    </div>
  </main>
);

export default OwnerPanelTestEntryPage;
