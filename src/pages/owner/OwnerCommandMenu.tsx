import React, { useState } from 'react';
import { Search, Bell, Settings, Shield, HelpCircle, User, LogOut, ArrowRight, Sparkles, Building2, PlusCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface OwnerCommandMenuProps {
  onNavigate?: (path: string) => void;
  onClose?: () => void;
}

export const OwnerCommandMenu: React.FC<OwnerCommandMenuProps> = ({ onNavigate, onClose }) => {
  const { logout } = useAuth();
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'search', label: 'Global Search (Students, Staff, Fees)', icon: Search, path: 'search', desc: 'Find records across all campuses' },
    { id: 'notifications', label: 'Notifications Center', icon: Bell, path: 'notifications', desc: 'System alerts & audit events' },
    { id: 'settings', label: 'Settings Center', icon: Settings, path: 'settings', desc: 'School, campus & session preferences' },
    { id: 'security', label: 'Security Center', icon: Shield, path: 'security', desc: 'MFA, session activity & audit logs' },
    { id: 'help', label: 'Help & Support Center', icon: HelpCircle, path: 'help', desc: 'Documentation & ticket support' },
    { id: 'profile', label: 'Owner Profile', icon: User, path: 'profile', desc: 'Credentials & contact details' },
    { id: 'create_campus', label: '➕ Create New Campus', icon: Building2, path: 'create_campus', desc: 'Add & configure a new school campus / branch' }
  ];

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg font-bold text-slate-900">Executive Command Menu</h1>
          </div>
          <span className="text-xs font-mono text-slate-400">⌘K Quick Palette</span>
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or module name..."
            autoFocus
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Command Options List */}
        <div className="space-y-2">
          {filtered.map(cmd => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={() => {
                  if (onNavigate) onNavigate(cmd.path);
                  if (onClose) onClose();
                }}
                className="w-full p-3.5 rounded-2xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 text-left transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">{cmd.label}</h3>
                    <p className="text-[11px] text-slate-500">{cmd.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
              </button>
            );
          })}
        </div>

        {/* Logout button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              window.dispatchEvent(new CustomEvent('nav-to', { detail: '/login' }));
            }}
            className="w-full p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Galaxy ERP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
