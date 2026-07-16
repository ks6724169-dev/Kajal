import React, { useState } from 'react';
import { INITIAL_BOOKS } from '../../constants/mockData';
import { LibraryBook } from '../../types';
import { BookOpen, CheckCircle2, BookmarkPlus } from 'lucide-react';

export const InventoryLibraryHostel: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_BOOKS);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Library Catalog, Hostel & Inventory Management</h1>
        <p className="text-xs text-slate-500">Track book borrowings, digital ISBN barcode scanning, hostel room allocations, and campus inventory stock.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Library Book Catalog & Circulation</h2>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
            {books.reduce((acc, b) => acc + b.totalCopies, 0)} Total Volumes
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Book Title & Author</th>
                <th className="p-4">Category</th>
                <th className="p-4">ISBN</th>
                <th className="p-4">Available Copies</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {books.map(book => (
                <tr key={book.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{book.title}</div>
                    <div className="text-[11px] text-slate-500">{book.author}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{book.category}</td>
                  <td className="p-4 font-mono text-slate-500">{book.isbn}</td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {book.availableCopies} / {book.totalCopies} Available
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Issued book '${book.title}' successfully.`)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg font-semibold transition"
                    >
                      Issue Book
                    </button>
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
