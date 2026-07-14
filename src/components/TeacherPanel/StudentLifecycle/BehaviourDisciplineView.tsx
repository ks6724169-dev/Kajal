import React, { useState } from 'react';
import { Activity, ShieldAlert, HeartPulse, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { initialStudents } from './studentData';

export const BehaviourDisciplineView: React.FC = () => {
  const [logs, setLogs] = useState([
    { id: '1', student: 'Rohan Gupta', type: 'Discipline', note: 'Disrupted mathematics lecture', severity: 'Warning', date: '2026-07-10' },
    { id: '2', student: 'Aarav Sharma', type: 'Positive', note: 'Helped science lab organization', severity: 'Commendation', date: '2026-07-11' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState({ student: 'Rohan Gupta', type: 'Discipline', note: '', severity: 'Warning' });

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    setLogs([{ id: `${Date.now()}`, ...newLog, date: new Date().toISOString().split('T')[0] }, ...logs]);
    setIsModalOpen(false);
    setNewLog({ student: 'Rohan Gupta', type: 'Discipline', note: '', severity: 'Warning' });
    alert('Behaviour & discipline log recorded successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Behaviour, Discipline & Counselling</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track student conduct, disciplinary actions, and wellness counselling</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Behaviour Incident</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Behaviour Alerts</h3>
              <p className="text-xs text-slate-500">Active conduct records</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">3 Cases</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Discipline Actions</h3>
              <p className="text-xs text-slate-500">Notices and meetings</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">1 Case</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Counselling Sessions</h3>
              <p className="text-xs text-slate-500">Completed this month</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">12 Sessions</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <h3 className="font-bold text-slate-900 mb-4">Recent Behaviour & Discipline Logs</h3>
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${log.severity === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {log.severity === 'Warning' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{log.student} — <span className="text-indigo-600">{log.type}</span></h4>
                  <p className="text-slate-600 mt-0.5">{log.note}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${log.severity === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {log.severity}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">{log.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddLog} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Log Behaviour Incident</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student</label>
                <select 
                  value={newLog.student}
                  onChange={(e) => setNewLog({...newLog, student: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {initialStudents.map(st => (
                    <option key={st.id} value={st.name}>{st.name} ({st.class})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Type</label>
                <select 
                  value={newLog.type}
                  onChange={(e) => setNewLog({...newLog, type: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Discipline">Discipline</option>
                  <option value="Positive">Positive Appreciation</option>
                  <option value="Counselling">Counselling Note</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Note</label>
                <textarea 
                  rows={3}
                  placeholder="Describe incident or note..."
                  value={newLog.note}
                  onChange={(e) => setNewLog({...newLog, note: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity / Tag</label>
                <select 
                  value={newLog.severity}
                  onChange={(e) => setNewLog({...newLog, severity: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Warning">Warning</option>
                  <option value="Commendation">Commendation</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm">Save Log</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
