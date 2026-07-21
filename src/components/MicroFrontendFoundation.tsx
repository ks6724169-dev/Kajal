import React, { useState, useEffect } from 'react';
import { Layers, ShieldAlert, Cpu, CheckCircle, RefreshCw, PlusCircle, AlertCircle } from 'lucide-react';
import { Card, Button, SkeletonLoader } from '../design-system/CoreComponents';

// Shared Component Registry type
export const SharedComponentRegistry: Record<string, React.ComponentType<any>> = {
  Card: Card,
  Button: Button,
  Skeleton: SkeletonLoader
};

export interface MicroModule {
  id: string;
  name: string;
  scope: string;
  url: string;
  version: string;
  requiredEngineVersion: string;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED' | 'OFFLINE';
}

export const MicroFrontendFoundation: React.FC = () => {
  const [modules, setModules] = useState<MicroModule[]>([
    {
      id: 'm-1',
      name: 'Financial Ledger Engine',
      scope: 'finance',
      url: '/modules/finance/remoteEntry.js',
      version: '2.4.0',
      requiredEngineVersion: '>=18.0.0',
      status: 'ONLINE'
    },
    {
      id: 'm-2',
      name: 'HRMS Automated Payroll',
      scope: 'hrms',
      url: '/modules/hrms/remoteEntry.js',
      version: '1.9.2',
      requiredEngineVersion: '>=18.0.0',
      status: 'STANDBY'
    },
    {
      id: 'm-3',
      name: 'Global Transport Grid Tracker',
      scope: 'transport',
      url: '/modules/transport/remoteEntry.js',
      version: '3.1.0',
      requiredEngineVersion: '>=19.0.0',
      status: 'DEGRADED'
    }
  ]);

  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const reloadModule = (id: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const checkVersionCompatibility = (req: string, current: string): boolean => {
    // Basic semver check simulation
    return current.startsWith('18') || req.includes('18');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Independent Micro-Frontends Hub</h3>
          <p className="text-xs text-slate-500">Asynchronously loaded remote federated modules mapped into GALAXY Experience Platform.</p>
        </div>
        <Button size="sm" className="flex items-center space-x-1.5">
          <PlusCircle className="h-4 w-4" />
          <span>Register Remote</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const isComp = checkVersionCompatibility(mod.requiredEngineVersion, '18.15.0');
          const isModuleLoading = loading[mod.id];

          return (
            <Card key={mod.id} className="relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                  <Layers className="h-5 w-5" />
                </div>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  mod.status === 'ONLINE' ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                  mod.status === 'STANDBY' ? 'bg-slate-50 text-slate-600 dark:bg-slate-950/40 dark:text-slate-400' :
                  'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                }`}>
                  {mod.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">{mod.name}</h4>
              <div className="mt-3 space-y-1.5 text-[10px] font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>Scope:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{mod.scope.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{mod.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Manifest URL:</span>
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{mod.url}</span>
                </div>
              </div>

              {/* Compatibility Check */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {isComp ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-[10px] text-slate-500">
                    Engine {isComp ? 'Compatible' : 'Incompatible'}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => reloadModule(mod.id)}
                  loading={isModuleLoading}
                  className="p-1 h-7 w-7 rounded-lg"
                >
                  {!isModuleLoading && <RefreshCw className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
