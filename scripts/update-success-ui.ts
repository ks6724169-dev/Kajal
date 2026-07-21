import fs from 'fs';

let content = fs.readFileSync('src/pages/auth/RegisterSchoolPage.tsx', 'utf8');

const targetSuccessStart = '                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-emerald-600">';
const targetSuccessEnd = '                    </button>';

const replacement = `                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-emerald-600">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Registration Complete</span>
                    <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                      Your School is Successfully Registered 🎉
                    </h2>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Save your School Unique ID. It will be required to identify your institution during login.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl text-left overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">School Unique ID</span>
                        <div className="text-xl font-mono font-bold text-indigo-700">{finalSchoolUniqueId}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(finalSchoolUniqueId);
                            alert("School ID copied!");
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          Copy School ID
                        </button>
                        <button className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5">
                          Download Certificate
                        </button>
                      </div>
                    </div>
                    <div className="p-5 space-y-3.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">School Name:</span>
                        <strong className="text-slate-900">{formData.schoolName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Board / Type:</span>
                        <strong className="text-slate-900">{formData.boardType} / {formData.schoolType}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Owner/Admin Email:</span>
                        <strong className="text-indigo-600">{formData.adminEmail}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Verified Mobile:</span>
                        <strong className="text-slate-900">{formData.adminPhone}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Registration Status:</span>
                        <strong className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Pending Verification</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      id="reg-success-proceed-btn"
                      onClick={() => navigate('/auth/login')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                    >`;

const startIndex = content.indexOf(targetSuccessStart);
const endIndex = content.indexOf(targetSuccessEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex + targetSuccessEnd.length);
  const newContent = before + replacement + "\n                    </button>" + after;
  fs.writeFileSync('src/pages/auth/RegisterSchoolPage.tsx', newContent);
  console.log("Replaced success UI successfully.");
} else {
  console.log("Could not find start or end index.");
}
