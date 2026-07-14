import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  Link as LinkIcon, 
  Users, 
  MessageSquare, 
  Monitor, 
  Edit3, 
  CircleDot, 
  Play, 
  Square, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Send, 
  ShieldCheck,
  UserCheck,
  Search
} from 'lucide-react';

export const OnlineClassesView: React.FC = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      title: 'Advanced Calculus Live Lecture: Limits & Continuity',
      subject: 'Advanced Mathematics',
      grade: 'Grade 10-A',
      scheduleTime: 'Today, 10:00 AM - 11:00 AM',
      meetingLink: 'https://meet.galaxyedu.app/math-10a-calc',
      status: 'Live',
      attendanceCount: 38,
      totalStudents: 42,
      isRecording: true
    },
    {
      id: 2,
      title: 'Trigonometric Identities & Proof Workshop',
      subject: 'Trigonometry',
      grade: 'Grade 12-A',
      scheduleTime: 'Today, 02:00 PM - 03:00 PM',
      meetingLink: 'https://meet.galaxyedu.app/trig-12a-workshop',
      status: 'Upcoming',
      attendanceCount: 0,
      totalStudents: 35,
      isRecording: false
    },
    {
      id: 3,
      title: 'Applied Statistics & Probability Q&A',
      subject: 'Applied Statistics',
      grade: 'Grade 11-B',
      scheduleTime: 'Tomorrow, 11:30 AM - 12:30 PM',
      meetingLink: 'https://meet.galaxyedu.app/stats-11b-qa',
      status: 'Upcoming',
      attendanceCount: 0,
      totalStudents: 38,
      isRecording: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeLiveClass, setActiveLiveClass] = useState<any>(null);
  const [isVirtualRoomOpen, setIsVirtualRoomOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Virtual Room Interactive States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Alice Smith', text: 'Good morning professor!', time: '10:02 AM' },
    { sender: 'Bob Johnson', text: 'Will this lecture cover epsilon-delta proofs?', time: '10:03 AM' },
    { sender: 'Professor', text: 'Yes Bob, we will derive it in the second half.', time: '10:04 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // New Schedule form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Advanced Mathematics');
  const [grade, setGrade] = useState('Grade 10-A');
  const [scheduleTime, setScheduleTime] = useState('Tomorrow, 09:00 AM');

  const handleScheduleClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newClass = {
      id: Date.now(),
      title,
      subject,
      grade,
      scheduleTime,
      meetingLink: `https://meet.galaxyedu.app/${subject.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
      status: 'Upcoming',
      attendanceCount: 0,
      totalStudents: 40,
      isRecording: false
    };

    setClasses([newClass, ...classes]);
    setTitle('');
    setIsScheduleModalOpen(false);
    alert('Live class scheduled successfully.');
  };

  const handleStartOrJoin = (cls: any) => {
    setActiveLiveClass(cls);
    setIsRecording(cls.isRecording);
    setIsVirtualRoomOpen(true);
  };

  const handleEndClass = (id: number) => {
    setClasses(classes.map(c => c.id === id ? { ...c, status: 'Completed', isRecording: false } : c));
    setIsVirtualRoomOpen(false);
    alert('Live class ended successfully. Attendance report generated.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: 'You (Host)', text: newMessage, time: 'Just now' }]);
    setNewMessage('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    alert(isRecording ? 'Class recording stopped and saved.' : 'Class recording started.');
  };

  const filteredClasses = classes.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-6 h-6 text-emerald-600" />
            Online Classes & Virtual Classroom Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage live class schedules, meeting links, attendance tracking, interactive chat, screen sharing, whiteboard, and recordings.</p>
        </div>

        <button 
          onClick={() => setIsScheduleModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Schedule Live Class
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search live classes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 text-sm">
            No online classes found matching your search.
          </div>
        ) : (
          filteredClasses.map(cls => (
            <div key={cls.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 ${cls.status === 'Live' ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' : cls.status === 'Upcoming' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600'}`}>
                    <CircleDot className={`w-3 h-3 ${cls.status === 'Live' ? 'text-rose-600' : 'text-slate-400'}`} />
                    {cls.status}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {cls.grade}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {cls.subject}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{cls.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {cls.scheduleTime}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> Attendance: <b>{cls.attendanceCount}/{cls.totalStudents}</b></span>
                  {cls.isRecording && <span className="text-rose-600 font-bold flex items-center gap-1">● Recording Active</span>}
                </div>

                <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-indigo-600 font-medium select-all">{cls.meetingLink}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {cls.status === 'Live' ? (
                  <button 
                    onClick={() => handleStartOrJoin(cls)}
                    className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition flex items-center gap-2 shadow-sm"
                  >
                    <Video className="w-4 h-4" /> Join Live Room
                  </button>
                ) : cls.status === 'Upcoming' ? (
                  <button 
                    onClick={() => handleStartOrJoin(cls)}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-current" /> Start Class
                  </button>
                ) : (
                  <button 
                    onClick={() => alert('Accessing recording archive...')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    View Recording
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Virtual Classroom Room Modal (Live Session) */}
      {isVirtualRoomOpen && activeLiveClass && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col">
          {/* Top Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-bold uppercase animate-pulse flex items-center gap-1">
                ● LIVE
              </span>
              <h3 className="text-sm font-bold">{activeLiveClass.title}</h3>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button 
                onClick={toggleRecording}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                <CircleDot className="w-3.5 h-3.5" /> {isRecording ? 'Recording (Stop)' : 'Record Class'}
              </button>

              <button 
                onClick={() => handleEndClass(activeLiveClass.id)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition"
              >
                End Class for All
              </button>
            </div>
          </div>

          {/* Main Stage & Chat Layout */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Video Canvas / Whiteboard / Screen Share */}
            <div className="flex-1 bg-slate-950 p-6 flex flex-col justify-between relative">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-semibold">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> {activeLiveClass.attendanceCount} Students Connected
              </div>

              {/* Center Stage */}
              <div className="flex-1 flex items-center justify-center">
                {isWhiteboardActive ? (
                  <div className="w-full h-full bg-white rounded-3xl p-6 text-slate-900 flex flex-col justify-between shadow-2xl">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs font-bold text-slate-500">
                      <span>Interactive Whiteboard (Host Canvas)</span>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg">Pen Tool Active</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
                      [Interactive Whiteboard Drawing Area - Students are viewing in real-time]
                    </div>
                  </div>
                ) : isScreenSharing ? (
                  <div className="w-full h-full bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-300">
                    <Monitor className="w-16 h-16 text-emerald-500 mb-3 animate-pulse" />
                    <p className="font-bold text-sm text-white">You are sharing your screen</p>
                    <p className="text-xs text-slate-400 mt-1">All connected participants can see your desktop feed.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full h-full max-h-[500px]">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
                      <div className="w-20 h-20 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                        Host
                      </div>
                      <span className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-xl text-[11px] text-white font-medium">
                        Professor (You)
                      </span>
                    </div>

                    {[1, 2, 3, 4, 5].map((studentNum) => (
                      <div key={studentNum} className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center justify-center relative">
                        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                          S{studentNum}
                        </div>
                        <span className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-xl text-[11px] text-white font-medium">
                          Student {studentNum}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Control Bar */}
              <div className="flex justify-center items-center gap-3 pt-4">
                <button 
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${isScreenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  <Monitor className="w-4 h-4" /> {isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
                </button>
                <button 
                  onClick={() => setIsWhiteboardActive(!isWhiteboardActive)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${isWhiteboardActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  <Edit3 className="w-4 h-4" /> {isWhiteboardActive ? 'Close Whiteboard' : 'Whiteboard'}
                </button>
              </div>
            </div>

            {/* Live Chat & Attendance Sidebar */}
            <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-72 lg:h-auto">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center text-white text-xs font-bold">
                <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-emerald-400" /> Live Class Chat</span>
                <span className="text-slate-400">{chatMessages.length} Messages</span>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-3 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                      <span className="text-emerald-400">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="Type message to class..." 
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Live Class Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Schedule New Live Online Class</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleScheduleClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Title / Topic</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Chapter 6 Derivative Review" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade / Class</label>
                  <input 
                    type="text" 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Schedule Time</label>
                <input 
                  type="text" 
                  value={scheduleTime} 
                  onChange={(e) => setScheduleTime(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">Schedule Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
