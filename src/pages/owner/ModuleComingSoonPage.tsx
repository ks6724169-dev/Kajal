import React from 'react';
import * as LucideIcons from 'lucide-react';
import { MODULE_CATEGORIES, ModuleInfo } from '../../data/modulesRegistry';

interface ModuleComingSoonPageProps {
  modulePath: string;
  onNavigate: (path: string) => void;
}

export const ModuleComingSoonPage: React.FC<ModuleComingSoonPageProps> = ({ modulePath, onNavigate }) => {
  // Find the module in registry
  let foundModule: ModuleInfo | null = null;
  for (const cat of MODULE_CATEGORIES) {
    const mod = cat.modules.find(m => m.path === modulePath);
    if (mod) {
      foundModule = mod;
      break;
    }
  }

  // Fallback if not found or Shared Platform page
  if (modulePath === 'module_shared_platform') {
    foundModule = {
      id: "shared_platform",
      name: "Shared Platform Layer",
      description: "Galaxy ERP Foundation Services (Authentication, Identity, RBAC, Multi-Tenant Isolation, Real-Time Sync, and AI Services).",
      path: "module_shared_platform",
      iconName: "Settings",
      category: "Platform Services"
    };
  }

  const moduleName = foundModule ? foundModule.name : "Galaxy Enterprise Module";
  const moduleDesc = foundModule ? foundModule.description : "Enterprise operational sub-module.";
  const iconName = foundModule ? foundModule.iconName : "HelpCircle";

  // Safely resolve Lucide Icon
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  return (
    <div className="bg-slate-50 min-h-[70vh] flex flex-col items-center justify-center p-6 md:p-12 text-slate-800 animate-fade-in">
      <div className="max-w-2xl w-full bg-white border border-slate-200/80 rounded-2xl p-8 md:p-12 shadow-sm text-center space-y-8">
        
        {/* Under Construction Visual Indicator */}
        <div className="flex flex-col items-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider animate-pulse">
            <span>🚧</span> Coming Soon
          </div>
          
          {/* Module Icon Container */}
          <div className="w-20 h-20 bg-indigo-50/50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm mt-4">
            <IconComponent className="w-10 h-10" />
          </div>
        </div>

        {/* Module Title & Core Statement */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {moduleName} Page
          </h1>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Galaxy ERP Master Architecture Registry
          </p>
        </div>

        {/* Description */}
        <div className="py-4 px-6 bg-slate-50 border border-slate-100 rounded-xl">
          <p className="text-slate-600 text-sm leading-relaxed">
            {moduleDesc}
          </p>
          <div className="mt-3 text-[11px] font-medium text-slate-400">
            This module is part of the Galaxy ERP Master Architecture and is currently under active core development.
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <button
            onClick={() => onNavigate('modules_catalogue')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition duration-200 cursor-pointer"
          >
            <LucideIcons.LayoutGrid className="w-4 h-4" />
            <span>Back to Module Catalogue</span>
          </button>
          
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition duration-200 cursor-pointer"
          >
            <LucideIcons.Layout className="w-4 h-4" />
            <span>Back to Owner Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
};
