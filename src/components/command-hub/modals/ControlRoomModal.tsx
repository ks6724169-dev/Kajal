import React, { useState } from 'react';
import { 
  Cctv, X, ShieldCheck, Building2, Layers, AlertCircle, Video, Lock, Radio, 
  Sliders, RefreshCw, ArrowLeft, Eye, Maximize2, Power, WifiOff, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface ControlRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampus?: string;
}

export const ControlRoomModal: React.FC<ControlRoomModalProps> = ({
  isOpen,
  onClose,
  currentCampus = 'All Campuses'
}) => {
  const { user } = useAuth();
  const [selectedCampus, setSelectedCampus] = useState(currentCampus);
  const [selectedZone, setSelectedZone] = useState<'all' | 'entrance' | 'corridor' | 'playground' | 'exam_hall'>('all');
  const [isVmsConnected, setIsVmsConnected] = useState(false); // Default clean empty state: No fake video feeds!

  if (!isOpen) return null;

  const role = user?.role || 'super_admin';

  // Role Scope Enforcements
  const getRoleScopeDescription = () => {
    switch (role) {
      case 'principal':
        return 'Principal Scope: Authorized Assigned Campus CCTV Feeds';
      case 'vice_principal':
        return 'Vice Principal Scope: Assigned Department & Zone Camera Feeds';
      default:
        return 'Institution Owner: Institution-Wide Multi-Campus VMS Control Access';
    }
  };

  const zones = [
    { id: 'all', label: 'All Camera Zones' },
    { id: 'entrance', label: 'Main Entrances & Gates' },
    { id: 'corridor', label: 'Classroom Corridors' },
    { id: 'playground', label: 'Sports Complex & Playground' },
    { id: 'exam_hall', label: 'Examination Halls' }
  ];

  // Camera feed data for when stream test is enabled
  const simulatedCameras = [
    { id: 'CAM-01', name: 'Main Gate Gate #1', zone: 'entrance', campus: 'Main Campus', fps: '30 FPS', res: '1080p HD', status: 'RTSP Stream Active' },
    { id: 'CAM-02', name: 'Academic Block Corridor A', zone: 'corridor', campus: 'Main Campus', fps: '25 FPS', res: '1080p HD', status: 'RTSP Stream Active' },
    { id: 'CAM-03', name: 'Sports Field North Stand', zone: 'playground', campus: 'Main Campus', fps: '30 FPS', res: '4K UltraHD', status: 'RTSP Stream Active' },
    { id: 'CAM-04', name: 'Exam Hall #3 Central View', zone: 'exam_hall', campus: 'North Branch', fps: '30 FPS', res: '1080p HD', status: 'RTSP Stream Active' }
  ];

  const filteredCameras = simulatedCameras.filter(c => selectedZone === 'all' ? true : c.zone === selectedZone);

  return (
    <div className="fixed inset-0 z-[10000] w-screen h-screen bg-slate-950 text-white flex flex-col overflow-hidden animate-fade-in">
      
      {/* Control Room Header (Apple Style) */}
      <header className="bg-slate-900/95 backdrop-blur-xl text-white px-4 sm:px-6 py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          {/* Small Compact Top-Left ⏮️ Back Button */}
          <button
            onClick={onClose}
            className="px-2.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-slate-700/80 shadow-xs active:scale-95 shrink-0"
            title="Return to Command Center"
          >
            <span className="text-sm leading-none">⏮️</span>
            <span className="hidden xs:inline">Back</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 shrink-0">
              <Cctv className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight">Institutional VMS & Control Room</h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[9px] font-extrabold uppercase tracking-wider hidden sm:inline-block">
                  VMS v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block leading-none mt-0.5">{getRoleScopeDescription()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RBAC Enforced Scope
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer border border-slate-700/80"
            title="Close Full Screen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Filter Toolbar: Campus & Zone Selectors */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
        
        {/* Campus Selection based on RBAC */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400 font-bold">Campus Scope:</span>
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            disabled={role === 'principal' || role === 'vice_principal'}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-amber-500 disabled:opacity-60 cursor-pointer"
          >
            <option value="All Campuses">Institution Owner (All Campuses)</option>
            <option value="Main Campus">Main Campus</option>
            <option value="North Branch">North Branch</option>
            <option value="South Campus">South Campus</option>
          </select>
        </div>

        {/* Camera Zone Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedZone === zone.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewing Canvas Area */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-950 flex flex-col items-center justify-center">
        
        {!isVmsConnected ? (
          /* Clean "No CCTV System Connected" Empty State (No Fake Video Feeds!) */
          <div className="max-w-xl w-full text-center p-8 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-5 my-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <WifiOff className="w-8 h-8 opacity-80" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-extrabold text-xl text-white">No CCTV / VMS System Connected</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                Galaxy ERP connects directly with institutional NVR hardware, CCTV cameras, and VMS servers via RTSP / ONVIF bridges. No hardware VMS feed is currently configured for <span className="text-amber-300 font-bold">{selectedCampus}</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-left text-xs space-y-2 text-slate-300">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Integration Prerequisites:
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside font-medium">
                <li>Enterprise NVR or VMS Server with RTSP/H.264 video stream capability</li>
                <li>Static IP / VPN tunnel authorization configured for the campus</li>
                <li>Institution Owner RBAC approval for channel mapping</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsVmsConnected(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" /> Simulate VMS Channel Stream Test
              </button>
            </div>
          </div>
        ) : (
          /* Active Camera Grid Stream Layout (When Stream Test is Triggered) */
          <div className="w-full max-w-6xl space-y-4 my-auto animate-fade-in">
            <div className="flex items-center justify-between text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Active RTSP Camera Channel Streams ({selectedCampus})
              </span>
              <button
                onClick={() => setIsVmsConnected(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer text-xs"
              >
                Disconnect Stream Test
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCameras.map((cam) => (
                <div key={cam.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400">{cam.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">{cam.status}</span>
                  </div>

                  {/* Simulated Stream Box */}
                  <div className="aspect-video bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                    <Cctv className="w-10 h-10 text-slate-700 mb-2" />
                    <span className="text-xs font-mono text-slate-500">{cam.id} • {cam.res} • {cam.fps}</span>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 rounded text-[10px] font-mono text-emerald-400">● LIVE</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">VMS Protocol: RTSP / ONVIF Profile S</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Galaxy VMS Control Engine v4.2</span>
      </footer>

    </div>
  );
};
