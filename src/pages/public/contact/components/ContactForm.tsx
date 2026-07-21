import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, RotateCcw, Building2, User, Mail, Phone, GraduationCap, MapPin, MessageSquare, Clock } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    ownerName: '',
    designation: '',
    email: '',
    mobile: '',
    studentStrength: '',
    board: '',
    state: '',
    city: '',
    message: '',
    preferredTime: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/v1/contact/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setFormData({
      schoolName: '', schoolCode: '', ownerName: '', designation: '',
      email: '', mobile: '', studentStrength: '', board: '',
      state: '', city: '', message: '', preferredTime: ''
    });
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 text-center space-y-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <Send className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-slate-900">Message Sent!</h3>
        <p className="text-slate-500 font-medium">Our product expert will contact you within 24 hours.</p>
        <button onClick={handleReset} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:scale-105 transition-transform">
          Send Another
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Enterprise Inquiry Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* School Details */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Institution Details</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" placeholder="School Name" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                  value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})}
                />
              </div>
              <div className="relative group">
                <input 
                  type="text" placeholder="School Code (Optional)"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                  value={formData.schoolCode} onChange={e => setFormData({...formData, schoolCode: e.target.value})}
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Personal Details</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" placeholder="Owner/Principal Name" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                  value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})}
                />
              </div>
              <select 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none appearance-none"
                value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})}
              >
                <option value="">Select Designation</option>
                <option value="Owner">School Owner</option>
                <option value="Director">Director</option>
                <option value="Principal">Principal</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" placeholder="Email Address" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="tel" placeholder="Mobile Number" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                  value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" placeholder="Student Strength"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                value={formData.studentStrength} onChange={e => setFormData({...formData, studentStrength: e.target.value})}
              />
            </div>
            <input 
              type="text" placeholder="Education Board"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={formData.board} onChange={e => setFormData({...formData, board: e.target.value})}
            />
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" placeholder="State"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
              />
            </div>
            <input 
              type="text" placeholder="City"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              <textarea 
                placeholder="How can we help you today?" rows={4}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Best Callback Time:</span>
              <input 
                type="time" 
                className="bg-transparent border-none outline-none font-black text-xs uppercase"
                value={formData.preferredTime} onChange={e => setFormData({...formData, preferredTime: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-4">
              <button 
                type="button" onClick={handleReset}
                className="flex items-center gap-2 px-6 py-4 text-slate-400 font-black text-sm uppercase hover:text-slate-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button 
                type="submit" disabled={status === 'loading'}
                className="flex items-center gap-3 px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
