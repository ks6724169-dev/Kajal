import fs from 'fs';
let c = fs.readFileSync('src/pages/auth/RegisterSchoolPage.tsx', 'utf8');
c = c.replace(
  '<button className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5">\n                          Download Certificate\n                        </button>',
  `<button onClick={() => setIsCertificateModalOpen(true)} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5">
                          View Registration Certificate
                        </button>`
);
fs.writeFileSync('src/pages/auth/RegisterSchoolPage.tsx', c);
