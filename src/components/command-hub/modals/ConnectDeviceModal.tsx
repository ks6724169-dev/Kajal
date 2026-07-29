import React, { useState } from 'react';
import { 
  Smartphone, X, ShieldCheck, Wifi, Radio, AlertCircle, RefreshCw, Cpu, 
  ArrowLeft, Search, CheckCircle2, Zap, Sliders, Bus, Tv, Fingerprint, Activity, Plus
} from 'lucide-react';

interface ConnectDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampus?: string;
}

export const ConnectDeviceModal: React.FC<ConnectDeviceModalProps> = ({
  isOpen,
  onClose,
  currentCampus = 'All Campuses'
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [devices, setDevices] = useState([
    {
      id: 'DEV-101',
      name: 'Main Entrance Turnstile #01',
      type: 'Biometric & RFID Turnstile',
      category: 'turnstile',
      campus: 'Main Campus',
      status: 'Online',
      lastPing: '30s ago',
      ipAddress: '192.168.10.45',
      macAddress: '7A:31:8B:10:4F:01',
      firmware: 'v4.1.0-release',
      recordsToday: '1,240 scans'
    },
    {
      id: 'DEV-102',
      name: 'Library Access Biometric Gate',
      type: 'Fingerprint & Face Recognition',
      category: 'turnstile',
      campus: 'Main Campus',
      status: 'Online',
      lastPing: '12s ago',
      ipAddress: '192.168.10.48',
      macAddress: '7A:31:8B:10:4F:04',
      firmware: 'v4.1.0-release',
      recordsToday: '482 scans'
    },
    {
      id: 'DEV-201',
      name: 'School Bus #04 - GPS Tracker Telematics',
      type: 'GPS Bus Tracker & Speed Monitor',
      category: 'gps',
      campus: 'Main Campus',
      status: 'Online',
      lastPing: '15s ago',
      ipAddress: 'Cellular 5G IoT',
      macAddress: 'GPS-8819-BUS4',
      firmware: 'v2.8.1-telematics',
      recordsToday: 'Live Telemetry Active'
    },
    {
      id: 'DEV-202',
      name: 'School Bus #08 - GPS Tracker Telematics',
      type: 'GPS Bus Tracker & Speed Monitor',
      category: 'gps',
      campus: 'North Branch',
      status: 'Standby',
      lastPing: '4 mins ago',
      ipAddress: 'Cellular 5G IoT',
      macAddress: 'GPS-8820-BUS8',
      firmware: 'v2.8.1-telematics',
      recordsToday: 'Engine Off'
    },
    {
      id: 'DEV-301',
      name: 'Auditorium Smart Display Board',
      type: 'Digital Noticeboard & Kiosk',
      category: 'display',
      campus: 'Main Campus',
      status: 'Online',
      lastPing: '1 min ago',
      ipAddress: '192.168.20.12',
      macAddress: '00:1A:2B:3C:4D:5E',
      firmware: 'v1.4.0-android',
      recordsToday: 'Broadcast Active'
    },
    {
      id: 'DEV-401',
      name: 'Hostel Gate RFID Scanner',
      type: 'Long-Range RFID Scanner',
      category: 'rfid',
      campus: 'South Campus',
      status: 'Offline',
      lastPing: '1 hour ago',
      ipAddress: '192.168.30.15',
      macAddress: '88:77:66:55:44:33',
      firmware: 'v3.0.1',
      recordsToday: '0 scans'
    }
  ]);

  // New Node Form State
  const [newNode, setNewNode] = useState({
    name: '',
    category: 'turnstile',
    campus: 'Main Campus',
    ipAddress: '192.168.10.88'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReboot = (deviceId: string, deviceName: string) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'Rebooting...' } : d));
    showToast(`Reboot signal dispatched to ${deviceName} (${deviceId})`);
    setTimeout(() => {
      setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'Online', lastPing: 'Just now' } : d));
      showToast(`${deviceName} successfully rebooted and back online!`);
    }, 2500);
  };

  const handlePairNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNode.name) return;
    const created: any = {
      id: `DEV-${Math.floor(100 + Math.random() * 900)}`,
      name: newNode.name,
      type: newNode.category === 'turnstile' ? 'Biometric Gate' : newNode.category === 'gps' ? 'GPS Telematics' : 'Smart Display',
      category: newNode.category,
      campus: newNode.campus,
      status: 'Online',
      lastPing: 'Just now',
      ipAddress: newNode.ipAddress,
      macAddress: `00:1A:${Math.floor(10 + Math.random() * 89)}:2C:3D:${Math.floor(10 + Math.random() * 89)}`,
      firmware: 'v4.2.0-latest',
      recordsToday: '0 scans'
    };
    setDevices([created, ...devices]);
    showToast(`Hardware node "${newNode.name}" paired and connected!`);
    setIsPairingOpen(false);
    setNewNode({ name: '', category: 'turnstile', campus: 'Main Campus', ipAddress: '192.168.10.88' });
  };

  if (!isOpen) return null;

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterType === 'all' ? true : d.category === filterType;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[10000] w-screen h-screen bg-slate-900/40 backdrop-blur-md flex flex-col overflow-hidden animate-fade-in text-slate-900">
      <div className="w-full h-full bg-slate-50 flex flex-col overflow-hidden">
        
        {/* Top Navigation Header (Apple Style) */}
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight">Connect Device & Hardware Gateway</h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-extrabold uppercase tracking-wider hidden sm:inline-block">
                    IoT Hardware Hub
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden md:block leading-none mt-0.5">Biometric Turnstiles • RFID Readers • Smart Displays • Bus GPS Trackers</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPairingOpen(true)}
              className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Pair New Node</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer border border-slate-700/80"
              title="Close Full Screen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Live Hardware Telemetry Bar */}
        <div className="bg-slate-800 text-slate-200 px-6 py-2.5 border-b border-slate-700 flex flex-wrap items-center justify-between text-xs gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 font-bold text-emerald-400">
              <Wifi className="w-4 h-4 animate-pulse text-emerald-400" /> Active Campus Scope: {currentCampus}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Registered Nodes: <strong>{devices.length}</strong></span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-300">Online: <strong>{devices.filter(d => d.status === 'Online').length}</strong></span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Hardware Protocol: MQTT / Websockets</span>
            <span>Latency: &lt;15ms</span>
          </div>
        </div>

        {/* Workspace Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100/70">
          
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search device by name, ID or IP address..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Devices', icon: Radio },
                { id: 'turnstile', label: 'Biometrics & Turnstiles', icon: Fingerprint },
                { id: 'gps', label: 'Bus GPS Trackers', icon: Bus },
                { id: 'display', label: 'Smart Displays', icon: Tv }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hardware Device Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {device.id}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border flex items-center gap-1 ${
                      device.status === 'Online'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : device.status === 'Standby'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        device.status === 'Online' ? 'bg-emerald-500 animate-pulse' :
                        device.status === 'Standby' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                      {device.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {device.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    {device.type} • {device.campus}
                  </p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400 font-medium">IP Address:</span>
                      <span className="font-mono font-bold text-slate-800">{device.ipAddress}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400 font-medium">MAC Address:</span>
                      <span className="font-mono text-slate-700">{device.macAddress}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400 font-medium">Firmware:</span>
                      <span className="font-mono text-slate-700">{device.firmware}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 font-medium">Activity Today:</span>
                      <span className="font-bold text-indigo-600">{device.recordsToday}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Ping: {device.lastPing}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReboot(device.id, device.name)}
                      disabled={device.status === 'Rebooting...'}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs disabled:opacity-50"
                    >
                      {device.status === 'Rebooting...' ? 'Rebooting...' : 'Reboot'}
                    </button>
                    <button
                      onClick={() => setSelectedDevice(device)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer text-xs shadow-xs"
                    >
                      Telemetry
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </main>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-[10010] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Pair New Node Sub-Modal */}
        {isPairingOpen && (
          <div className="fixed inset-0 z-[10005] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-extrabold text-base text-slate-900">Pair New Hardware Node</h2>
                </div>
                <button 
                  onClick={() => setIsPairingOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePairNode} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hardware Device / Location Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Block Turnstile #03"
                    value={newNode.name}
                    onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Device Category</label>
                    <select
                      value={newNode.category}
                      onChange={(e) => setNewNode({ ...newNode, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      <option value="turnstile">Biometric Gate</option>
                      <option value="rfid">RFID Reader</option>
                      <option value="gps">Bus GPS Telematics</option>
                      <option value="display">Smart Display</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Campus Branch</label>
                    <select
                      value={newNode.campus}
                      onChange={(e) => setNewNode({ ...newNode, campus: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    >
                      <option value="Main Campus">Main Campus</option>
                      <option value="North Branch">North Branch</option>
                      <option value="South Campus">South Campus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Local IP / Gateway Endpoint</label>
                  <input
                    type="text"
                    value={newNode.ipAddress}
                    onChange={(e) => setNewNode({ ...newNode, ipAddress: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 font-mono">
                  Pairing Token: <strong className="text-emerald-700">GALAXY-IOT-9982</strong>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPairingOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm"
                  >
                    Pair Hardware Node
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Telemetry Diagnostics Sub-Modal */}
        {selectedDevice && (
          <div className="fixed inset-0 z-[10005] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-extrabold text-base text-slate-900">{selectedDevice.name} Telemetry</h2>
                </div>
                <button 
                  onClick={() => setSelectedDevice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400">Node ID</span>
                    <p className="font-mono font-bold text-slate-800">{selectedDevice.id}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400">IP Address</span>
                    <p className="font-mono font-bold text-slate-800">{selectedDevice.ipAddress}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400">Hardware MAC</span>
                    <p className="font-mono text-slate-700">{selectedDevice.macAddress}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400">Firmware Build</span>
                    <p className="font-mono text-slate-700">{selectedDevice.firmware}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-2">
                  <div className="flex justify-between text-emerald-400 font-bold border-b border-slate-800 pb-1.5">
                    <span>LIVE DIAGNOSTICS HANDSHAKE</span>
                    <span>ONLINE</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Socket Ping Latency:</span>
                    <span className="text-white">12 ms</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>CPU Load / Temp:</span>
                    <span className="text-white">14% / 38°C</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Memory Usage:</span>
                    <span className="text-white">210 MB / 1024 MB</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Offline Sync Buffer:</span>
                    <span className="text-white">0 records pending</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Firmware upgrade package pushed to ${selectedDevice.name}!`);
                  }}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Check Firmware Update
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDevice(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close Telemetry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Screen Page Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Encrypted Hardware Telemetry Gateway (TLS 1.3)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Auto-Discovery Active</span>
            <span>•</span>
            <span>Push-SDK v2.1</span>
          </div>
        </footer>

      </div>
    </div>
  );
};
