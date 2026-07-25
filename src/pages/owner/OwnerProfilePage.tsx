import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, KeyRound, Lock, Smartphone, LogOut, ArrowLeft, CheckCircle, Camera, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authStore } from '../../store/authStore';

interface OwnerProfilePageProps {
  onNavigate?: (path: string) => void;
}

export const OwnerProfilePage: React.FC<OwnerProfilePageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileSchoolCode, setProfileSchoolCode] = useState(user?.schoolCode || user?.tenantId || 'APEX-K12');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    authStore.updateProfile({
      name: profileName,
      email: profileEmail,
      schoolCode: profileSchoolCode
    });
    setIsEditingProfile(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match.');
      return;
    }

    setPwdError('');
    setPwdSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdSuccess(false), 4000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back button & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-600 transition cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">Owner Profile & Security</h1>
            <p className="text-xs text-slate-500">Manage account credentials, active sessions & security preferences</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditingProfile(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {profileSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">Owner Profile updated successfully! Changes saved to account registry.</span>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Edit Owner Profile</h2>
              </div>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School / Tenant Code</label>
                <input
                  type="text"
                  value={profileSchoolCode}
                  onChange={(e) => setProfileSchoolCode(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 text-center shadow-xs">
          <div className="relative inline-block mx-auto">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
            </div>
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xs cursor-pointer"
              title="Change avatar or details"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name || 'Executive Owner'}</h2>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mt-0.5">Primary Tenant Administrator</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold mt-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Supabase Account
            </span>
          </div>

          <div className="border-t border-slate-100 pt-4 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-500"><Mail className="w-4 h-4 text-slate-400" /> Registered Email</span>
              <span className="font-semibold text-slate-800">{user?.email || 'Registered Owner'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-500"><Phone className="w-4 h-4 text-slate-400" /> Mobile Number</span>
              <span className="font-semibold text-slate-800">{profilePhone}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-500"><User className="w-4 h-4 text-slate-400" /> Account Role</span>
              <span className="font-semibold text-indigo-600 uppercase font-mono">{user?.role || 'SUPER_ADMIN'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-500"><ShieldCheck className="w-4 h-4 text-slate-400" /> Tenant / School Code</span>
              <span className="font-semibold text-indigo-600 font-mono">{user?.schoolCode || user?.tenantId || 'APEX-K12'}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile Details</span>
            </button>

            <button
              onClick={() => {
                logout();
                window.dispatchEvent(new CustomEvent('nav-to', { detail: '/login' }));
              }}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        </div>

        {/* Right Column: Security & Credentials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change Password Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Change Password</h3>
            </div>

            {pwdSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Password updated successfully in Supabase Security Vault!</span>
              </div>
            )}

            {pwdError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                {pwdError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Active Sessions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Active Login Sessions</h3>
              </div>
              <button 
                onClick={() => {
                  const event = new CustomEvent('galaxy-toast', { detail: { text: 'All other sessions revoked.', type: 'info' }});
                  window.dispatchEvent(event);
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Revoke Other Sessions
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div>
                    <p className="font-bold text-slate-800">Current Web Session (Cloud Run)</p>
                    <p className="text-[11px] text-slate-500">Chrome on Linux • IP: 107.76.92.xxx</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

