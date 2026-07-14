import React from 'react';
import { Video, ShieldCheck, Activity } from 'lucide-react';

export const CctvSecurity: React.FC = () => {
  const cameras = [
    { id: 1, name: 'Main Gate #1 (Face Recognition)', status: 'Live 1080p', fps: 30 },
    { id: 2, name: 'Audience & Assembly Hall', status: 'Live 1080p', fps: 30 },
    { id: 3, name: 'Science & AI Computer Lab', status: 'Live 1080p', fps: 30 },
    { id: 4, name: 'Campus Playground & Sports Arena', status: 'Live 1080p', fps: 30 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">CCTV Security & AI Surveillance Feeds</h1>
        <p className="text-xs text-slate-500">Live multi-camera RTSP streaming simulator with perimeter monitoring and AI motion alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cameras.map(cam => (
          <div key={cam.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center space-x-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>{cam.name}</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                {cam.status} • {cam.fps} FPS
              </span>
            </div>
            <div className="h-56 bg-slate-900 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
              <div className="text-center space-y-2 relative z-10">
                <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center mx-auto text-indigo-400">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-xs font-mono text-slate-400">SECURE_RTSP_FEED://cam_{cam.id}_active</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
