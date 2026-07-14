import React, { useState } from 'react';
import { FileSignature, Upload, Trash2, Download, RefreshCcw, Maximize2, Save, CheckCircle, Clock } from 'lucide-react';

export const DigitalSignatureView: React.FC = () => {
  const [signatureUrl, setSignatureUrl] = useState<string>(
    'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg'
  );
  const [signatureScale, setSignatureScale] = useState<number>(100); // percentage
  const [lastUpdated, setLastUpdated] = useState<string>('July 11, 2026');
  
  const [history, setHistory] = useState([
    { id: 1, name: 'signature_v3.svg', date: 'June 15, 2025', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg' },
    { id: 2, name: 'signature_v2.png', date: 'Jan 10, 2024', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg' },
    { id: 3, name: 'signature_v1.jpg', date: 'Oct 12, 2023', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg' }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const newUrl = uploadEvent.target.result as string;
          setSignatureUrl(newUrl);
          setLastUpdated(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
          
          // Add to history
          setHistory([
            { id: Date.now(), name: file.name, date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), url: newUrl },
            ...history
          ]);
          alert('Signature uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove your digital signature?')) {
      setSignatureUrl('');
      alert('Signature removed.');
    }
  };

  const handleReset = () => {
    setSignatureUrl('https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg');
    setSignatureScale(100);
    alert('Signature reset to default.');
  };

  const handleSave = () => {
    alert('Digital signature preferences and settings saved securely!');
  };

  const handleDownload = () => {
    if (!signatureUrl) {
      alert('No signature to download.');
      return;
    }
    const a = document.createElement('a');
    a.href = signatureUrl;
    a.download = 'digital_signature.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Top Banner & Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-indigo-600" />
            Digital Signature Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">Upload, preview, resize, and manage your verified digital sign for official documents.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleReset}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 md:flex-none px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* Active Signature Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Active Signature Preview
          </h3>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Verified Active
          </span>
        </div>
        
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50 relative group min-h-[220px]">
          {signatureUrl ? (
            <div className="flex flex-col items-center gap-4">
              <img 
                src={signatureUrl} 
                alt="Digital Signature" 
                style={{ transform: `scale(${signatureScale / 100})`, transition: 'transform 0.1s ease-out' }}
                className="max-h-32 object-contain"
              />
              <span className="text-xs text-slate-400 font-mono">Scale: {signatureScale}%</span>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Upload className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-medium text-slate-600">No signature uploaded</p>
              <p className="text-xs text-slate-400">Upload PNG, JPG, or SVG</p>
            </div>
          )}

          {/* Hover Action Bar */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl gap-3">
             <label className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm cursor-pointer">
               <Upload className="w-4 h-4" /> Replace / Upload
               <input type="file" accept=".png, .jpg, .jpeg, .svg" onChange={handleFileUpload} className="hidden" />
             </label>
             {signatureUrl && (
               <>
                 <button 
                   onClick={handleDownload}
                   className="px-4 py-2 bg-white text-indigo-600 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm"
                 >
                   <Download className="w-4 h-4" /> Download
                 </button>
                 <button 
                   onClick={handleRemove}
                   className="px-4 py-2 bg-white text-rose-600 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-rose-50 transition flex items-center gap-2 shadow-sm"
                 >
                   <Trash2 className="w-4 h-4" /> Remove
                 </button>
               </>
             )}
          </div>
        </div>

        {/* Resize Slider */}
        {signatureUrl && (
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-indigo-600" /> Resize Signature</span>
              <span>{signatureScale}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={signatureScale} 
              onChange={(e) => setSignatureScale(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
           <div>
             <p className="font-semibold text-slate-700">Supported formats: PNG, JPG, SVG (Max 5MB)</p>
             <p className="mt-0.5">Last updated: {lastUpdated}</p>
           </div>
           {!signatureUrl && (
             <label className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm cursor-pointer">
               <Upload className="w-3.5 h-3.5" /> Upload Now
               <input type="file" accept=".png, .jpg, .jpeg, .svg" onChange={handleFileUpload} className="hidden" />
             </label>
           )}
        </div>
      </div>
      
      {/* Signature History */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" /> Signature History & Archives
        </h3>
        <div className="space-y-3">
          {history.map((item) => (
             <div key={item.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                   <FileSignature className="w-6 h-6 text-indigo-600" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                   <p className="text-xs text-slate-500">Archived on {item.date}</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <button 
                   onClick={() => { setSignatureUrl(item.url); alert(`Restored ${item.name} as active signature.`); }}
                   className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl text-xs font-semibold transition"
                 >
                   Restore
                 </button>
                 <button 
                   onClick={() => {
                     const a = document.createElement('a');
                     a.href = item.url;
                     a.download = item.name;
                     document.body.appendChild(a);
                     a.click();
                     document.body.removeChild(a);
                   }}
                   className="p-2 text-slate-400 hover:text-indigo-600 transition"
                   title="Download"
                 >
                   <Download className="w-4 h-4" />
                 </button>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
