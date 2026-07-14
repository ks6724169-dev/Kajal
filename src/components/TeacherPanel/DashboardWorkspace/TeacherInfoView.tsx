import React, { useState } from 'react';
import { Briefcase, MapPin, Building, Clock, Users, Award, BookOpen, Edit2, Trash2, Plus, Save, Printer, Download, User, Check, X } from 'lucide-react';

export const TeacherInfoView: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Sarah Johnson',
    email: 'sarah.j@galaxy.edu',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '12 Oct 1988',
    gender: 'Female',
    address: '123 Education Lane, Academic City'
  });

  const [profInfo, setProfInfo] = useState({
    branch: 'Main Campus',
    campus: 'North Wing',
    reportingManager: 'Dr. Robert Chen',
    shift: 'Morning (08:00 AM - 02:00 PM)',
    employeeType: 'Full-Time',
    jobRole: 'Subject Matter Expert'
  });

  const [experience, setExperience] = useState(
    'Over 8 years of experience in teaching advanced mathematics to high school students. Specializes in calculus and competitive exam preparation. Proven track record of improving average class scores by 15% year-over-year.'
  );

  const [skills, setSkills] = useState(['Curriculum Design', 'Student Counseling', 'Data Analysis', 'EdTech Integration']);
  const [newSkill, setNewSkill] = useState('');

  const [languages, setLanguages] = useState(['English (Fluent)', 'Spanish (Intermediate)', 'French (Basic)']);
  const [newLanguage, setNewLanguage] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    alert('Teacher information saved successfully!');
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleDeleteLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Action Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Teacher Information & Records</h2>
          <p className="text-xs text-slate-500">Manage comprehensive personal, professional, and skills credentials</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Record
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Personal Information
            </h3>
            <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">Verified</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Full Name</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={personalInfo.fullName} 
                  onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-slate-900">{personalInfo.fullName}</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Email Address</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={personalInfo.email} 
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-slate-900">{personalInfo.email}</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Phone Number</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={personalInfo.phone} 
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-slate-900">{personalInfo.phone}</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Date of Birth</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={personalInfo.dateOfBirth} 
                  onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-slate-900">{personalInfo.dateOfBirth}</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Gender</span>
              <span className="text-sm font-medium text-slate-900">{personalInfo.gender}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">Address</span>
              <span className="text-sm font-medium text-slate-900 text-right">{personalInfo.address}</span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Professional Information
            </h3>
            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg">Active Staff</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Branch</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profInfo.branch} 
                  onChange={(e) => setProfInfo({...profInfo, branch: e.target.value})}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-slate-900">{profInfo.branch}</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Campus</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profInfo.campus} 
                  onChange={(e) => setProfInfo({...profInfo, campus: e.target.value})}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-slate-900">{profInfo.campus}</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Reporting Manager</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profInfo.reportingManager} 
                  onChange={(e) => setProfInfo({...profInfo, reportingManager: e.target.value})}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-slate-900">{profInfo.reportingManager}</span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Shift</span>
              <span className="text-sm font-medium text-slate-900">{profInfo.shift}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Employee Type</span>
              <span className="text-sm font-medium text-slate-900">{profInfo.employeeType}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">Job Role</span>
              <span className="text-sm font-medium text-slate-900">{profInfo.jobRole}</span>
            </div>
          </div>
        </div>

        {/* Experience Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Experience Summary
            </h3>
          </div>
          {isEditing ? (
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
          ) : (
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {experience}
            </p>
          )}
        </div>

        {/* Skills & Languages Known */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Skills & Languages
            </h3>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills</span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
                  <span>{skill}</span>
                  {isEditing && (
                    <button onClick={() => handleDeleteSkill(idx)} className="text-indigo-400 hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <input 
                  type="text" 
                  placeholder="Add new skill..." 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                />
                <button onClick={handleAddSkill} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Add</button>
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Languages Known</span>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200">
                  <span>{lang}</span>
                  {isEditing && (
                    <button onClick={() => handleDeleteLanguage(idx)} className="text-slate-400 hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <input 
                  type="text" 
                  placeholder="Add new language..." 
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                />
                <button onClick={handleAddLanguage} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Add</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

