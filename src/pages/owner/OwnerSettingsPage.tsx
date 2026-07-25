import React, { useState } from 'react';
import { Settings, Building2, Globe, Bell, Shield, Sliders, Save, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Tenant } from '../../types';

interface OwnerSettingsPageProps {
  tenant?: Tenant;
  onNavigate?: (path: string) => void;
}

export const OwnerSettingsPage: React.FC<OwnerSettingsPageProps> = ({ tenant, onNavigate }) => {
  const [schoolName, setSchoolName] = useState(tenant?.name || 'Apex International K-12');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [language, setLanguage] = useState('English');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">Settings Center</h1>
            <p className="text-xs text-slate-500">Configure global school parameters, campus defaults & notifications</p>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* School & Organization Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">School & Organization</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Active Academic Session</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="2026-2027">Academic Session 2026-2027</option>
                <option value="2025-2026">Academic Session 2025-2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferences & Language */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Localization & Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">System Primary Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="English">English (US / IN)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Notification Delivery Channels</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-800">Email Audit Alerts</p>
                <p className="text-[11px] text-slate-500">Send security logins and critical financial receipts via email</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-800">WhatsApp Fee Reminders</p>
                <p className="text-[11px] text-slate-500">Send automated payment links and due receipts on WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
