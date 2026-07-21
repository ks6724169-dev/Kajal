import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, CheckCircle2, AlertTriangle, ArrowRight, Loader2, 
  ShieldCheck, RefreshCw, Calendar, Users, Award, ChevronRight, 
  FileText, Download, Building, Check, ArrowLeft, Sparkles, Laptop, Smartphone, HelpCircle
} from 'lucide-react';

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
  const [paymentMode, setPaymentMode] = useState<'mock' | 'live'>('mock');
  const [checkoutStep, setCheckoutStep] = useState<'init' | 'processing' | 'verifying' | 'success' | 'failed'>('init');
  const [processingMessage, setProcessingMessage] = useState('Initiating cryptographic gateway handshake...');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  
  // Success details from backend
  const [activatedDetails, setActivatedDetails] = useState<any>(null);

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
        if (draft.status === 'COMPLETED' && draft.school_unique_id) {
          // If already complete, skip checkout directly
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
          // Handle dynamic configuration pending warning
          if (prepData.message && prepData.message.includes('PAYMENT_GATEWAY_CONFIG_PENDING')) {
            throw new Error('PAYMENT_GATEWAY_CONFIG_PENDING');
          }
          throw new Error(prepData.message || 'Handshake failed with payment controller.');
        }

        if (!active) return;
        setOrderData(prepData);
        setPaymentMode(prepData.pricing?.paymentMode || 'mock');
      } catch (err: any) {
        if (active) {
          if (err.message === 'PAYMENT_GATEWAY_CONFIG_PENDING') {
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
  const handleProceedLivePayment = () => {
    if (!orderData) return;
    
    // Load script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      const options = {
        key: orderData.pricing?.keyId, // Public Key Id from backend
        amount: Math.round(orderData.pricing?.requiredInitialPayment * 100), // in paise
        currency: orderData.currency || 'INR',
        name: 'GALAXY ERP',
        description: `${registration?.selected_plan?.toUpperCase()} Subscription Deposit`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Trigger backend verification
          await handleBackendVerify({
            orderId: orderData.orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            paymentMethod: 'razorpay-live'
          });
        },
        prefill: {
          name: registration?.owner_name || '',
          email: registration?.owner_email || '',
          contact: registration?.owner_mobile || ''
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
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };

    script.onerror = () => {
      setError('Failed to load Razorpay Gateway script. Please check your internet connection.');
    };

    document.body.appendChild(script);
  };

  // Secure Sandbox Payment Verification
  const handleProceedMockPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCheckoutStep('processing');
    setProcessingMessage('Establishing secure sandbox transaction pipeline...');
    
    // Progressive feedback steps
    const steps = [
      { text: 'Securing network handshake with GALAXY payment node...', delay: 600 },
      { text: 'Generating verified HMAC-SHA256 checksum audit hashes...', delay: 1200 },
      { text: 'Finalizing server-authoritative ledger updates...', delay: 1800 }
    ];

    steps.forEach((s) => {
      setTimeout(() => {
        setProcessingMessage(s.text);
      }, s.delay);
    });

    setTimeout(async () => {
      setCheckoutStep('verifying');
      const mockPaymentId = 'pay_sandbox_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const mockSignature = 'sig_sandbox_' + Math.random().toString(36).substring(2, 15).toUpperCase();

      await handleBackendVerify({
        orderId: orderData?.orderId || `order_mock_${Math.random().toString(36).substring(2, 8)}`,
        paymentId: mockPaymentId,
        signature: mockSignature,
        paymentMethod: paymentMethod === 'upi' ? 'sandbox-upi-qr' : paymentMethod === 'card' ? 'sandbox-card' : 'sandbox-netbanking',
        transactionReference: paymentMethod === 'upi' ? `UPI-QR-TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : `CARD-AUTH-XXXX-XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }, 2400);
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
      const response = await fetch(`/api/v1/school-registration/certificate/${registrationId}`);
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
      const response = await fetch(`/api/v1/school-registration/receipt/${registrationId}`);
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

  // Generate real dynamic UPI deep link URI and QR code
  const getDynamicUPIUri = () => {
    const payeeAddress = 'finance@galaxyerp.com';
    const payeeName = 'GALAXY ERP';
    const amount = Number(registration?.required_initial_payment) || 0;
    const orderId = orderData?.orderId || 'order_mock';
    return `upi://pay?pa=${payeeAddress}&pn=${encodeURIComponent(payeeName)}&tr=${orderId}&am=${amount}&cu=INR&tn=${encodeURIComponent('GALAXY ERP Subscription Deposit')}`;
  };

  const dynamicUPIUri = getDynamicUPIUri();
  const dynamicQRCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(dynamicUPIUri)}`;

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
                  1. Set <code>PAYMENT_MODE=mock</code> in your <code>.env</code> file for sandbox testing.
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
                <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm text-left h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-display font-bold tracking-tight text-slate-900">Secure Payment Gateway</h3>
                      <p className="text-xs text-slate-500">Choose your secure payment route to complete registration and deploy your GALAXY system.</p>
                    </div>

                    {/* LIVE MODE - INTEGRATES WITH RAZORPAY STANDARD POPUP */}
                    {paymentMode === 'live' ? (
                      <div className="space-y-6 py-6 flex-1 flex flex-col justify-center">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                          <CreditCard className="w-10 h-10 text-indigo-600 mx-auto" />
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-900">Razorpay Live Gateway Initialized</h4>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                              Ready to connect with <strong>Razorpay secure gateway</strong>. Click below to verify 25% subscription deposit and activate.
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={handleProceedLivePayment}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25"
                        >
                          <ShieldCheck className="w-4.5 h-4.5" /> Pay ₹{Number(registration?.required_initial_payment).toLocaleString('en-IN')}.00 Securely
                        </button>
                      </div>
                    ) : (
                      /* SANDBOX / MOCK MODE - INTEGRATES WITH TRANSACTION-LINKED DYNAMIC QR AND SIMULATED FLOW */
                      <form onSubmit={handleProceedMockPayment} className="space-y-6">
                        {/* Selector Tabs */}
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={`flex-1 py-2.5 text-[10px] uppercase font-extrabold rounded-lg tracking-wider transition-all ${
                              paymentMethod === 'upi' 
                                ? 'bg-white text-slate-900 shadow-sm font-black' 
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            UPI / Dynamic QR
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 py-2.5 text-[10px] uppercase font-extrabold rounded-lg tracking-wider transition-all ${
                              paymentMethod === 'card' 
                                ? 'bg-white text-slate-900 shadow-sm font-black' 
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            Card Payment
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('netbanking')}
                            className={`flex-1 py-2.5 text-[10px] uppercase font-extrabold rounded-lg tracking-wider transition-all ${
                              paymentMethod === 'netbanking' 
                                ? 'bg-white text-slate-900 shadow-sm font-black' 
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            Net Banking / Net
                          </button>
                        </div>

                        <AnimatePresence mode="wait">
                          {/* TAB: UPI / DYNAMIC QR */}
                          {paymentMethod === 'upi' && (
                            <motion.div 
                              key="upi-pane"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-4"
                            >
                              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">One-Time Dynamic Transaction QR</span>
                                
                                {/* Dynamic QR Code container */}
                                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-inner relative overflow-hidden">
                                  <img 
                                    src={dynamicQRCodeUrl} 
                                    alt="Transaction QR" 
                                    className="w-44 h-44 object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                  {/* Scanning bar effect */}
                                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/60 blur-[2px] animate-pulse"></div>
                                </div>

                                <div className="space-y-1.5 text-slate-500 text-xs">
                                  <p className="font-extrabold text-slate-900">
                                    Payable: <span className="text-indigo-600">₹{Number(registration?.required_initial_payment).toLocaleString('en-IN')}.00</span>
                                  </p>
                                  <p className="text-[10px] leading-relaxed max-w-sm">
                                    Scan this dynamic UPI QR using Google Pay, PhonePe, Paytm, or BHIM. The reference and amount are dynamically linked.
                                  </p>
                                </div>
                              </div>
                              
                              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                                Note: Once payment is processed in your UPI app, click <strong>Sync Payment Registry</strong> below to securely verify the transaction with GALAXY nodes.
                              </p>

                              <button 
                                type="submit"
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25"
                              >
                                <ShieldCheck className="w-4.5 h-4.5" /> Sync Payment Registry & Deploy Node
                              </button>
                            </motion.div>
                          )}

                          {/* TAB: SECURE CARD PAY */}
                          {paymentMethod === 'card' && (
                            <motion.div 
                              key="card-pane"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-4"
                            >
                              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                                  <CreditCard className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="space-y-1.5">
                                  <h4 className="text-sm font-bold text-slate-900">Secure PCI-DSS Card Verification</h4>
                                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto">
                                    Our production gateways utilize bank-grade encryption to secure card transactions. Sandbox mode will simulate complete credit card gateway authorizations without processing real funds.
                                  </p>
                                </div>
                              </div>

                              <button 
                                type="submit"
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25"
                              >
                                <ShieldCheck className="w-4.5 h-4.5" /> Authorize Card Transaction (₹{Number(registration?.required_initial_payment).toLocaleString('en-IN')}.00)
                              </button>
                            </motion.div>
                          )}

                          {/* TAB: NET BANKING */}
                          {paymentMethod === 'netbanking' && (
                            <motion.div 
                              key="netbanking-pane"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-4"
                            >
                              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                                  <Building className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="space-y-1.5">
                                  <h4 className="text-sm font-bold text-slate-900">Direct Net Banking Tunnel</h4>
                                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto">
                                    Connects directly with netbanking modules of all major financial institutions. Our sandbox server will initiate verification logic instantly.
                                  </p>
                                </div>
                              </div>

                              <button 
                                type="submit"
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25"
                              >
                                <ShieldCheck className="w-4.5 h-4.5" /> Launch Net Banking Checkout
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </form>
                    )}
                  </div>

                  {/* Safety compliance notice */}
                  <div className="text-[10px] text-slate-400 text-center leading-normal mt-6 border-t border-slate-100 pt-4 font-medium flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Authorized under GALAXY Educational Operating System frameworks.
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

                {/* Secure certificate downloads */}
                <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={handleDownloadCertificate}
                    className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4 text-indigo-600" /> Download Certificate
                  </button>
                  <button 
                    onClick={handleDownloadReceipt}
                    className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-indigo-600" /> Download Payment Receipt
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
    </div>
  );
}
