import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, CheckCircle2, AlertTriangle, ArrowRight, Loader2, 
  ShieldCheck, RefreshCw, Calendar, Users, Award, ChevronRight, 
  FileText, Download, Building, Check, ArrowLeft, Sparkles, Laptop, Smartphone, HelpCircle,
  Receipt, Printer
} from 'lucide-react';
import { RegistrationCertificateModal } from '../../components/auth/RegistrationCertificateModal';

interface SchoolPaymentCheckoutPageProps {
  registrationId: string;
  navigate: (path: string) => void;
}

export function SchoolPaymentCheckoutPage({ registrationId, navigate }: SchoolPaymentCheckoutPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  
  // Payment state
  const [paymentMode, setPaymentMode] = useState<'test' | 'live'>('test');
  const [checkoutStep, setCheckoutStep] = useState<'init' | 'processing' | 'verifying' | 'success' | 'failed'>('init');
  const [processingMessage, setProcessingMessage] = useState('Initiating cryptographic gateway handshake...');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  
  // Success details from backend
  const [activatedDetails, setActivatedDetails] = useState<any>(null);

  // Document Modal state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalTab, setDocModalTab] = useState<'certificate' | 'receipt'>('certificate');

  // Load Registration Details & Prepare Payment on mount
  useEffect(() => {
    let active = true;
    
    async function initCheckout() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch draft registration details
        const regRes = await fetch(`/api/v1/school-registration/${registrationId}`);
        if (!regRes.ok) {
          throw new Error('Could not find school registration draft.');
        }
        const regData = await regRes.json();
        if (!regData.success || !regData.data) {
          throw new Error(regData.message || 'Failed to parse registration details.');
        }
        
        const draft = regData.data;
        // Verify payment status strictly before auto-passing to success
        if (draft.status === 'COMPLETED' && draft.payment_status === 'PAID' && draft.school_unique_id) {
          setRegistration(draft);
          setActivatedDetails({
            schoolUniqueId: draft.school_unique_id,
            tenantId: draft.tenant_id
          });
          setCheckoutStep('success');
          setLoading(false);
          return;
        }

        if (!active) return;
        setRegistration(draft);

        // 2. Prepare checkout order on server
        const prepRes = await fetch('/api/v1/school-registration/prepare-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationId,
            planId: draft.selected_plan || 'silver',
            studentCapacity: draft.student_capacity || 100,
            billingCycle: draft.billing_cycle || 'annual'
          })
        });

        const prepData = await prepRes.json();
        if (!prepRes.ok || !prepData.success) {
          // Handle configuration pending warning
          if (prepData.message && (prepData.message.includes('CONFIG_PENDING') || prepData.message.includes('CONFIG_MISSING'))) {
            throw new Error('RAZORPAY_CONFIG_PENDING');
          }
          throw new Error(prepData.message || 'Handshake failed with payment controller.');
        }

        if (!active) return;
        setOrderData(prepData);
        setPaymentMode(prepData.pricing?.paymentMode || 'test');
      } catch (err: any) {
        if (active) {
          if (err.message === 'RAZORPAY_CONFIG_PENDING') {
            setError('LIVE_CONFIG_PENDING');
          } else {
            setError(err.message || 'An error occurred during payment setup.');
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initCheckout();
    return () => {
      active = false;
    };
  }, [registrationId]);

  // Razorpay Dynamic Integration Loader
  const handleProceedPayment = (preferredMethod?: string) => {
    if (!orderData) return;
    
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      const razorpayKey = orderData.pricing?.keyId || orderData.keyId || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
      const options: any = {
        key: razorpayKey, // Public Key Id from backend or environment
        amount: Math.round((orderData.pricing?.requiredInitialPayment || orderData.amount || 0) * 100), // in paise
        currency: orderData.currency || 'INR',
        name: 'GALAXY ERP',
        description: `${registration?.selected_plan?.toUpperCase()} Subscription Deposit`,
        image: '/logo.png', // Optional
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setCheckoutStep('verifying');
          setProcessingMessage('Verifying payment signature with GALAXY security node...');
          
          // Trigger backend verification
          await handleBackendVerify({
            orderId: orderData.orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            paymentMethod: 'razorpay'
          });
        },
        prefill: {
          name: registration?.owner_name || '',
          email: registration?.owner_email || '',
          contact: registration?.owner_mobile || ''
        },
        notes: {
          registration_id: registrationId,
          school_name: registration?.school_name
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: function() {
            setCheckoutStep('init');
          }
        }
      };

      if (preferredMethod) {
        options.prefill.method = preferredMethod;
      }
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment Failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setCheckoutStep('failed');
      });
      rzp.open();
    };

    script.onerror = () => {
      setError('Failed to load Razorpay Gateway script. Please check your internet connection.');
    };

    document.body.appendChild(script);
  };

  // Common Verify call to Backend controller
  const handleBackendVerify = async (payload: { orderId: string; paymentId: string; signature: string; paymentMethod: string; transactionReference?: string }) => {
    try {
      const response = await fetch('/api/v1/school-registration/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId,
          orderId: payload.orderId,
          paymentId: payload.paymentId,
          signature: payload.signature,
          paymentMethod: payload.paymentMethod,
          transactionReference: payload.transactionReference,
          password: registration?.metadata?.admin_password || 'Admin@123' // administrative password fallback
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Signature verification rejected by GALAXY security engine.');
      }

      setActivatedDetails(data);
      setCheckoutStep('success');
    } catch (err: any) {
      setError(err.message || 'Activation handshake failed.');
      setCheckoutStep('failed');
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await fetch(`/api/v1/school-registration/${registrationId}/certificate`);
      const data = await response.json();
      if (data.success) {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `galaxy_registration_certificate_${activatedDetails?.schoolUniqueId || 'school'}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (e) {
      console.error('Failed to download certificate json', e);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(`/api/v1/school-registration/${registrationId}/receipt`);
      const data = await response.json();
      if (data.success) {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `galaxy_payment_receipt_${registrationId.substring(0, 8)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (e) {
      console.error('Failed to download receipt json', e);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Negotiating cryptographic gateway handshake...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 font-sans relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Background visual graphics */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[150px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-100/40 blur-[150px]"></div>
      
      <div className="max-w-5xl mx-auto z-10 relative space-y-8">
        
        {/* Top Header GALAXY Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-display font-extrabold text-xl shadow-lg shadow-indigo-600/20">
              G
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-slate-900">
                GALAXY <span className="text-indigo-600 font-medium">ERP</span>
              </span>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Educational Operating System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-full border ${
              paymentMode === 'live' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              {paymentMode === 'live' ? 'Live Razorpay Node' : 'Sandbox Gateway'}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STATE: LIVE CONFIG PENDING VIEW */}
          {error === 'LIVE_CONFIG_PENDING' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl shadow-indigo-900/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Live Gateway Setup Incomplete</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The application gateway mode is configured as <strong>LIVE Mode</strong>, but the required environment API variables (<code>PAYMENT_GATEWAY_KEY_ID</code>) are missing from the server environment parameters.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
                <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Troubleshooting steps:</h5>
                <p className="text-[10px] text-slate-500 leading-normal">
                  1. Set <code>PAYMENT_MODE=test</code> in your <code>.env</code> file for sandbox testing.
                </p>
                <p className="text-[10px] text-slate-500 leading-normal">
                  2. Or provide valid Razorpay keys in environment variables to run live gateway transactions.
                </p>
              </div>
              <button 
                onClick={() => navigate('/register')} 
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Return to Review Screen
              </button>
            </motion.div>
          )}

          {/* STATE: GENERAL ERROR VIEW */}
          {error && error !== 'LIVE_CONFIG_PENDING' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Payment Process Suspended</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {error}
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/15"
              >
                <RefreshCw className="w-4 h-4" /> Restart Handshake
              </button>
            </motion.div>
          )}

          {/* STATE: MAIN CHECKOUT INTERFACE */}
          {!error && checkoutStep === 'init' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* LEFT COLUMN: Premium High-Contrast Invoice Ledger */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6.5 space-y-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>
                  
                  {/* Title & Organization Info */}
                  <div className="border-b border-slate-100 pb-5 space-y-1 text-left">
                    <span className="text-[10px] text-indigo-600 font-extrabold tracking-widest uppercase">Invoice Breakdown</span>
                    <h2 className="text-xl font-display font-extrabold tracking-tight text-slate-900 leading-snug">{registration?.school_name}</h2>
                    <p className="text-xs text-slate-500 font-medium">Board: {registration?.board} • City: {registration?.city}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">Reg ID: {registrationId.substring(0, 18)}...</p>
                  </div>

                  {/* Pricing configuration details cards */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Active SLA Tier</span>
                      <p className="text-xs font-extrabold text-indigo-600 uppercase tracking-tight">{registration?.selected_plan} License</p>
                    </div>
                    <div className="space-y-0.5 text-left border-l border-slate-200 pl-4">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Student Volume</span>
                      <p className="text-xs font-extrabold text-indigo-600">{registration?.student_capacity} Capacity</p>
                    </div>
                  </div>

                  {/* Financial ledger details */}
                  <div className="space-y-3 text-xs text-left">
                    <div className="flex justify-between text-slate-500">
                      <span>Base License Fee ({registration?.billing_cycle?.toUpperCase()})</span>
                      <span className="font-semibold text-slate-900">₹{Number(registration?.base_amount).toLocaleString('en-IN')}.00</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Deployment & Setup Fee</span>
                      <span className="font-semibold text-slate-900">₹{Number(registration?.setup_fee).toLocaleString('en-IN')}.00</span>
                    </div>
                    
                    <div className="border-t border-slate-100 my-4 pt-3 flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Subscription Value</span>
                      <span>₹{Number(registration?.total_amount).toLocaleString('en-IN')}.00</span>
                    </div>

                    {/* Prominent 25% Deposit Breakdown */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4.5 space-y-3.5">
                      <div className="flex justify-between font-display font-extrabold text-sm text-indigo-700">
                        <span>Mandatory Setup Deposit (25%)</span>
                        <span>₹{Number(registration?.required_initial_payment).toLocaleString('en-IN')}.00</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        To provision isolated tenant registries, map secure database nodes, and configure dedicated subdomains, an initial 25% setup payment is mandatory.
                      </p>
                      <div className="border-t border-indigo-100/50 pt-2.5 flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Outstanding Balance (75% Net)</span>
                        <span>₹{Number(registration?.remaining_amount).toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secure Trust indicators */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-left space-y-0.5">
                    <h5 className="text-[11px] font-display font-bold uppercase tracking-wide text-slate-800">TLS 1.3 Certified</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      All connection requests are audited, logged, and validated against secure cryptographic server protocols.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Realistic/Production Payment Selection Grid */}
              <div className="lg:col-span-7">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col h-full">
                  <div className="space-y-2 mb-8">
                    <h3 className="text-xl font-display font-extrabold tracking-tight text-slate-900">Select Payment Method</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      All transactions are secured with 256-bit AES encryption via Razorpay.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
                    
                    {/* UPI */}
                    <button
                      onClick={() => handleProceedPayment('upi')}
                      className="group p-5 bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-100 rounded-2xl text-left transition-all flex flex-col items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 rounded-xl flex items-center justify-center transition-colors">
                        <Smartphone className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">UPI / QR</h4>
                        <p className="text-[10px] text-slate-500 mt-1">GPay, PhonePe, Paytm & more</p>
                      </div>
                    </button>

                    {/* CARD */}
                    <button
                      onClick={() => handleProceedPayment('card')}
                      className="group p-5 bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-100 rounded-2xl text-left transition-all flex flex-col items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 rounded-xl flex items-center justify-center transition-colors">
                        <CreditCard className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">Credit / Debit Card</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Visa, Mastercard, RuPay, Maestro</p>
                      </div>
                    </button>

                    {/* NET BANKING */}
                    <button
                      onClick={() => handleProceedPayment('netbanking')}
                      className="group p-5 bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-100 rounded-2xl text-left transition-all flex flex-col items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 rounded-xl flex items-center justify-center transition-colors">
                        <Building className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">Net Banking</h4>
                        <p className="text-[10px] text-slate-500 mt-1">All major Indian banks supported</p>
                      </div>
                    </button>

                    {/* EMI */}
                    <button
                      onClick={() => handleProceedPayment('emi')}
                      className="group p-5 bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-100 rounded-2xl text-left transition-all flex flex-col items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 rounded-xl flex items-center justify-center transition-colors">
                        <Calendar className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">EMI</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Credit/Debit Card & Cardless EMI</p>
                      </div>
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <button 
                      onClick={() => handleProceedPayment()}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" /> 
                      Pay ₹{Number(registration?.required_initial_payment).toLocaleString('en-IN')}.00 Securely
                    </button>
                    
                    {/* Safety compliance notice */}
                    <div className="text-[10px] text-slate-400 text-center leading-normal mt-5 font-medium flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Authorized under GALAXY Educational Operating System frameworks.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE: SECURING AND VERIFYING HANDSHAKES (SPINNER) */}
          {['processing', 'verifying'].includes(checkoutStep) && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-6 shadow-xl py-16"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-display font-extrabold text-slate-950 uppercase tracking-tight">
                  {checkoutStep === 'processing' ? 'Processing Gateway Capture' : 'Validating HMAC Signature'}
                </h4>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  {processingMessage}
                </p>
              </div>
            </motion.div>
          )}

          {/* STATE: PAYMENT FAILED VIEW */}
          {checkoutStep === 'failed' && (
            <motion.div 
              key="failed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-6 shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Authorization Refused</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Verification signature handshake has been rejected by GALAXY security engines. Please re-verify or try another payment method.
                </p>
              </div>
              <button 
                onClick={() => setCheckoutStep('init')} 
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer border border-slate-800"
              >
                Retry Transaction Handshake
              </button>
            </motion.div>
          )}

          {/* STATE: SUBSCRIPTION ACTIVATED SUCCESS PAGE */}
          {checkoutStep === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="max-w-3xl mx-auto space-y-8 text-left"
            >
              <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm text-center relative overflow-hidden">
                {/* Decoration overlay */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl"></div>
                
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-600 font-extrabold tracking-widest uppercase">System Provisioned</span>
                  <h2 className="text-2xl font-display font-black tracking-tight text-slate-900">GALAXY Node Commissioned!</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Subscription activated. Your school's educational operating system node has been mapped and deployed successfully.
                  </p>
                </div>

                {/* Identity Parameter Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto pt-4 text-left">
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Primary Identity Code</span>
                    <span className="text-xs font-mono font-black text-indigo-600 block">{activatedDetails?.schoolUniqueId || 'GAL-XXXXXX'}</span>
                    <span className="text-[9px] text-slate-500 font-medium block mt-1">School Unique ID generated</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Tenant Directory</span>
                    <span className="text-[10px] font-mono font-black text-slate-700 truncate block">{activatedDetails?.tenantId || 'tenant_registry_instance'}</span>
                    <span className="text-[9px] text-slate-500 font-medium block mt-1">Tenant isolated database active</span>
                  </div>
                </div>

                {/* Secure certificate and receipt document viewers */}
                <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button 
                    onClick={() => {
                      setDocModalTab('certificate');
                      setDocModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-2xl transition-all cursor-pointer shadow-md shadow-indigo-600/15"
                  >
                    <FileText className="w-4 h-4 text-white" /> View Registration Certificate
                  </button>

                  <button 
                    onClick={() => {
                      setDocModalTab('receipt');
                      setDocModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-extrabold rounded-2xl transition-all cursor-pointer shadow-sm"
                  >
                    <Receipt className="w-4 h-4 text-emerald-600" /> View Payment Receipt &amp; Invoice
                  </button>
                </div>
              </div>

              {/* Secure login redirect panel */}
              <div className="bg-indigo-600 text-white rounded-3xl p-6.5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md shadow-indigo-600/10">
                <div className="text-left space-y-1">
                  <h4 className="text-sm font-display font-extrabold">Configure Administrative Account</h4>
                  <p className="text-xs text-indigo-100 leading-relaxed">Step into GALAXY ERP to register master admin modules and configure schedules.</p>
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-indigo-600 text-xs font-extrabold rounded-2xl transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                >
                  Proceed to Login <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Full-Page Document Viewer Modal for Certificate & Receipt */}
      <RegistrationCertificateModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        registrationId={registrationId}
        initialTab={docModalTab}
      />
    </div>
  );
}
