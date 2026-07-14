import React, { useState } from 'react';
import { INITIAL_FEES } from '../data/mockData';
import { FeeRecord } from '../types';
import { 
  CreditCard, 
  QrCode, 
  DollarSign, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FeeManagement: React.FC = () => {
  const [fees, setFees] = useState<FeeRecord[]>(INITIAL_FEES);
  const [selectedFeeForUpi, setSelectedFeeForUpi] = useState<FeeRecord | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSimulateUpiPayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      if (selectedFeeForUpi) {
        setFees(fees.map(f => f.id === selectedFeeForUpi.id ? { ...f, status: 'Paid', paidDate: new Date().toISOString().split('T')[0], transactionRef: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}` } : f));
      }
    }, 1500);
  };

  const handleSendWhatsAppReminder = (fee: FeeRecord) => {
    alert(`Simulated WhatsApp Payment Reminder sent to parent of ${fee.studentName} for amount ₹${fee.amount.toLocaleString()}!`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fee Management & UPI Collection Gateway</h1>
          <p className="text-xs text-slate-500">Real-time fee ledgers, automated WhatsApp payment reminders, and instant UPI QR payments.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">Total Collected YTD: ₹1.42 Cr</span>
          </div>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Student & Grade</th>
                <th className="p-4">Category</th>
                <th className="p-4">Amount Due</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status / Ref</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {fees.map(fee => (
                <tr key={fee.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{fee.studentName}</div>
                    <div className="text-[11px] text-slate-500">{fee.grade}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{fee.category} Fee</td>
                  <td className="p-4 font-bold text-slate-900">₹{fee.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-600">{fee.dueDate}</td>
                  <td className="p-4">
                    {fee.status === 'Paid' ? (
                      <div>
                        <span className="px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] bg-emerald-100 text-emerald-700">Paid</span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{fee.transactionRef}</div>
                      </div>
                    ) : fee.status === 'Overdue' ? (
                      <span className="px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] bg-rose-100 text-rose-750">Overdue</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] bg-amber-100 text-amber-700">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {fee.status !== 'Paid' && (
                      <button
                        onClick={() => {
                          setSelectedFeeForUpi(fee);
                          setPaymentSuccess(false);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition inline-flex items-center space-x-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Pay via UPI</span>
                      </button>
                    )}
                    {fee.status !== 'Paid' && (
                      <button
                        onClick={() => handleSendWhatsAppReminder(fee)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold transition inline-flex items-center space-x-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPI QR Payment Modal */}
      {selectedFeeForUpi && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">UPI Instant Fee Collection</h3>
                <p className="text-[11px] text-indigo-200">Google Pay, PhonePe, Paytm & BHIM</p>
              </div>
              <button onClick={() => setSelectedFeeForUpi(null)} className="text-white/80 hover:text-white bg-white/10 p-1.5 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              {!paymentSuccess ? (
                <>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs text-slate-500 mb-1">{selectedFeeForUpi.studentName} ({selectedFeeForUpi.category})</div>
                    <div className="text-3xl font-black text-slate-900">₹{selectedFeeForUpi.amount.toLocaleString()}</div>
                  </div>

                  <div className="w-48 h-48 mx-auto bg-white border-2 border-indigo-100 rounded-2xl p-3 flex items-center justify-center shadow-inner relative">
                    <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center text-white p-2">
                      <QrCode className="w-16 h-16 text-indigo-400 mb-1" />
                      <span className="font-mono text-[10px]">upi://pay?pa=galaxyerp@sbi&am={selectedFeeForUpi.amount}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateUpiPayment}
                    disabled={paymentProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
                  >
                    {paymentProcessing ? (
                      <span>Processing UPI Gateway...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Simulate Successful UPI Payment</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="py-6 space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900">Payment Successful!</h4>
                  <p className="text-xs text-slate-500">Transaction ID: UPI/889412563214. Receipt generated & synced to ledger.</p>
                  <button
                    onClick={() => setSelectedFeeForUpi(null)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    Close & Return
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
