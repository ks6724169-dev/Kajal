import React, { useState } from 'react';
import { User, Upload, Edit, Download, X, Save, Printer, MapPin, Building, Phone, Mail } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    designation: 'Senior Mathematics Teacher',
    employeeId: 'EMP-2023-045',
    teacherId: 'TCH-9921',
    dob: '12 Oct 1988',
    gender: 'Female',
    bloodGroup: 'O+',
    mobile: '+1 (555) 123-4567',
    email: 'sarah.j@galaxy.edu',
    address: '123 Education Lane, Academic City',
    emergency: '+1 (555) 987-6543 (Husband)',
    department: 'Mathematics',
    joiningDate: '15 Aug 2018',
    subjects: 'Advanced Algebra, Calculus',
    classes: 'Grade 11, Grade 12',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add logic to save data
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100">
        <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative group cursor-pointer">
          <User className="w-12 h-12 text-indigo-400" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="text-center sm:text-left flex-1">
          {isEditing ? (
            <input 
              type="text" 
              name="name"
              value={profileData.name} 
              onChange={handleInputChange}
              className="text-2xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1 mb-2 w-full max-w-xs focus:ring-2 focus:ring-indigo-500" 
            />
          ) : (
            <h2 className="text-2xl font-bold text-slate-900">{profileData.name}</h2>
          )}
          
          {isEditing ? (
            <input 
              type="text" 
              name="designation"
              value={profileData.designation} 
              onChange={handleInputChange}
              className="text-slate-700 font-medium bg-white border border-slate-300 rounded-lg px-3 py-1 w-full max-w-xs text-sm focus:ring-2 focus:ring-indigo-500" 
            />
          ) : (
            <p className="text-slate-500 font-medium">{profileData.designation}</p>
          )}
          
          <div className="flex gap-2 mt-4 justify-center sm:justify-start">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Profile
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
                <button onClick={() => setShowIdCard(true)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-2">
                  <Download className="w-4 h-4" /> ID Card
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Personal Details</h3>
          <div className="space-y-4">
            {[
              { label: 'Employee ID', name: 'employeeId' },
              { label: 'Teacher ID', name: 'teacherId' },
              { label: 'Date of Birth', name: 'dob' },
              { label: 'Gender', name: 'gender' },
              { label: 'Blood Group', name: 'bloodGroup' }
            ].map(field => (
              <div key={field.name} className="grid grid-cols-3 text-sm items-center">
                <span className="text-slate-500">{field.label}</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    name={field.name}
                    value={profileData[field.name as keyof typeof profileData]}
                    onChange={handleInputChange}
                    className="col-span-2 bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="col-span-2 font-medium text-slate-900">{profileData[field.name as keyof typeof profileData]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Info</h3>
          <div className="space-y-4">
            {[
              { label: 'Mobile', name: 'mobile' },
              { label: 'Email', name: 'email' },
              { label: 'Address', name: 'address' },
              { label: 'Emergency', name: 'emergency' }
            ].map(field => (
              <div key={field.name} className="grid grid-cols-3 text-sm items-center">
                <span className="text-slate-500">{field.label}</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    name={field.name}
                    value={profileData[field.name as keyof typeof profileData]}
                    onChange={handleInputChange}
                    className="col-span-2 bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="col-span-2 font-medium text-slate-900">{profileData[field.name as keyof typeof profileData]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Professional Overview</h3>
          <div className="space-y-4">
            {[
              { label: 'Department', name: 'department' },
              { label: 'Joining Date', name: 'joiningDate' }
            ].map(field => (
               <div key={field.name} className="grid grid-cols-3 text-sm items-center">
                 <span className="text-slate-500">{field.label}</span>
                 {isEditing ? (
                   <input 
                     type="text" 
                     name={field.name}
                     value={profileData[field.name as keyof typeof profileData]}
                     onChange={handleInputChange}
                     className="col-span-2 bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                   />
                 ) : (
                   <span className="col-span-2 font-medium text-slate-900">{profileData[field.name as keyof typeof profileData]}</span>
                 )}
               </div>
            ))}
            <div className="grid grid-cols-3 text-sm items-center">
              <span className="text-slate-500">Employment Status</span>
              <span className="col-span-2 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block w-max">Active</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Teaching Assignments</h3>
          <div className="space-y-4">
            {[
              { label: 'Subjects', name: 'subjects' },
              { label: 'Classes', name: 'classes' }
            ].map(field => (
               <div key={field.name} className="grid grid-cols-3 text-sm items-center">
                 <span className="text-slate-500">{field.label}</span>
                 {isEditing ? (
                   <input 
                     type="text" 
                     name={field.name}
                     value={profileData[field.name as keyof typeof profileData]}
                     onChange={handleInputChange}
                     className="col-span-2 bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                   />
                 ) : (
                   <span className="col-span-2 font-medium text-slate-900">{profileData[field.name as keyof typeof profileData]}</span>
                 )}
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* ID Card Modal */}
      {showIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full relative animate-in zoom-in-95 duration-200">
            {/* Modal Header Actions */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                onClick={() => window.print()}
                className="p-2 bg-white/80 backdrop-blur-sm text-slate-700 rounded-full hover:bg-white shadow-sm transition"
                title="Print ID Card"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowIdCard(false)}
                className="p-2 bg-white/80 backdrop-blur-sm text-slate-700 rounded-full hover:bg-white hover:text-rose-600 shadow-sm transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ID Card Design */}
            <div id="printable-id-card" className="w-full bg-white relative pb-8">
              {/* Header Banner */}
              <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center px-6 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="flex items-center gap-3 z-10 mt-[-20px]">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <Building className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg leading-tight tracking-wide">GALAXY</h1>
                    <p className="text-indigo-100 text-[10px] font-medium tracking-widest uppercase">International School</p>
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              <div className="flex justify-center -mt-16 relative z-10 mb-4">
                <div className="w-28 h-28 bg-white rounded-full p-1.5 shadow-xl">
                  <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-50">
                    <User className="w-12 h-12 text-indigo-400" />
                  </div>
                </div>
              </div>

              {/* Employee Info */}
              <div className="text-center px-6 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{profileData.name}</h2>
                <p className="text-indigo-600 font-semibold text-sm mt-0.5">{profileData.designation}</p>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">{profileData.department}</p>
              </div>

              <div className="px-8 space-y-3 mb-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs text-slate-400 font-medium uppercase">Employee ID</span>
                  <span className="text-sm font-bold text-slate-800">{profileData.employeeId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs text-slate-400 font-medium uppercase">Blood Group</span>
                  <span className="text-sm font-bold text-slate-800 text-rose-600">{profileData.bloodGroup}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs text-slate-400 font-medium uppercase">Mobile</span>
                  <span className="text-sm font-bold text-slate-800">{profileData.mobile}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 mx-6 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                <MapPin className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  123 Education Lane, Academic City, NY 10001, USA
                </p>
              </div>
              
              <div className="text-center mt-6">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg" alt="Signature" className="h-8 mx-auto opacity-70" />
                 <div className="w-24 h-px bg-slate-300 mx-auto mt-1 mb-1"></div>
                 <p className="text-[10px] text-slate-400 font-medium">Authorized Signature</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
