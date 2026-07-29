const fs = require('fs');
let file = fs.readFileSync('src/pages/auth/RegisterSchoolPage.tsx', 'utf8');

// 1. Add imports
file = file.replace(
  "import { RegistrationCertificateModal } from \"../../components/auth/RegistrationCertificateModal\";",
  "import { RegistrationCertificateModal } from \"../../components/auth/RegistrationCertificateModal\";\nimport { Navigation } from '../public/landing/Navigation';\nimport { FooterSection } from '../public/landing/FooterSection';"
);

// 2. Replace return structure
const oldStart = `<div id="register-school-page" className="w-full min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans relative overflow-hidden selection:bg-indigo-600 selection:text-white">`;

const newStart = `<div id="register-school-page" className="w-full min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden selection:bg-indigo-600 selection:text-white">
      <Navigation onNavigate={navigate} />`;

file = file.replace(oldStart, newStart);

// 3. Replace Left Panel start
const oldLeftPanel = `{/* LEFT PANEL - 40% Width */}
      <div className="hidden lg:flex flex-col lg:w-[40%] bg-gradient-to-br from-indigo-50/40 via-slate-50/60 to-purple-50/20 border-r border-slate-200/60 p-12 overflow-y-auto h-screen justify-between relative z-10">`;

const newLeftPanel = `<main className="flex-1 w-full max-w-7xl mx-auto pt-32 pb-16 px-4 md:px-8 z-10 flex">
        <div className="w-full flex flex-col lg:flex-row bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden border border-slate-200/60 min-h-[800px]">
      {/* LEFT PANEL - 40% Width */}
      <div className="hidden lg:flex flex-col lg:w-[40%] bg-gradient-to-br from-indigo-50/40 via-slate-50/60 to-purple-50/20 border-r border-slate-200/60 p-10 justify-between relative">`;

file = file.replace(oldLeftPanel, newLeftPanel);

// 4. Remove Brand Header from Left Panel (lines 661-676)
const brandHeaderRegex = /\{\/\* Brand Header \*\/\}[\s\S]*?<div className="pt-8 space-y-3">/;
file = file.replace(brandHeaderRegex, `<div className="pt-2 space-y-3">`);

// 5. Replace Right Panel start
const oldRightPanel = `{/* RIGHT PANEL - 60% Width */}
      <div className="w-full lg:w-[60%] flex flex-col justify-between min-h-screen bg-white relative overflow-y-auto z-10">`;
const newRightPanel = `{/* RIGHT PANEL - 60% Width */}
      <div className="w-full lg:w-[60%] flex flex-col justify-between bg-white relative overflow-y-auto">`;
file = file.replace(oldRightPanel, newRightPanel);

// 6. Remove mobile brand header from TOP STATUS BAR
const topStatusBarRegex = /\{\/\* TOP STATUS BAR \*\/\}[\s\S]*?\{\/\* Save Draft Indicator \*\/\}/;
file = file.replace(topStatusBarRegex, `{/* TOP STATUS BAR */}
        <div className="px-6 py-4 md:px-10 border-b border-slate-100 flex items-center justify-end bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          {/* Save Draft Indicator */}`);

// 7. Replace bottom of file
const oldBottom = `      </div>
    </div>
  );
};`;
const newBottom = `      </div>
        </div>
      </main>
      <FooterSection onNavigate={navigate} />
    </div>
  );
};`;
file = file.replace(oldBottom, newBottom);

fs.writeFileSync('src/pages/auth/RegisterSchoolPage.tsx', file);
