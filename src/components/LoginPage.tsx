import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ChevronDown,
  ShieldCheck,
  Cloud,
  Smartphone,
  Headphones,
  ArrowRight,
  Shield
} from 'lucide-react';
import { Role } from '../types';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (role: Role) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  const roles = [
    { id: 'super_admin', label: 'School / College Owner' },
    { id: 'principal', label: 'Principal' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'student', label: 'Student' },
    { id: 'parent', label: 'Parent' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Please select a role to login.');
      return;
    }
    
    // Default to super_admin if mapped role isn't perfectly matched, but we use the id
    const roleId = roles.find(r => r.label === selectedRole)?.id as Role || 'student';
    onLoginSuccess(roleId);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center py-8 px-4 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-purple-200 rotate-45 opacity-50"></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-blue-200 rotate-45 opacity-50"></div>

      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 font-medium text-sm hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Logo Area */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="flex items-center space-x-2 text-indigo-900 mb-1">
          <div className="w-8 h-8 relative flex items-center justify-center">
            {/* Custom Logo Graphic mimicking the image */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-indigo-700">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
              <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              <path d="M22 12h-4" />
              <path d="M6 12H2" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M19.07 4.93l-2.83 2.83" />
              <path d="M7.76 16.24l-2.83 2.83" />
              <path d="M19.07 19.07l-2.83-2.83" />
              <path d="M7.76 7.76L4.93 4.93" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-wider text-[#1e1b4b]">GALAXY</span>
        </div>
        <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">
          Lending School & College ERP
        </span>
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 w-full max-w-[420px] p-8 mb-12 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back!</h1>
          <p className="text-sm text-slate-500">
            Login to your <span className="font-bold text-slate-800">GALAXY</span> ERP account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* School Unique ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Enter School Unique ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Building className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Enter School Unique ID"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Gmail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                placeholder="Enter your Gmail"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Role Select */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-700">Select Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => setShowRoleSelect(true)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <span className={selectedRole ? 'text-slate-900' : 'text-slate-400'}>
                  {selectedRole || 'Select Role'}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-xs font-medium text-slate-600">Remember Me</span>
            </label>
            <a href="#" className="text-xs font-bold text-indigo-700 hover:text-indigo-800">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-200"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2">
            <div className="w-full bg-emerald-50 text-emerald-600 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure • Reliable • Efficient</span>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Info Boxes */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="bg-white p-5 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Secure & Safe</h4>
            <p className="text-xs text-slate-500 mt-0.5">Your data is 100% secure with us.</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Cloud className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Cloud Based</h4>
            <p className="text-xs text-slate-500 mt-0.5">Access anytime, anywhere.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Multi Device</h4>
            <p className="text-xs text-slate-500 mt-0.5">Works smoothly on all devices.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">24/7 Support</h4>
            <p className="text-xs text-slate-500 mt-0.5">We are always here to help you.</p>
          </div>
        </div>
      </div>

      <footer className="text-[10px] font-semibold text-slate-400 pb-6">
        © 2026 GALAXY ERP. All rights reserved.
      </footer>

      {/* Mobile-Style Bottom Sheet for Roles */}
      {showRoleSelect && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center">
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-medium text-slate-400">Select Role</h3>
              <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
            </div>
            
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.label);
                    setShowRoleSelect(false);
                  }}
                  className="w-full flex items-center justify-between py-5 border-b border-slate-100 hover:bg-slate-50 transition px-4 rounded-xl"
                >
                  <span className="text-lg text-slate-900">{role.label}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedRole === role.label ? 'border-indigo-600' : 'border-slate-800'}`}>
                    {selectedRole === role.label && <div className="w-3 h-3 rounded-full bg-indigo-600"></div>}
                  </div>
                </button>
              ))}
            </div>

            {/* Click outside dismiss overlay */}
            <div 
              className="absolute inset-0 -z-10 h-[200vh] -top-[100vh] w-[200vw] -left-[50vw]"
              onClick={() => setShowRoleSelect(false)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};
