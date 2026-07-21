import fs from 'fs';
let c = fs.readFileSync('src/pages/auth/RegisterSchoolPage.tsx', 'utf8');
c = c.replace('className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"\n                    >\n                    </button>', 'className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"\n                    >\n                      Continue to Secure Login <ArrowRight className="w-4 h-4 ml-1" />\n                    </button>');
fs.writeFileSync('src/pages/auth/RegisterSchoolPage.tsx', c);
