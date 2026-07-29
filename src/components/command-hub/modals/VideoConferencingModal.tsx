import React, { useState } from 'react';
import { 
  Video, X, ShieldCheck, ExternalLink, Users, Calendar, Plus, Link as LinkIcon, 
  Lock, ArrowLeft, Clock, PlayCircle, Mic, MicOff, Camera, Share2, Copy, Check, CheckCircle2
} from 'lucide-react';

interface VideoConferencingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoConferencingModal: React.FC<VideoConferencingModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'schedule' | 'active_rooms' | 'recordings'>('instant');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingType, setMeetingType] = useState('PTM');
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeRooms, setActiveRooms] = useState([
    {
      id: 'ROOM-801',
      title: 'Mathematics Grade 10 - Live Virtual Session',
      host: 'Prof. Sharma (Mathematics Dept)',
      type: 'Virtual Classroom',
      participants: 34,
      duration: '22 mins',
      link: 'https://meet.google.com/abc-defg-hij',
      isE2E: true
    },
    {
      id: 'ROOM-802',
      title: 'Weekly Academic Executive Council Briefing',
      host: 'Dr. Mehta (Principal)',
      type: 'Staff Briefing',
      participants: 12,
      duration: '45 mins',
      link: 'https://meet.google.com/xyz-pqrs-tuv',
      isE2E: true
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    const title = meetingTitle || 'Scheduled Virtual Conference';
    const newRoom = {
      id: `ROOM-${Math.floor(800 + Math.random() * 99)}`,
      title: title,
      host: 'Dr. Mehta (Principal)',
      type: meetingType,
      participants: 1,
      duration: 'Starts Soon',
      link: 'https://meet.google.com/new',
      isE2E: true
    };
    setActiveRooms([newRoom, ...activeRooms]);
    showToast(`Scheduled session "${title}" created! Automated SMS & WhatsApp invites dispatched.`);
    setMeetingTitle('');
    setActiveTab('active_rooms');
  };

  if (!isOpen) return null;

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[10000] w-screen h-screen bg-slate-900/40 backdrop-blur-md flex flex-col overflow-hidden animate-fade-in text-slate-900">
      <div className="w-full h-full bg-slate-50 flex flex-col overflow-hidden">
        
        {/* Navigation Header (Apple Style) */}
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-sm shadow-pink-500/20 shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight">Institutional Video Conferencing</h1>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-[9px] font-extrabold uppercase tracking-wider hidden sm:inline-block">
                    Virtual Studio
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden md:block leading-none mt-0.5">Virtual Classrooms • Staff Meetings • Parent-Teacher Conferences (PTM)</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Encrypted
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

        {/* Tab Navigation Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 shrink-0 overflow-x-auto">
          {[
            { id: 'instant', label: 'Instant Launcher', icon: Video },
            { id: 'schedule', label: 'Schedule Session / PTM', icon: Calendar },
            { id: 'active_rooms', label: `Active Rooms (${activeRooms.length})`, icon: Users },
            { id: 'recordings', label: 'Classroom Archives', icon: PlayCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100/70 space-y-6">
          
          {activeTab === 'instant' && (
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-black text-lg text-slate-900">Start Instant Virtual Classroom / Meeting</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Launch encrypted high-definition video session for staff, students or parents</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Security Shield Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700">1. Instant Room Type</span>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PTM">Parent-Teacher Meeting (PTM)</option>
                    <option value="Virtual Classroom">Virtual Classroom Lecture</option>
                    <option value="Staff Briefing">Staff & Faculty Briefing</option>
                    <option value="Executive Council">Executive Council Meeting</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700">2. Host Identification</span>
                  <input
                    type="text"
                    disabled
                    value="Dr. Mehta (Principal / Institution Owner)"
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl space-y-2 text-xs text-indigo-900">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Authorized Institutional Host Verification
                </p>
                <p className="text-indigo-800 leading-relaxed text-[11px]">
                  All participants will enter the waiting room first and must be admitted by the host or co-host. Attendance logs are recorded automatically for official reporting.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    window.open('https://meet.google.com/new', '_blank');
                  }}
                  className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Video className="w-5 h-5" />
                  <span>Launch Google Meet / Enterprise Studio</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="font-black text-lg text-slate-900 pb-3 border-b border-slate-100">
                Schedule Session or Parent-Teacher Conference
              </h2>

              <form onSubmit={handleScheduleSession} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting Title</label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g. Quarterly PTM - Grade 10 Board Preparation"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Time</label>
                    <input
                      type="time"
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm"
                >
                  Create & Send Automated Invites
                </button>
              </form>
            </div>
          )}

          {activeTab === 'active_rooms' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="font-black text-lg text-slate-900">Currently Live Institutional Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRooms.map((room) => (
                  <div key={room.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE NOW
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{room.duration}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{room.title}</h3>
                    <p className="text-xs text-slate-500">Host: {room.host}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-600 font-bold flex items-center gap-1">
                        <Users className="w-4 h-4 text-indigo-600" /> {room.participants} Participants
                      </span>
                      <button
                        onClick={() => window.open(room.link, '_blank')}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        Join Room <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recordings' && (
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
              <PlayCircle className="w-12 h-12 text-indigo-500 mx-auto" />
              <h3 className="font-black text-lg text-slate-900">Classroom Lecture Recording Archives</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Recorded virtual lectures are automatically processed and attached to student study portals within 15 minutes of session termination.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 inline-block font-mono">
                Storage Quota: 250 GB / 1 TB Enterprise Cloud Used
              </div>
            </div>
          )}

        </main>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-[10010] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Encrypted WebRTC / Google Meet Gateway Protocol</span>
          </div>
          <span className="text-[11px] text-slate-400">Galaxy ERP v5.2</span>
        </footer>

      </div>
    </div>
  );
};
