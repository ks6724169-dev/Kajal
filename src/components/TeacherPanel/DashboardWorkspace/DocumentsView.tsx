import React from 'react';
import { FileText, Download, Eye, File, Folder } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const documents = [
    { id: 1, name: 'Employee Contract 2023.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 15, 2023', category: 'Official' },
    { id: 2, name: 'ID Proof (Passport).jpg', type: 'Image', size: '1.1 MB', date: 'Sep 02, 2023', category: 'Personal' },
    { id: 3, name: 'Math Syllabus 2023-24.docx', type: 'Word', size: '540 KB', date: 'Aug 20, 2023', category: 'Academic' },
    { id: 4, name: 'Tax Declaration Form.pdf', type: 'PDF', size: '1.8 MB', date: 'Jan 10, 2023', category: 'Finance' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {['All Documents', 'Official', 'Personal', 'Academic'].map(folder => (
          <div key={folder} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:shadow-md transition">
            <Folder className="w-12 h-12 text-indigo-200 mb-3" />
            <h4 className="text-sm font-bold text-slate-700">{folder}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Name</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded On</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        {doc.type === 'PDF' ? <FileText className="w-5 h-5" /> : <File className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{doc.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-600">{doc.size}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-slate-500">{doc.date}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition" title="View">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 transition" title="Download">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
