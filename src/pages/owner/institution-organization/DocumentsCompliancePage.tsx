import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  History,
  Lock,
  X,
  Loader2,
  RefreshCw,
  UploadCloud,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { Tenant } from '../../../types';
import { AuditLogger } from '../../../services/AuditLogger';
import { ComplianceDocumentService, ComplianceDoc } from '../../../services/ComplianceDocumentService';
import { useAuth } from '../../../hooks/useAuth';

interface DocumentsCompliancePageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
  currentCampus?: string;
}

export const DocumentsCompliancePage: React.FC<DocumentsCompliancePageProps> = ({ 
  tenant, 
  onNavigate,
  currentCampus = 'All Campuses'
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<ComplianceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'legal' | 'regulatory' | 'compliance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Selected file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<ComplianceDoc | null>(null);

  // Renewal Modal State
  const [renewingDoc, setRenewingDoc] = useState<ComplianceDoc | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState<string>('');

  const [newDocForm, setNewDocForm] = useState({
    name: '',
    type: 'LEGAL' as 'LEGAL' | 'REGULATORY' | 'COMPLIANCE',
    category: 'Registration',
    issuer: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });

  const effectiveTenantId = tenant?.id || 'apex_k12';

  // Load documents on mount or campus change
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await ComplianceDocumentService.getDocuments(effectiveTenantId, currentCampus);
      setDocuments(data);
    } catch (e) {
      console.error('Error loading compliance documents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [effectiveTenantId, currentCampus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'EXPIRING_SOON': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'EXPIRED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle2 className="w-3 h-3" />;
      case 'EXPIRING_SOON': return <Clock className="w-3 h-3" />;
      case 'EXPIRED': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext)) {
      setUploadError('Invalid file type. Supported formats: PDF, DOCX, PNG, JPG.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) { // 25 MB
      setUploadError('File exceeds maximum size limit of 25MB.');
      return;
    }

    setSelectedFile(file);
    if (!newDocForm.name) {
      // Auto-fill name without extension
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setNewDocForm(prev => ({ ...prev, name: baseName }));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocForm.name || !newDocForm.issuer) {
      setUploadError('Please fill in all required fields.');
      return;
    }

    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // 1. Upload file to Supabase storage (with fallback)
      const { fileUrl } = await ComplianceDocumentService.uploadFileToStorage(selectedFile, effectiveTenantId);

      // 2. Persist metadata to database & local store
      await ComplianceDocumentService.createDocument({
        tenantId: effectiveTenantId,
        campusId: currentCampus,
        name: newDocForm.name,
        type: newDocForm.type,
        category: newDocForm.type === 'LEGAL' ? 'Registration' : newDocForm.type === 'REGULATORY' ? 'Affiliation' : 'Safety',
        fileUrl,
        fileName: selectedFile.name,
        fileType: selectedFile.type || 'application/pdf',
        fileSize: ComplianceDocumentService.formatFileSize(selectedFile.size),
        issueDate: newDocForm.issueDate || new Date().toISOString().split('T')[0],
        expiryDate: newDocForm.expiryDate || '2030-12-31',
        issuer: newDocForm.issuer,
        uploadedBy: user?.name || user?.email || 'Institution Owner'
      });

      // 3. Reset form and reload
      setShowUploadModal(false);
      setSelectedFile(null);
      setNewDocForm({
        name: '',
        type: 'LEGAL',
        category: 'Registration',
        issuer: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: ''
      });
      await loadDocuments();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError('Failed to upload document. Please check network and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmRenew = async () => {
    if (!renewingDoc || !newExpiryDate) return;
    setUploading(true);
    try {
      await ComplianceDocumentService.renewDocument(
        renewingDoc.id,
        renewingDoc.name,
        effectiveTenantId,
        newExpiryDate
      );
      setRenewingDoc(null);
      setNewExpiryDate('');
      await loadDocuments();
    } catch (e) {
      console.error('Renewal failed:', e);
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (doc: ComplianceDoc) => {
    ComplianceDocumentService.logDocumentViewed(doc.id, doc.name, effectiveTenantId, user?.name || user?.email);
    let signedUrl = doc.file_url;
    if (doc.file_url) {
      signedUrl = await ComplianceDocumentService.getSignedDocumentUrl(doc.file_url, 3600);
    }
    setPreviewDoc({ ...doc, file_url: signedUrl });
  };

  const handleDownload = async (doc: ComplianceDoc) => {
    ComplianceDocumentService.logDocumentDownloaded(doc.id, doc.name, effectiveTenantId, user?.name || user?.email);

    if (doc.file_url) {
      const signedUrl = await ComplianceDocumentService.getSignedDocumentUrl(doc.file_url, 3600);
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = doc.file_name || `${doc.name.replace(/\s+/g, '_')}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const content = `GALAXY ERP COMPLIANCE DOCUMENT\n--------------------------------\nTitle: ${doc.name}\nIssuer: ${doc.issuer}\nVersion: ${doc.version}\nExpiry Date: ${doc.expiry_date || doc.expiryDate}\nStatus: ${doc.status}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.name.replace(/\s+/g, '_')}.txt`;
      link.click();
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.type.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6 mb-10">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
             Work Area: 08 • Campus: {currentCampus}
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Documents & Compliance</h1>
           <p className="text-slate-500 text-sm mt-1 max-w-xl">Centralized institutional vault for legal, statutory, and regulatory compliance documents.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadDocuments} 
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-xs cursor-pointer"
            title="Refresh Vault"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Upload Compliance Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Main Workspace */}
        <div className="xl:col-span-8 space-y-6">
           {/* Filters & Search */}
           <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-slate-50 rounded-lg border border-slate-100">
                 {['all', 'legal', 'regulatory', 'compliance'].map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setActiveCategory(cat as any)}
                     className={`px-4 py-2 rounded text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                       activeCategory === cat ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                     }`}
                   >
                      {cat}
                   </button>
                 ))}
              </div>
              <div className="relative group w-full md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Search vault..."
                   className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-500 transition-all"
                 />
              </div>
           </div>

           {/* Documents List */}
           <div className="space-y-3">
              {loading ? (
                <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl">
                   <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Institutional Vault...</p>
                </div>
              ) : filteredDocs.length > 0 ? (
                filteredDocs.map(doc => (
                  <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md hover:border-indigo-200 transition-all">
                     <div className="w-14 h-14 rounded-xl bg-indigo-50/60 border border-indigo-100 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-indigo-600">
                        <FileText className="w-7 h-7" />
                     </div>

                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                           <h3 className="text-md font-bold text-slate-900 tracking-tight truncate">{doc.name}</h3>
                           <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0 ${getStatusColor(doc.status)}`}>
                              {getStatusIcon(doc.status)} {doc.status.replace('_', ' ')}
                           </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issuer:</span>
                              <span className="text-[11px] font-semibold text-slate-700">{doc.issuer}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expiry:</span>
                              <span className="text-[11px] font-bold text-slate-900">{doc.expiryDate}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Version:</span>
                              <span className="text-[11px] font-bold text-indigo-600">{doc.version}</span>
                           </div>
                           {doc.file_size && (
                             <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Size:</span>
                                <span className="text-[11px] font-medium text-slate-500">{doc.file_size}</span>
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="flex items-center gap-2 shrink-0 border-l border-slate-100 pl-6 h-10 self-center">
                        {doc.status !== 'ACTIVE' && (
                          <button 
                            onClick={() => {
                              setRenewingDoc(doc);
                              const nextYear = new Date().getFullYear() + 2;
                              setNewExpiryDate(`${nextYear}-12-31`);
                            }}
                            title="Trigger Certificate Renewal"
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[10px] uppercase rounded-xl transition-all border border-indigo-200/60 flex items-center gap-1 cursor-pointer"
                          >
                             <RefreshCw className="w-3 h-3" /> Renew
                          </button>
                        )}
                        <button 
                          onClick={() => handlePreview(doc)}
                          title="View Document Details"
                          className="p-2 bg-slate-50 hover:bg-white hover:shadow-xs text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                           <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownload(doc)}
                          title="Download File"
                          className="p-2 bg-slate-50 hover:bg-white hover:shadow-xs text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                           <Download className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 font-bold uppercase tracking-wider text-xs">
                   No compliance documents found in vault
                </div>
              )}
           </div>
        </div>

        {/* Info & Stats Sidebar */}
        <div className="xl:col-span-4 space-y-6 sticky top-32">
           <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Compliance Health</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Audit Score</span>
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                            {documents.some(d => d.status === 'EXPIRED') ? 'Moderate (85%)' : 'Optimal (100%)'}
                          </span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full bg-indigo-500 transition-all ${documents.some(d => d.status === 'EXPIRED') ? 'w-[85%]' : 'w-[100%]'}`} />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-xl font-bold text-white">{documents.length}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Certs Vault</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-xl font-bold text-rose-400">
                            {documents.filter(d => d.status !== 'ACTIVE').length}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Requires Renewal</p>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => onNavigate('/owner/institution-organization/audit-history')}
                   className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5 flex items-center justify-center gap-2 group cursor-pointer"
                 >
                    Audit History <History className="w-4 h-4" />
                 </button>
              </div>
              
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none">
                 <Lock className="w-48 h-48 rotate-12" />
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <AlertCircle className="w-4 h-4" />
                 </div>
                 <h4 className="text-sm font-bold text-slate-900 tracking-tight">Risk & Expiry Alerts</h4>
              </div>
              <div className="space-y-3">
                 {documents.filter(d => d.status !== 'ACTIVE').map(doc => (
                   <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${doc.status === 'EXPIRED' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        <div>
                           <p className="text-[11px] font-semibold text-slate-800 leading-tight mb-0.5">{doc.name}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expires: {doc.expiryDate}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setRenewingDoc(doc);
                          const nextYear = new Date().getFullYear() + 2;
                          setNewExpiryDate(`${nextYear}-12-31`);
                        }}
                        className="text-[9px] font-bold uppercase text-indigo-600 hover:text-indigo-800 bg-white px-2 py-1 rounded border border-slate-200 cursor-pointer"
                      >
                        Renew
                      </button>
                   </div>
                 ))}
                 {documents.every(d => d.status === 'ACTIVE') && (
                   <p className="text-xs text-slate-500 font-medium">All compliance certificates are active and valid.</p>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="text-lg font-black text-slate-900">Upload Compliance Document</h3>
                    <p className="text-xs text-slate-500 font-medium">Store statutory certificates in Supabase Storage & Database.</p>
                 </div>
                 <button onClick={() => setShowUploadModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                 {/* File Upload Drop Zone */}
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Document File * (PDF, DOCX, PNG, JPG)</label>
                    <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-indigo-500 bg-indigo-50/50' 
                          : selectedFile 
                            ? 'border-emerald-300 bg-emerald-50/40' 
                            : 'border-slate-200 hover:border-indigo-300 bg-slate-50'
                      }`}
                    >
                       <input 
                         ref={fileInputRef}
                         type="file" 
                         className="hidden" 
                         accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                         onChange={handleFileChange}
                       />
                       {selectedFile ? (
                         <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                            <div className="flex items-center gap-3">
                               <FileCheck2 className="w-6 h-6 text-emerald-600 shrink-0" />
                               <div className="text-left">
                                  <p className="text-xs font-bold text-slate-900 truncate max-w-[220px]">{selectedFile.name}</p>
                                  <p className="text-[10px] font-medium text-slate-400">{ComplianceDocumentService.formatFileSize(selectedFile.size)}</p>
                               </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                               <X className="w-4 h-4" />
                            </button>
                         </div>
                       ) : (
                         <div className="space-y-2">
                            <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
                            <p className="text-xs font-bold text-slate-700">Drag & drop document or <span className="text-indigo-600 underline">browse files</span></p>
                            <p className="text-[10px] text-slate-400">Max file size: 25MB • Secure encrypted cloud storage</p>
                         </div>
                       )}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Document Title *</label>
                    <input 
                      type="text" 
                      required
                      value={newDocForm.name}
                      onChange={e => setNewDocForm({...newDocForm, name: e.target.value})}
                      placeholder="e.g. Environmental Clearance NOC"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Document Type</label>
                       <select 
                         value={newDocForm.type}
                         onChange={e => setNewDocForm({...newDocForm, type: e.target.value as any})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                          <option value="LEGAL">LEGAL</option>
                          <option value="REGULATORY">REGULATORY</option>
                          <option value="COMPLIANCE">COMPLIANCE</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Expiry Date</label>
                       <input 
                         type="date" 
                         value={newDocForm.expiryDate}
                         onChange={e => setNewDocForm({...newDocForm, expiryDate: e.target.value})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Issuing Authority *</label>
                    <input 
                      type="text" 
                      required
                      value={newDocForm.issuer}
                      onChange={e => setNewDocForm({...newDocForm, issuer: e.target.value})}
                      placeholder="e.g. State Pollution Control Board"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>

                 <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={uploading}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                       {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                       {uploading ? 'Storing Document...' : 'Upload Document'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                       <FileText className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-base font-black text-slate-900">{previewDoc.name}</h3>
                       <p className="text-xs text-slate-500 font-medium">Issuer: {previewDoc.issuer}</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewDoc(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Type</p>
                    <p className="font-bold text-slate-800 mt-0.5">{previewDoc.type}</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version</p>
                    <p className="font-bold text-indigo-600 mt-0.5">{previewDoc.version}</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</p>
                    <p className="font-semibold text-slate-700 mt-0.5">{previewDoc.issueDate}</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry Date</p>
                    <p className="font-semibold text-slate-700 mt-0.5">{previewDoc.expiryDate}</p>
                 </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold">Cloud Storage Location</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{previewDoc.file_url || 'Supabase Storage Bucket: institution-documents'}</p>
                 </div>
                 <button 
                   onClick={() => handleDownload(previewDoc)}
                   className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                 >
                    <Download className="w-3.5 h-3.5" /> Download
                 </button>
              </div>

              <div className="flex justify-end pt-2">
                 <button 
                   onClick={() => setPreviewDoc(null)}
                   className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                 >
                    Close
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Renewal Modal */}
      {renewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="text-base font-black text-slate-900">Renew Certificate</h3>
                    <p className="text-xs text-slate-500 font-medium">{renewingDoc.name}</p>
                 </div>
                 <button onClick={() => setRenewingDoc(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">New Expiry Date *</label>
                    <input 
                      type="date" 
                      required
                      value={newExpiryDate}
                      onChange={e => setNewExpiryDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                 <button 
                   type="button" 
                   onClick={() => setRenewingDoc(null)}
                   className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                 >
                    Cancel
                 </button>
                 <button 
                   type="button"
                   onClick={handleConfirmRenew}
                   disabled={uploading || !newExpiryDate}
                   className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                 >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Confirm Renewal
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
