import React, { useState } from 'react';
import { 
  Printer, UploadCloud, DownloadCloud, Repeat, X, ShieldCheck, CheckCircle2, 
  FileText, ArrowRight, Lock, AlertCircle, History, Building2, ArrowLeft, Search, Check, Eye
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface RecordsExchangeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampus?: string;
}

export const RecordsExchangeHubModal: React.FC<RecordsExchangeHubModalProps> = ({
  isOpen,
  onClose,
  currentCampus = 'All Campuses'
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'print' | 'push' | 'pull' | 'transfer'>('print');
  const [selectedDoc, setSelectedDoc] = useState('report_card');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [targetInstitute, setTargetInstitute] = useState('');
  const [transferStep, setTransferStep] = useState(1); // 1: Request, 2: Authorization, 3: Package Generation, 4: Exchange
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [auditLogs, setAuditLogs] = useState<Array<{ timestamp: string; action: string; details: string; status: string }>>([
    {
      timestamp: new Date().toLocaleTimeString(),
      action: 'Session Initialized',
      details: 'Records Exchange Hub opened with active RBAC context',
      status: 'VERIFIED'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isOpen) return null;

  const printableDocs = [
    { id: 'marksheet', name: 'Official Marksheet', desc: 'Term/Semester Subject Performance Marksheet' },
    { id: 'report_card', name: 'Comprehensive Report Card', desc: 'Academic & Co-curricular Progress Report' },
    { id: 'transfer_cert', name: 'Transfer Certificate (TC)', desc: 'Official School Leaving / Transfer Certificate' },
    { id: 'character_cert', name: 'Character Certificate', desc: 'Conduct & Institutional Character Verification' },
    { id: 'fee_receipt', name: 'Fee Payment Receipt', desc: 'Official Paid Fee Invoice & Transaction Receipt' },
    { id: 'admit_card', name: 'Examination Admit Card', desc: 'Board / Annual Exam Entry Hall Ticket' }
  ];

  const handlePrintDocument = () => {
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      action: 'Print Triggered',
      details: `Doc: ${selectedDoc} | Student ID: ${studentIdInput || 'Batch Standard'}`,
      status: 'AUDITED'
    };
    setAuditLogs([log, ...auditLogs]);
    showToast(`Preparing print document: ${printableDocs.find(d => d.id === selectedDoc)?.name}...`);
    setTimeout(() => window.print(), 300);
  };

  const handlePushRecords = () => {
    if (!studentIdInput || !targetInstitute) {
      showToast('Please enter both Student ID and Target Institution / Board Code.');
      return;
    }
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      action: 'Push Record Package',
      details: `Student: ${studentIdInput} -> Target: ${targetInstitute}`,
      status: 'COMPLETED'
    };
    setAuditLogs([log, ...auditLogs]);
    showToast(`Secure Record Package for Student ${studentIdInput} pushed to ${targetInstitute}.`);
  };

  const handlePullRecords = () => {
    if (!studentIdInput || !targetInstitute) {
      showToast('Please enter both Student ID and Source Institution Code.');
      return;
    }
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      action: 'Pull Record Request',
      details: `Source: ${targetInstitute} -> Student: ${studentIdInput}`,
      status: 'PENDING_AUTHORIZATION'
    };
    setAuditLogs([log, ...auditLogs]);
    showToast(`Record Pull Request submitted to ${targetInstitute}. Pending authorization.`);
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-purple-500/20 shrink-0">
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight">Records Exchange & Print Hub</h1>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[9px] font-extrabold uppercase tracking-wider hidden sm:inline-block">
                    Encrypted Hub
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden md:block leading-none mt-0.5">Official Document Printing • Cross-Institution Transfer • Verified Board Exchange</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Digital Signature Verified
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

        {/* Action Navigation Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 shrink-0 overflow-x-auto">
          {[
            { id: 'print', label: '1. Print Center', icon: Printer },
            { id: 'push', label: '2. Push Records Out', icon: UploadCloud },
            { id: 'pull', label: '3. Pull External Records', icon: DownloadCloud },
            { id: 'transfer', label: '4. Student Record Transfer Workflow', icon: Repeat }
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

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100/70 space-y-6">
          
          {/* TAB 1: PRINT CENTER */}
          {activeTab === 'print' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Selection */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h2 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3">
                  Select Official Document
                </h2>

                <div className="space-y-2">
                  {printableDocs.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc.id)}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        selectedDoc === doc.id
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-3xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs">{doc.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{doc.desc}</p>
                      </div>
                      {selectedDoc === doc.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID / Roll No (Optional)</label>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. STU-2026-8810"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handlePrintDocument}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" /> Print / Export Document PDF
                </button>
              </div>

              {/* Right Column: Live Printable Document Preview */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-bold text-xs text-slate-700 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600" /> Print Document Preview
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Official Institutional Seal Active
                  </span>
                </div>

                {/* Printable Paper Canvas */}
                <div className="p-8 bg-white border-2 border-slate-300 rounded-xl shadow-inner min-h-[420px] font-serif text-slate-900 space-y-6 max-w-xl mx-auto">
                  <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
                    <h3 className="font-black text-xl tracking-wider text-slate-900 uppercase">GALAXY INTERNATIONAL ACADEMY</h3>
                    <p className="text-xs font-sans font-bold text-slate-600">Affiliated with CBSE / State Board • Code: SCH-88190</p>
                    <p className="text-[10px] font-sans text-slate-500">Main Campus, Institutional Area, Sector 14</p>
                  </div>

                  <div className="text-center font-sans font-black text-sm uppercase tracking-widest text-indigo-900 py-1 bg-slate-100 rounded">
                    {printableDocs.find(d => d.id === selectedDoc)?.name || 'Official Document'}
                  </div>

                  <div className="font-sans text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student Name:</span>
                      <span className="font-bold">Aarav Sharma</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Roll No / Student ID:</span>
                      <span className="font-mono font-bold">{studentIdInput || 'STU-2026-8810'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Academic Year:</span>
                      <span className="font-bold">2025-2026</span>
                    </div>
                  </div>

                  <div className="font-sans text-[11px] text-slate-600 border-t border-slate-200 pt-4 leading-relaxed">
                    This document is officially generated by Galaxy ERP. Digitally verified by Principal Authority with RBAC Encryption Key #GALAXY-8810-SIG.
                  </div>

                  <div className="pt-8 flex items-center justify-between font-sans text-[10px] font-bold text-slate-700">
                    <div>
                      <p className="border-t border-slate-400 pt-1 w-28 text-center">Registrar Seal</p>
                    </div>
                    <div className="text-right">
                      <p className="border-t border-slate-400 pt-1 w-28 text-center">Principal Signature</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PUSH RECORDS */}
          {activeTab === 'push' && (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
                Push Encrypted Record Package
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. STU-2026-8810"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Board / Receiving Institution Code</label>
                  <input
                    type="text"
                    value={targetInstitute}
                    onChange={(e) => setTargetInstitute(e.target.value)}
                    placeholder="e.g. CBSE-BOARD-NORTH / SCH-9921"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={handlePushRecords}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" /> Push Encrypted Package
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PULL RECORDS */}
          {activeTab === 'pull' && (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
                Request External Student Record Pull
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student ID / Enrollment Number</label>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. STU-2026-8810"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Institution Code</label>
                  <input
                    type="text"
                    value={targetInstitute}
                    onChange={(e) => setTargetInstitute(e.target.value)}
                    placeholder="e.g. SCH-7712"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={handlePullRecords}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <DownloadCloud className="w-4 h-4" /> Dispatch Pull Request
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT TRANSFER WORKFLOW */}
          {activeTab === 'transfer' && (
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
                4-Step Student Record Migration Workflow
              </h2>

              {/* 4 Steps Progress Bar */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { step: 1, title: '1. Request Submission' },
                  { step: 2, title: '2. Authority Approval' },
                  { step: 3, title: '3. Package Generation' },
                  { step: 4, title: '4. Audit Exchange' }
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setTransferStep(s.step)}
                    className={`p-2.5 rounded-xl border font-bold transition cursor-pointer ${
                      transferStep === s.step
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : transferStep > s.step
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <p className="font-bold text-slate-800">Current Step: {transferStep} of 4</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTransferStep(Math.max(1, transferStep - 1))}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={() => setTransferStep(Math.min(4, transferStep + 1))}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                  >
                    Next Step →
                  </button>
                </div>
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
            <span className="font-semibold text-slate-700">Audit Logged & RBAC Encrypted Record Transmission</span>
          </div>
          <span className="text-[11px] text-slate-400">Galaxy ERP v5.2</span>
        </footer>

      </div>
    </div>
  );
};
