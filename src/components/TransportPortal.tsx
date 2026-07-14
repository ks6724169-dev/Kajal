import React, { useState } from 'react';
import { INITIAL_BUSES } from '../data/mockData';
import { BusRoute } from '../types';
import { 
  Navigation, 
  MapPin, 
  Bus, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

export const TransportPortal: React.FC = () => {
  const [buses, setBuses] = useState<BusRoute[]>(INITIAL_BUSES);
  const [selectedBus, setSelectedBus] = useState<BusRoute>(INITIAL_BUSES[0]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live GPS School Bus & Fleet Tracking</h1>
        <p className="text-xs text-slate-500">Real-time GPS telemetry, driver contact, speed monitoring, and ETA alerts for parents and transit managers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Buses List */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Fleet Routes</h2>
          {buses.map(bus => (
            <div
              key={bus.busId}
              onClick={() => setSelectedBus(bus)}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                selectedBus.busId === bus.busId 
                  ? 'bg-indigo-50 border-indigo-500 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{bus.busNo}</h3>
                    <p className="text-[11px] text-slate-500">{bus.routeTitle}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  {bus.status}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Driver: <strong>{bus.driverName}</strong></span>
                  <span className="font-mono">{bus.speed} km/h</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Location: {bus.currentLocation}</span>
                  <span>{bus.studentsCount} Students</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive GPS Map Simulator */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl lg:col-span-2 flex flex-col justify-between min-h-[480px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

          {/* Map Top Header */}
          <div className="relative z-10 flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
            <div>
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full uppercase">
                Live GPS Radar
              </span>
              <h2 className="text-lg font-black mt-1">{selectedBus.busNo} - {selectedBus.routeTitle}</h2>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-emerald-400">{selectedBus.speed} km/h</div>
              <div className="text-[10px] text-slate-400">Current Velocity</div>
            </div>
          </div>

          {/* Simulated Map Visualizer */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-12">
            <div className="relative w-full max-w-md h-48 border-2 border-dashed border-indigo-500/40 rounded-3xl flex items-center justify-center">
              <div className="absolute -top-3 left-6 bg-slate-900 px-3 py-1 rounded-full text-[11px] text-indigo-300 border border-slate-700">
                School Campus (Origin)
              </div>
              <div className="absolute -bottom-3 right-6 bg-slate-900 px-3 py-1 rounded-full text-[11px] text-emerald-300 border border-slate-700">
                Destination Stop
              </div>

              {/* Moving Bus Pin */}
              <div className="absolute animate-bounce bg-indigo-600 text-white p-3 rounded-2xl shadow-2xl flex items-center space-x-2 border-2 border-white">
                <Bus className="w-5 h-5" />
                <span className="text-xs font-bold">{selectedBus.currentLocation}</span>
              </div>
            </div>
          </div>

          {/* Map Footer Info */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Driver Contact</div>
              <div className="text-xs font-bold text-white mt-0.5">{selectedBus.driverName} ({selectedBus.driverPhone})</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Onboard Students</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">{selectedBus.studentsCount} Students Checked In</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">ETA to Campus</div>
              <div className="text-xs font-bold text-indigo-300 mt-0.5">14 Mins (On Time)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
