import React from 'react';
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

interface Office {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  type: string;
}

export const ContactOffices: React.FC<{ offices: Office[] }> = ({ offices }) => {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Our Presence</h2>
        <p className="text-lg text-slate-500 font-medium">Strategic locations to serve institutions across the globe.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offices.map((office) => (
          <motion.div 
            key={office.id}
            whileHover={{ y: -5 }}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-8">
              <MapPin className="w-8 h-8" />
            </div>
            
            <div className="mb-8">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                {office.type}
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{office.name}</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
                <p className="text-sm font-bold text-slate-600 leading-relaxed">{office.location}</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                <p className="text-sm font-bold text-slate-600">{office.phone}</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                <p className="text-sm font-bold text-slate-600">{office.email}</p>
              </div>
            </div>

            <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" /> Get Directions
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const SupportTicket: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="p-8 md:p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Need Technical Help?</h2>
          <p className="text-slate-500 font-medium">Raise a support ticket for faster resolution.</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors"
        >
          {isOpen ? 'Close Form' : 'New Ticket'}
        </button>
      </div>

      {isOpen && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6 pt-6 border-t border-slate-50"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
              <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Technical Issue</option>
                <option>Billing Inquiry</option>
                <option>Training Request</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
              <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical (Urgent)</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Description</label>
            <textarea 
              rows={4} placeholder="Describe the issue in detail..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>
          <div className="flex items-center justify-between gap-6">
             <button type="button" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                Attach Screenshots (Max 5MB)
             </button>
             <button className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                Submit Ticket
             </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};
