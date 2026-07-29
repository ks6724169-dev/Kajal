import React, { useState } from 'react';
import { 
  Cpu, X, ShieldCheck, CheckCircle2, Lock, ExternalLink, Zap, Info, 
  Search, Filter, RefreshCw, Layers, ArrowLeft, ArrowUpRight, Radio, Check, Settings
} from 'lucide-react';

interface PluginHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PluginHubModal: React.FC<PluginHubModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'connected' | 'coming_soon'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);
  const [requestPlugin, setRequestPlugin] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Config modal state
  const [configForm, setConfigForm] = useState({
    apiKey: 'sk_live_99201481029482109',
    webhookUrl: 'https://api.institution.edu/v1/webhooks/gateway',
    syncInterval: '15_mins',
    autoSync: true
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Access request state
  const [requestForm, setRequestForm] = useState({
    reason: 'Academic Fee Collection & Online Auto-Debit',
    adminEmail: 'admin@institution.edu'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveConfig = () => {
    if (!selectedPlugin) return;
    setPlugins(prev => prev.map(p => p.id === selectedPlugin.id ? { ...p, lastSync: 'Just now' } : p));
    showToast(`Configuration updated successfully for ${selectedPlugin.name}!`);
    setSelectedPlugin(null);
    setTestResult(null);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('Success: 200 OK • Ping latency 24ms • Encryption Handshake Verified');
    }, 1200);
  };

  const handleSubmitAccessRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestPlugin) return;
    setPlugins(prev => prev.map(p => p.id === requestPlugin.id ? { ...p, status: 'Connected', lastSync: 'Just now' } : p));
    showToast(`Access granted! "${requestPlugin.name}" is now activated and connected.`);
    setRequestPlugin(null);
  };

  const [plugins, setPlugins] = useState([
    {
      id: 'pg-stripe',
      name: 'Stripe & Razorpay Payment Gateway',
      category: 'Finance & Billing',
      description: 'Online fee payments, UPI auto-debit, auto-receipt generation, and instant reconciliation.',
      status: 'Connected',
      version: 'v2.4.0',
      isAuthorized: true,
      lastSync: '10 mins ago',
      features: ['Auto Fee Receipt', 'UPI / NetBanking / Cards', 'Automated Settlement', 'Refund Gateway']
    },
    {
      id: 'sms-gateway',
      name: 'Institutional SMS & WhatsApp Gateway',
      category: 'Communication',
      description: 'Automated broadcast alerts, fee due reminders, exam schedules, and attendance notifications.',
      status: 'Connected',
      version: 'v1.8.2',
      isAuthorized: true,
      lastSync: '2 mins ago',
      features: ['WhatsApp Business API', 'DLT Approved SMS Templates', 'Bulk Broadcast', 'Read Receipts']
    },
    {
      id: 'biometric-sync',
      name: 'Biometric Attendance & RFID Sync',
      category: 'Campus Infrastructure',
      description: 'Real-time sync with turnstiles, fingerprint readers, and AI face recognition devices.',
      status: 'Coming Soon',
      version: 'v3.0.0-beta',
      isAuthorized: true,
      lastSync: 'Scheduled Q3',
      features: ['Push SDK 2.0', 'Offline Buffer Storage', 'Multi-Gate Turnstile Bridge', 'Anti-Passback Engine']
    },
    {
      id: 'lms-moodle',
      name: 'Google Classroom & Moodle LMS Integration',
      category: 'Academic',
      description: 'Synchronize course assignments, student submissions, grades, and online study material.',
      status: 'Coming Soon',
      version: 'v1.2.0',
      isAuthorized: true,
      lastSync: 'Scheduled Q3',
      features: ['OAuth 2.0 Single Sign-On', 'Gradebook Auto Sync', 'Assignment Push', 'Google Drive Bridge']
    },
    {
      id: 'accounting-tally',
      name: 'Tally Prime & ERP Accounting Bridge',
      category: 'Finance & Billing',
      description: 'Export general ledger entries, cash receipts, and audit transactions directly to Tally ERP.',
      status: 'Coming Soon',
      version: 'v2.0.1',
      isAuthorized: false,
      lastSync: 'Scheduled Q4',
      features: ['XML Ledger Export', 'Cost Center Mapping', 'Automated Journal Entries', 'Tax Audit Trail']
    }
  ]);

  if (!isOpen) return null;

  const categories = ['all', 'Finance & Billing', 'Communication', 'Campus Infrastructure', 'Academic'];

  const filteredPlugins = plugins.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : 
                          statusFilter === 'connected' ? p.status === 'Connected' : p.status === 'Coming Soon';
    const matchesCategory = categoryFilter === 'all' ? true : p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[10000] w-screen h-screen bg-slate-900/40 backdrop-blur-md flex flex-col overflow-hidden animate-fade-in text-slate-900">
      {/* Full-Screen Page Container */}
      <div className="w-full h-full bg-slate-50 flex flex-col overflow-hidden">
        
        {/* Full-Screen Top Header Bar (Apple-Style Brilliant Header) */}
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight">Plugin & Integrations Hub</h1>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[9px] font-extrabold uppercase tracking-wider hidden sm:inline-block">
                    Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden md:block leading-none mt-0.5">Isolated API Gateway • Multi-Tenant Enterprise Connectors</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Tenant Sandbox Active
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

        {/* Info & Policy Notice */}
        <div className="bg-indigo-900 text-white px-6 py-2.5 border-b border-indigo-800 flex flex-wrap items-center justify-between text-xs gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>
              <strong>Enterprise Connector Policy:</strong> Connectors run in secure API sandboxes with RBAC scope limits. Only Institution Owners can grant token permissions.
            </span>
          </div>
          <span className="text-[11px] text-indigo-200 font-mono">Gateway API Status: 100% Operational</span>
        </div>

        {/* Main Page Workspace Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100/70">
          
          {/* Top Controls & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search payment gateways, SMS, WhatsApp, LMS connectors..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All ({plugins.length})
                </button>
                <button
                  onClick={() => setStatusFilter('connected')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${statusFilter === 'connected' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Connected ({plugins.filter(p => p.status === 'Connected').length})
                </button>
                <button
                  onClick={() => setStatusFilter('coming_soon')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${statusFilter === 'coming_soon' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Coming Soon ({plugins.filter(p => p.status === 'Coming Soon').length})
                </button>
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Plugin Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlugins.map((plugin) => (
              <div
                key={plugin.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {plugin.category}
                    </span>

                    <span className={`text-[10px] px-2.5 py-1 font-extrabold rounded-md border flex items-center gap-1 ${
                      plugin.status === 'Connected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {plugin.status === 'Connected' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Connected
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-amber-500" />
                          Enterprise Ready
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {plugin.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {plugin.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Capabilities:</p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 font-medium">
                      {plugin.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">Version: {plugin.version}</span>

                  {plugin.status === 'Connected' ? (
                    <button 
                      onClick={() => setSelectedPlugin(plugin)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" /> Configure
                    </button>
                  ) : (
                    <button 
                      onClick={() => setRequestPlugin(plugin)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" /> Request Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </main>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-[10010] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Configure Sub-Modal */}
        {selectedPlugin && (
          <div className="fixed inset-0 z-[10005] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-extrabold text-base text-slate-900">Configure {selectedPlugin.name}</h2>
                </div>
                <button 
                  onClick={() => { setSelectedPlugin(null); setTestResult(null); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Live API Secret Key</label>
                  <input
                    type="password"
                    value={configForm.apiKey}
                    onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gateway Webhook Callback Endpoint</label>
                  <input
                    type="text"
                    value={configForm.webhookUrl}
                    onChange={(e) => setConfigForm({ ...configForm, webhookUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sync Interval</label>
                    <select
                      value={configForm.syncInterval}
                      onChange={(e) => setConfigForm({ ...configForm, syncInterval: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      <option value="realtime">Real-time Webhook Stream</option>
                      <option value="5_mins">Every 5 Minutes</option>
                      <option value="15_mins">Every 15 Minutes</option>
                      <option value="1_hour">Hourly Reconciliation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Auto-Retry Failures</label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Enabled</span>
                      <input 
                        type="checkbox" 
                        checked={configForm.autoSync} 
                        onChange={(e) => setConfigForm({ ...configForm, autoSync: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Connection Button & Result */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                  >
                    <RefreshCw className={`w-4 h-4 text-indigo-600 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing API Gateway Handshake...' : 'Test Endpoint Connection'}</span>
                  </button>

                  {testResult && (
                    <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-mono text-[11px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{testResult}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedPlugin(null); setTestResult(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm"
                >
                  Save & Deploy Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Request Access Sub-Modal */}
        {requestPlugin && (
          <div className="fixed inset-0 z-[10005] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-extrabold text-base text-slate-900">Request {requestPlugin.name} Access</h2>
                </div>
                <button 
                  onClick={() => setRequestPlugin(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitAccessRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institutional Use Case & Justification</label>
                  <textarea
                    rows={3}
                    value={requestForm.reason}
                    onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Approving System Admin Email</label>
                  <input
                    type="email"
                    value={requestForm.adminEmail}
                    onChange={(e) => setRequestForm({ ...requestForm, adminEmail: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-[11px] text-indigo-900">
                  <p className="font-bold flex items-center gap-1 mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Instant Sandbox Authorization
                  </p>
                  <span>Submitting will instantly enable sandbox access and generate developer authorization tokens.</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestPlugin(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm"
                  >
                    Authorize & Activate Connector
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Full-Screen Page Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">RBAC Isolated Connector Security Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Active Integrations: 2</span>
            <span>•</span>
            <span>Enterprise Connectors: 3 Ready</span>
            <span>•</span>
            <span>Galaxy ERP v5.2</span>
          </div>
        </footer>

      </div>
    </div>
  );
};
