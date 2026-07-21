import React, { useState } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { Award, Star, PlusCircle, Save } from 'lucide-react';

export const HouseManagement: React.FC = () => {
  const { houses, incrementHousePoints } = usePortfolio();
  const [selectedHouse, setSelectedHouse] = useState('Gold Phoenixes');
  const [points, setPoints] = useState(10);
  const [reason, setReason] = useState('');

  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    incrementHousePoints(selectedHouse, points);
    setReason('');
    alert(`Success! Awarded ${points} points to ${selectedHouse}. Leaderboard updated.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Academic House Management & Leaderboard</h2>
        <p className="text-xs text-slate-400 font-medium">Audit house representation records, reward positive behavior, and compile terminal house shield points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leaderboard list */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Current Society Standings</span>
          <div className="space-y-3">
            {houses.map(h => (
              <div key={h.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center space-x-3.5">
                  <span className="text-2xl">{h.logo}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{h.name}</h4>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 mt-1">
                      <span>Master: {h.master}</span>
                      <span>•</span>
                      <span>Captain: {h.captain}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-800 dark:text-slate-100 block">{h.points}</span>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">shield points</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Award Points form */}
        <form onSubmit={handleAddPoints} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-2xs h-fit">
          <div className="flex items-center space-x-1.5 text-indigo-600 border-b border-slate-100 dark:border-slate-800 pb-2">
            <PlusCircle className="w-4.5 h-4.5" />
            <h4 className="text-xs font-black uppercase tracking-wider">Allocate House Points</h4>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select Target House</label>
            <select value={selectedHouse} onChange={e => setSelectedHouse(e.target.value)} className="form-select">
              {houses.map(h => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Reward Points</label>
            <select value={points} onChange={e => setPoints(Number(e.target.value))} className="form-select">
              <option value={10}>10 Points (Standard Merit)</option>
              <option value={25}>25 Points (Olympiad/Hackathon Medal)</option>
              <option value={50}>50 Points (Annual Champion Shield)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Allocation Reason</label>
            <textarea required value={reason} onChange={e => setReason(e.target.value)} placeholder="Provide context of the victory or behavior..." rows={3} className="form-input resize-none" />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer">
            <Save className="w-4 h-4" />
            <span>Approve & Add Points</span>
          </button>
        </form>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: rgb(248, 250, 252);
          border: 1px solid rgb(226, 232, 240);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 500;
          color: rgb(30, 41, 59);
          outline: none;
        }
        .dark .form-input {
          background: rgb(15, 23, 42);
          border-color: rgb(30, 41, 59);
          color: rgb(241, 245, 249);
        }
        .form-select {
          width: 100%;
          background: rgb(248, 250, 252);
          border: 1px solid rgb(226, 232, 240);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          color: rgb(51, 65, 85);
          outline: none;
          cursor: pointer;
        }
        .dark .form-select {
          background: rgb(15, 23, 42);
          border-color: rgb(30, 41, 59);
          color: rgb(226, 226, 240);
        }
      `}</style>
    </div>
  );
};
