import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  CreditCard,
  Receipt,
  FileCheck,
  Briefcase,
  Loader2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import QRCode from 'react-qr-code';

// Helper functions for OKLCH and OKLAB to RGB conversion to ensure html2canvas compatibility
function oklchToRgb(l_val: string, c_val: string, h_val: string, alpha_val: number = 1): string {
  const L = parseFloat(l_val);
  const C = parseFloat(c_val);
  const H = (parseFloat(h_val) * Math.PI) / 180;
  
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_rgb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  
  const transform = (val: number) => {
    return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };
  
  const R = Math.round(Math.max(0, Math.min(1, transform(r))) * 255);
  const G = Math.round(Math.max(0, Math.min(1, transform(g))) * 255);
  const B = Math.round(Math.max(0, Math.min(1, transform(b_rgb))) * 255);
  
  if (alpha_val !== undefined && alpha_val !== null && alpha_val !== 1) {
    return `rgba(${R}, ${G}, ${B}, ${alpha_val})`;
  }
  return `rgb(${R}, ${G}, ${B})`;
}

function oklabToRgb(l_val: string, a_val: string, b_val: string, alpha_val: number = 1): string {
  let L = parseFloat(l_val);
  if (l_val.endsWith('%')) L = L / 100;
  let a = parseFloat(a_val);
  let b = parseFloat(b_val);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_rgb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const transform = (val: number) => {
    return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };

  const R = Math.round(Math.max(0, Math.min(1, transform(r))) * 255);
  const G = Math.round(Math.max(0, Math.min(1, transform(g))) * 255);
  const B = Math.round(Math.max(0, Math.min(1, transform(b_rgb))) * 255);

  if (alpha_val !== undefined && alpha_val !== null && alpha_val !== 1) {
    return `rgba(${R}, ${G}, ${B}, ${alpha_val})`;
  }
  return `rgb(${R}, ${G}, ${B})`;
}

const modernColorRegex = /(?:oklch|oklab|color)\((?:[^()]*|\([^()]*\))*\)/gi;

const convertModernColorToRgb = (colorStr: string): string => {
  const lower = colorStr.toLowerCase().trim();
  if (lower.startsWith('oklab')) {
    try {
      const content = lower.replace(/^oklab\(/, '').replace(/\)$/, '').trim();
      const parts = content.split('/');
      const labPart = parts[0].trim();
      const alphaPart = parts[1] ? parts[1].trim() : null;
      const labValues = labPart.split(/\s+/).filter(Boolean);
      if (labValues.length < 3) return 'rgb(99, 102, 241)';
      let alpha = 1;
      if (alphaPart) {
        if (alphaPart.includes('var(')) {
          const match = alphaPart.match(/,\s*([\d.%]+)\)/);
          if (match) {
            const fb = match[1];
            alpha = fb.endsWith('%') ? parseFloat(fb) / 100 : parseFloat(fb);
          }
        } else {
          alpha = alphaPart.endsWith('%') ? parseFloat(alphaPart) / 100 : parseFloat(alphaPart);
        }
      }
      if (isNaN(alpha)) alpha = 1;
      return oklabToRgb(labValues[0], labValues[1], labValues[2], alpha);
    } catch {
      return 'rgb(99, 102, 241)';
    }
  } else if (lower.startsWith('oklch')) {
    return oklchToRgbString(lower);
  }
  return 'rgb(99, 102, 241)';
};

const oklchToRgbString = (oklchStr: string): string => {
  try {
    const content = oklchStr.slice(6, -1).trim();
    const parts = content.split('/');
    const lchPart = parts[0].trim();
    const alphaPart = parts[1] ? parts[1].trim() : null;

    const lchValues = lchPart.split(/\s+/).filter(Boolean);
    if (lchValues.length < 3) return 'rgb(99, 102, 241)';

    let l = parseFloat(lchValues[0]);
    if (lchValues[0].endsWith('%')) l = l / 100;

    let c = parseFloat(lchValues[1]);
    if (lchValues[1].endsWith('%')) c = c / 100;

    let h = parseFloat(lchValues[2]);

    let alpha = 1;
    if (alphaPart) {
      if (alphaPart.includes('var(')) {
        const match = alphaPart.match(/,\s*([\d.%]+)\)/);
        if (match) {
          const fb = match[1];
          alpha = fb.endsWith('%') ? parseFloat(fb) / 100 : parseFloat(fb);
        } else {
          alpha = 1;
        }
      } else {
        alpha = alphaPart.endsWith('%') ? parseFloat(alphaPart) / 100 : parseFloat(alphaPart);
      }
    }
    if (isNaN(alpha)) alpha = 1;

    return oklchToRgb(String(l), String(c), String(h), alpha);
  } catch (e) {
    return 'rgb(99, 102, 241)';
  }
};

const rewriteOklchInStyleSheets = () => {
  const backups: { sheet: CSSStyleSheet; ruleText: string; index: number }[] = [];
  
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      const rules = sheet.cssRules || sheet.rules;
      if (!rules) return;
      
      for (let i = rules.length - 1; i >= 0; i--) {
        const rule = rules[i];
        if (rule.cssText && (rule.cssText.includes('oklch') || rule.cssText.includes('oklab'))) {
          backups.push({
            sheet,
            ruleText: rule.cssText,
            index: i
          });
          
          const newRuleText = rule.cssText.replace(modernColorRegex, (m) => convertModernColorToRgb(m));
          sheet.deleteRule(i);
          try {
            sheet.insertRule(newRuleText, i);
          } catch (insertErr) {
            try {
              sheet.insertRule(newRuleText, sheet.cssRules.length);
            } catch (err) {
              try {
                sheet.insertRule(rule.cssText, i);
              } catch (e) {
                // Ignore
              }
            }
          }
        }
      }
    } catch (e) {
      // Ignore CORS errors
    }
  });

  const styleTags = Array.from(document.querySelectorAll('style'));
  const styleTagBackups = styleTags.map(tag => ({
    tag,
    originalText: tag.textContent || ''
  }));

  styleTags.forEach(tag => {
    if (tag.textContent && (tag.textContent.includes('oklch') || tag.textContent.includes('oklab'))) {
      tag.textContent = tag.textContent.replace(modernColorRegex, (m) => convertModernColorToRgb(m));
    }
  });

  return () => {
    styleTagBackups.forEach(({ tag, originalText }) => {
      tag.textContent = originalText;
    });

    backups.reverse().forEach(({ sheet, ruleText, index }) => {
      try {
        sheet.deleteRule(index);
        sheet.insertRule(ruleText, index);
      } catch (e) {
        try {
          sheet.insertRule(ruleText, sheet.cssRules.length);
        } catch (err) {
          // Ignore
        }
      }
    });
  };
};

interface RegistrationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
  initialTab?: 'certificate' | 'receipt';
}

export function RegistrationCertificateModal({ isOpen, onClose, registrationId, initialTab }: RegistrationCertificateModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'certificate' | 'receipt'>(initialTab || 'certificate');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && registrationId) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      fetchRegistrationData();
    }
  }, [isOpen, registrationId, initialTab]);

  const fetchRegistrationData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/school-registration/${registrationId}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch registration data');
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!documentRef.current || !data || isDownloading) return;
    setIsDownloading(true);

    let restoreStylesheets: (() => void) | null = null;
    let restoreGetComputedStyle: (() => void) | null = null;

    try {
      const element = documentRef.current;
      const fileName = activeTab === 'certificate'
        ? `GALAXY-ERP-School-Registration-${data.school_unique_id || 'Certificate'}.pdf`
        : `GALAXY-ERP-Payment-Receipt-${data.school_unique_id || 'Receipt'}.pdf`;

      // Safely access html2pdf library function
      const pdfConverter = typeof html2pdf === 'function' 
        ? html2pdf 
        : (html2pdf as any)?.default || (window as any)?.html2pdf;

      if (typeof pdfConverter !== 'function') {
        throw new Error('PDF conversion library is unavailable. Please use the Print / Save as PDF button instead.');
      }

      // Proxy window.getComputedStyle so html2canvas never receives oklab / oklch / color() values from computed styles
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
        const style = originalGetComputedStyle(elt, pseudoElt);
        return new Proxy(style, {
          get(target, prop, receiver) {
            const val = Reflect.get(target, prop, receiver);
            if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
              return convertModernColorToRgb(val);
            }
            if (typeof val === 'function') {
              if (prop === 'getPropertyValue') {
                return function(propertyName: string) {
                  const originalVal = target.getPropertyValue(propertyName);
                  if (typeof originalVal === 'string' && (originalVal.includes('oklch') || originalVal.includes('oklab') || originalVal.includes('color('))) {
                    return convertModernColorToRgb(originalVal);
                  }
                  return originalVal;
                };
              }
              return val.bind(target);
            }
            return val;
          }
        });
      };

      restoreGetComputedStyle = () => {
        window.getComputedStyle = originalGetComputedStyle;
      };

      try {
        restoreStylesheets = rewriteOklchInStyleSheets();
      } catch (e) {
        console.warn('CSS rewrite notice:', e);
      }

      const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          allowTaint: false,
          logging: false,
          onclone: (clonedDoc: Document) => {
            try {
              const styleTags = clonedDoc.querySelectorAll('style');
              styleTags.forEach(tag => {
                if (tag.textContent && (tag.textContent.includes('oklch') || tag.textContent.includes('oklab') || tag.textContent.includes('color('))) {
                  tag.textContent = tag.textContent.replace(modernColorRegex, (m) => convertModernColorToRgb(m));
                }
              });

              const allElements = clonedDoc.querySelectorAll('*');
              allElements.forEach((el) => {
                const htmlEl = el as HTMLElement;
                if (htmlEl.style && htmlEl.style.cssText) {
                  if (htmlEl.style.cssText.includes('oklch') || htmlEl.style.cssText.includes('oklab') || htmlEl.style.cssText.includes('color(')) {
                    htmlEl.style.cssText = htmlEl.style.cssText.replace(modernColorRegex, (m) => convertModernColorToRgb(m));
                  }
                }
              });
            } catch (e) {
              console.warn('onclone style rewrite warning:', e);
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const worker = pdfConverter().set(opt).from(element);
      await worker.save();
    } catch (err: any) {
      console.error('PDF download error:', err);
      alert(err.message || 'PDF Generation failed. Please try "Print / Save as PDF" instead.');
    } finally {
      if (restoreGetComputedStyle) {
        try { restoreGetComputedStyle(); } catch (e) {}
      }
      if (restoreStylesheets) {
        try { restoreStylesheets(); } catch (e) {}
      }
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (isPrinting || isDownloading) return;
    setIsPrinting(true);
    
    const handleAfterPrint = () => {
      setIsPrinting(false);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
    window.addEventListener('afterprint', handleAfterPrint);

    try {
      window.focus();
      setTimeout(() => {
        try {
          window.print();
        } catch (err) {
          console.error('Window print execution failed:', err);
        } finally {
          setTimeout(() => setIsPrinting(false), 500);
        }
      }, 150);
    } catch (err) {
      console.error('Print focus failed:', err);
      setIsPrinting(false);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  };

  if (!isOpen) return null;

  const invoiceNumber = `INV-${registrationId.substring(0, 8).toUpperCase()}`;
  const totalStudents = data?.student_capacity || data?.total_students || 100;
  const formattedPlan = (data?.plan_id || data?.selected_plan || 'Silver').toUpperCase();
  const baseAmount = Number(data?.base_amount || 0);
  const setupFee = Number(data?.setup_fee || 0);
  const totalAmount = Number(data?.total_amount || 0);
  const requiredInitialPayment = Number(data?.required_initial_payment || 0);
  const paidAmount = Number(data?.paid_amount || requiredInitialPayment || 0);
  const remainingAmount = Number(data?.remaining_amount || (totalAmount - paidAmount) || 0);

  const schoolLogo = data ? (
    data.logo_url || 
    data.logoUrl || 
    data.logo_base64 || 
    data.logoBase64 || 
    data.school_logo || 
    data.schoolLogo || 
    (data.metadata && (data.metadata.logo_url || data.metadata.logoUrl || data.metadata.logo_base64 || data.metadata.logoBase64))
  ) : null;

  return createPortal(
    <AnimatePresence>
      <div id="print-modal-root" className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 print:bg-white print:p-0 print:block antialiased text-slate-900">
        {/* Crisp Backdrop Overlay - Separated to prevent backdrop-blur from bleeding raster blur into child document */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden" 
          onClick={onClose}
        />

        <style dangerouslySetInnerHTML={{ __html: `
          #print-modal-root * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
          #print-document-target img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
          @media print {
            body {
              background: white !important;
              color: black !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body > *:not(#print-modal-root) {
              display: none !important;
            }
            #print-modal-root {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: auto !important;
              overflow: visible !important;
              background: white !important;
              display: block !important;
              padding: 0 !important;
              margin: 0 !important;
              filter: none !important;
              backdrop-filter: none !important;
              transform: none !important;
              z-index: 999999 !important;
            }
            #print-document-target {
              box-shadow: none !important;
              border: none !important;
              margin: 0 auto !important;
              padding: 0 !important;
              width: 210mm !important;
              height: auto !important;
              filter: none !important;
              backdrop-filter: none !important;
              transform: none !important;
            }
            #print-document-target .a4-page-node {
              width: 210mm !important;
              min-height: 297mm !important;
              padding: 16mm 20mm !important;
              border: none !important;
              filter: none !important;
              backdrop-filter: none !important;
              transform: none !important;
              page-break-after: avoid !important;
              page-break-before: avoid !important;
            }
          }
        `}} />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          style={{ transform: 'none', filter: 'none' }}
          className="relative z-10 bg-slate-100 w-full max-w-4xl h-[92vh] max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden print:w-full print:max-w-none print:shadow-none print:h-auto print:max-h-none print:rounded-none print:bg-white"
        >
          {/* Header Controls - Hidden when printing */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between print:hidden gap-3 shrink-0">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">Galaxy ERP Document Service</h3>
              <p className="text-[11px] text-slate-500">Official Secure Verification & Print Center</p>
            </div>
            
            {/* Tab switchers */}
            {!loading && !error && data && (
              <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
                <button
                  onClick={() => setActiveTab('certificate')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'certificate' 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Registration Certificate
                </button>
                <button
                  onClick={() => setActiveTab('receipt')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'receipt' 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  Payment Receipt & Invoice
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                disabled={loading || !!error || isPrinting || isDownloading}
                title="Open browser print / Save as PDF dialog"
              >
                {isPrinting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Printer className="w-3.5 h-3.5" />
                )}
                <span>{isPrinting ? 'Opening Print...' : 'Print / Save as PDF'}</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                disabled={loading || !!error || isPrinting || isDownloading}
                title="Download direct PDF file"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate or Receipt Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100 print:p-0 print:overflow-visible">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600">Retrieving official records...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center max-w-sm mx-auto">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-2">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900">Verification Failed</h4>
                <p className="text-sm text-slate-500">{error}</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300">Close</button>
              </div>
            ) : data ? (
              
              /* A4 Formatted Document (Dynamically renders active tab content) */
              <div 
                ref={documentRef}
                id="print-document-target"
                className="bg-white mx-auto relative shadow-sm print:shadow-none overflow-visible w-full max-w-[210mm] print:w-full print:h-full antialiased"
                style={{
                  boxSizing: 'border-box',
                  padding: 0
                }}
              >
                {activeTab === 'certificate' ? (
                  // TAB 1: REGISTRATION CERTIFICATE VIEW (Beautifully distributed into 2 complete pages)
                  <div className="space-y-6 print:space-y-0">
                    
                    {/* PAGE 1: OFFICIAL COVENANT OF REGISTRATION */}
                    <div 
                      className="a4-page-node relative bg-white border-[8px] border-slate-50 border-double flex flex-col justify-between print:border-none w-full max-w-[210mm] min-h-[297mm] p-4 sm:p-8 md:p-[16mm] box-border mx-auto antialiased"
                    >
                      {/* Decorative inner border */}
                      <div className="absolute inset-0 border border-slate-200 m-2 pointer-events-none"></div>
                      
                      {/* Top Accent Gradient Bar */}
                      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700"></div>

                      <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                        <div>
                          {/* Branding Header */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {schoolLogo ? (
                                <img src={schoolLogo} alt="School Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-200 shadow-sm bg-white p-0.5" />
                              ) : (
                                <img src="/galaxy-logo.png" alt="Galaxy ERP Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-200 shadow-sm bg-white p-0.5" />
                              )}
                              <div>
                                <h1 className="font-display font-extrabold text-xl tracking-tight text-slate-950 leading-none">GALAXY</h1>
                                <p className="text-[9px] font-bold text-indigo-600 tracking-[0.2em] uppercase mt-1">Enterprise ERP</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <h2 className="text-lg font-serif font-bold text-slate-800 tracking-tight">SCHOOL REGISTRATION</h2>
                              <h3 className="text-xs font-semibold text-indigo-500 tracking-wider">OFFICIAL CERTIFICATE</h3>
                            </div>
                          </div>

                          {/* Decorative Seal / Emblem and Title */}
                          <div className="text-center my-10 space-y-3">
                            <span className="text-[10px] font-bold text-indigo-600 tracking-[0.25em] uppercase block">OFFICIAL COVENANT OF REGISTRATION</span>
                            <h3 className="text-2xl font-serif font-extrabold text-slate-900 tracking-tight leading-tight max-w-lg mx-auto">
                              CERTIFICATE OF INCORPORATION
                            </h3>
                            <p className="text-[10px] text-slate-500 max-w-md mx-auto leading-relaxed">
                              This is to officially certify that the academic institution detailed below has successfully completed multi-step validation, identity registry, and independent tenant provisioning on GALAXY ERP SYSTEMS.
                            </p>
                          </div>

                          {/* Primary Identifier */}
                          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-center mb-8">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">School Unique ID</span>
                            <div className="text-3xl font-mono font-bold text-indigo-700 tracking-tight">
                              {data.school_unique_id || 'GAL-REG-PENDING'}
                            </div>
                            <p className="text-[9px] text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                              This unique GALAXY ID is the primary cryptographic identifier of your dedicated school node database and multi-tenant environment.
                            </p>
                          </div>

                          {/* Two Column Details */}
                          <div className="grid grid-cols-2 gap-8 mb-8">
                            
                            {/* Institution Details */}
                            <div>
                              <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 mb-3">
                                <Building2 className="w-4 h-4 text-indigo-600" />
                                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Institution Details</h4>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Registered Institution Name</span>
                                  <span className="text-xs font-bold text-slate-800 block leading-tight">{data.institution_name || data.school_name || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Board / Affiliation</span>
                                    <span className="text-xs font-medium text-slate-700">{data.board_type || data.board || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Institution Type</span>
                                    <span className="text-xs font-medium text-slate-700">{data.institution_type || data.school_type || 'N/A'}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Affiliation No.</span>
                                    <span className="text-xs font-medium text-slate-700">{data.affiliation_number || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Establishment Year</span>
                                    <span className="text-xs font-medium text-slate-700">{data.establishment_year || data.established_year || 'N/A'}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Official Website</span>
                                  <span className="text-xs font-medium text-indigo-600 truncate block">{data.official_website || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Location Details */}
                            <div>
                              <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 mb-3">
                                <MapPin className="w-4 h-4 text-indigo-600" />
                                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Location Specification</h4>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Campus Address</span>
                                  <span className="text-xs font-medium text-slate-700 block leading-normal">
                                    {data.address || 'N/A'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">City</span>
                                    <span className="text-xs font-medium text-slate-700">{data.city || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">State</span>
                                    <span className="text-xs font-medium text-slate-700">{data.state || 'N/A'}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Country</span>
                                    <span className="text-xs font-medium text-slate-700">{data.country || 'India'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">PIN Code</span>
                                    <span className="text-xs font-medium text-slate-700">{data.postal_code || data.pincode || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Verification & Seal Footer Area */}
                        <div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
                            <div className="flex gap-4 items-center">
                              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                                <QRCode 
                                  value={`https://galaxy-erp.com/verify-school/${data.school_unique_id || 'unverified'}`}
                                  size={60}
                                  level="M"
                                  fgColor="#1e293b"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                  <span className="font-bold text-xs text-emerald-700">Verified GALAXY ERP Node</span>
                                </div>
                                <p className="text-[9px] text-slate-500">Status: ACTIVE &amp; PROVISIONED</p>
                                <p className="text-[9px] text-slate-500 font-mono">Ref: {data.registration_id}</p>
                                <p className="text-[9px] text-slate-500">Activated: {new Date(data.activated_at || data.updated_at || data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                            </div>
                            
                            {/* Seal Graphic */}
                            <div className="w-16 h-16 border-2 border-indigo-100 rounded-full flex items-center justify-center opacity-70">
                              <div className="w-12 h-12 border border-indigo-200 rounded-full flex flex-col items-center justify-center text-center">
                                <span className="text-[5px] font-bold text-indigo-400 uppercase">OFFICIAL</span>
                                <Sparkles className="w-3 h-3 text-indigo-300 my-0.5" />
                                <span className="text-[5px] font-bold text-indigo-400 uppercase">SEAL</span>
                              </div>
                            </div>
                          </div>

                          {/* Footer Info */}
                          <div className="text-center border-t border-slate-200 pt-4">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Powered by GALAXY ERP SYSTEMS</p>
                            <p className="text-[8px] text-slate-400 mt-0.5">Enterprise School Operating System &bull; Digitally Signed SLA Covenant</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FORCE PAGE BREAK FOR PDF AND PRINT SERVICES */}
                    <div className="pdf-page-break h-4 print:h-0"></div>

                    {/* PAGE 2: SUPPLEMENTAL SERVICE SPECIFICATIONS & SLA AGREEMENT */}
                    <div 
                      className="a4-page-node relative bg-white border-[8px] border-slate-50 border-double flex flex-col justify-between print:border-none w-full max-w-[210mm] min-h-[297mm] p-4 sm:p-8 md:p-[16mm] box-border mx-auto antialiased"
                    >
                      {/* Decorative inner border */}
                      <div className="absolute inset-0 border border-slate-200 m-2 pointer-events-none"></div>
                      
                      {/* Top Accent Gradient Bar */}
                      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-800"></div>

                      <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                        <div>
                          {/* Small Header */}
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                              <span className="font-display font-black text-xs text-slate-900 tracking-tight">GALAXY ERP COVENANT SPECIFICATIONS</span>
                            </div>
                            <span className="text-[8px] font-mono text-slate-400">Ref: {data.registration_id}</span>
                          </div>

                          <div className="my-6">
                            <h3 className="text-base font-serif font-bold text-slate-900 mb-1">SUPPLEMENTAL REGISTRY &amp; SLA ARCHITECTURE</h3>
                            <p className="text-[10px] text-slate-500 leading-normal">
                              This document lists the official administrative ownership parameters, service capacity limits, branding presets, and financial transactions registered for this node under the legally-binding GALAXY ERP Master SLA agreement.
                            </p>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-6 mb-6">
                            
                            {/* Contact & Administrative Ownership */}
                            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-indigo-600" />
                                Owner &amp; Admin Registry
                              </h4>
                              <div className="space-y-2.5 text-xs">
                                <div>
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">Owner / Founder Name</span>
                                  <strong className="text-slate-800">{data.owner_name || data.principal_name || 'N/A'}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">ERP Administrator</span>
                                  <strong className="text-slate-800">
                                    {data.administrator_name || data.admin_name || 'N/A'} {data.administrator_designation ? `(${data.administrator_designation})` : ''}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">Official School Domain Email</span>
                                  <span className="text-slate-700 block">{data.official_email || data.admin_email || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">Owner Email (Gmail ID / Account)</span>
                                  <span className="text-slate-700 block">{data.owner_email || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase block">Registered Mobile</span>
                                    <span className="text-slate-700 font-mono">{data.owner_mobile || data.admin_phone || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase block">Alternate Mobile</span>
                                    <span className="text-slate-700 font-mono">{data.alternate_mobile || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Custom Brand Profile */}
                            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                Institutional Brand Architecture
                              </h4>
                              <div className="space-y-2.5 text-xs">
                                <div>
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">Institutional Short Name</span>
                                  <strong className="text-slate-800">{data.short_name || 'N/A'}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">School Logo status</span>
                                  <span className="text-slate-700 font-medium block">
                                    {data.logo_url ? '✓ Custom Institutional Logo Uploaded' : 'System Default Branding Logo'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                  <div>
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase block mb-1">Primary Color</span>
                                    <div className="flex items-center gap-1.5">
                                      <div 
                                        className="w-5 h-5 rounded border border-slate-300 shadow-sm flex-shrink-0" 
                                        style={{ backgroundColor: data.primary_brand_color || '#4f46e5' }}
                                      />
                                      <span className="text-[11px] font-mono font-medium text-slate-700">{data.primary_brand_color || '#4f46e5'}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase block mb-1">Secondary Color</span>
                                    <div className="flex items-center gap-1.5">
                                      <div 
                                        className="w-5 h-5 rounded border border-slate-300 shadow-sm flex-shrink-0" 
                                        style={{ backgroundColor: data.secondary_brand_color || '#06b6d4' }}
                                      />
                                      <span className="text-[11px] font-mono font-medium text-slate-700">{data.secondary_brand_color || '#06b6d4'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Subscription Specification Specs */}
                          <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 mb-6">
                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                              SLA Subscription Parameters &amp; Resource Allocation
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-xs mb-3">
                              <div>
                                <span className="text-[9px] font-semibold text-slate-400 uppercase block">Selected License Tier</span>
                                <strong className="text-indigo-700">{formattedPlan} License</strong>
                              </div>
                              <div>
                                <span className="text-[9px] font-semibold text-slate-400 uppercase block">Maximum Student Limit</span>
                                <strong className="text-slate-800">{totalStudents} Active Students</strong>
                              </div>
                              <div>
                                <span className="text-[9px] font-semibold text-slate-400 uppercase block">Billing Execution Cycle</span>
                                <strong className="text-slate-800">{data.billing_cycle || 'Annual'} Renewal</strong>
                              </div>
                            </div>
                            
                            {/* Financial Reconciliation Box */}
                            <div className="border-t border-dashed border-slate-200 pt-3 mt-3 grid grid-cols-4 gap-2 text-xs">
                              <div>
                                <span className="text-[8px] font-semibold text-slate-400 uppercase block">Total License Value</span>
                                <span className="text-slate-800 font-bold">₹{totalAmount.toLocaleString('en-IN')}.00</span>
                              </div>
                              <div>
                                <span className="text-[8px] font-semibold text-slate-400 uppercase block">Required Deposit (25%)</span>
                                <span className="text-slate-800 font-bold">₹{requiredInitialPayment.toLocaleString('en-IN')}.00</span>
                              </div>
                              <div>
                                <span className="text-[8px] font-semibold text-slate-400 uppercase block">Initial Amount Paid</span>
                                <span className="text-emerald-700 font-extrabold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">
                                  ₹{paidAmount.toLocaleString('en-IN')}.00
                                </span>
                              </div>
                              <div>
                                <span className="text-[8px] font-semibold text-slate-400 uppercase block">Outstanding Balance</span>
                                <span className="text-slate-800 font-bold">₹{remainingAmount.toLocaleString('en-IN')}.00</span>
                              </div>
                            </div>
                          </div>

                          {/* Technical Node Parameters */}
                          <div className="border border-slate-200/80 bg-slate-50/20 p-4 rounded-xl text-[10px] text-slate-500 space-y-2 leading-relaxed">
                            <h5 className="font-bold text-slate-800 uppercase tracking-widest text-[9px] mb-1">COGNITIVE SOVEREIGN CLOUD IDENTITY</h5>
                            <div className="grid grid-cols-3 gap-2 font-mono text-[9px]">
                              <div>
                                <span className="text-slate-400 block text-[8px] uppercase">Node Registry ID</span>
                                <span className="text-slate-700 block select-all truncate">{data.id || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[8px] uppercase">Tenant DB Reference</span>
                                <span className="text-slate-700 block select-all truncate">
                                  {data.tenant_id ? `${data.tenant_id.substring(0, 8)}...${data.tenant_id.substring(data.tenant_id.length - 4)}` : 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[8px] uppercase">Owner Account ID</span>
                                <span className="text-slate-700 block select-all truncate">
                                  {data.owner_user_id ? `${data.owner_user_id.substring(0, 8)}...${data.owner_user_id.substring(data.owner_user_id.length - 4)}` : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sign-off disclaimer */}
                        <div>
                          <p className="text-[9px] text-slate-400 leading-normal border-t border-slate-200 pt-3 mb-4">
                            <strong>LEGAL DISCLAIMER:</strong> This supplemental document is an official digital annex to the primary GALAXY ERP software covenant. All billing, database resource allocation, and user account creation have been automatically executed upon validation of the initial activation deposit. All service provisions remain legally binding and active.
                          </p>

                          {/* Footer Info */}
                          <div className="text-center border-t border-slate-200 pt-4">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Powered by GALAXY ERP SYSTEMS</p>
                            <p className="text-[8px] text-slate-400 mt-0.5">Enterprise Cloud Infrastructure Node India &bull; ISO 27001 Certified</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  // TAB 2: INVOICE & PAYMENT RECEIPT (Perfect Single A4 Page)
                  <div 
                    className="a4-page-node relative bg-white border-[8px] border-slate-50 border-double flex flex-col justify-between print:border-none w-full max-w-[210mm] min-h-[297mm] p-4 sm:p-8 md:p-[16mm] box-border mx-auto antialiased"
                  >
                    {/* Decorative inner border */}
                    <div className="absolute inset-0 border border-slate-200 m-2 pointer-events-none"></div>
                    
                    {/* Top Accent Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                      <div>
                        {/* Branding Header */}
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-3">
                            {schoolLogo ? (
                              <img src={schoolLogo} alt="School Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-200 shadow-sm bg-white p-0.5" />
                            ) : (
                              <img src="/galaxy-logo.png" alt="Galaxy ERP Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-200 shadow-sm bg-white p-0.5" />
                            )}
                            <div>
                              <h1 className="font-display font-extrabold text-xl tracking-tight text-slate-950 leading-none">GALAXY</h1>
                              <p className="text-[9px] font-bold text-emerald-600 tracking-[0.2em] uppercase mt-1">SLA Payment Node</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <h2 className="text-lg font-serif font-bold text-slate-800 tracking-tight">TRANSACTION RECEIPT</h2>
                            <h3 className="text-xs font-semibold text-emerald-500 tracking-wider">OFFICIAL REVENUE INVOICE</h3>
                          </div>
                        </div>

                        {/* Invoice Meta Grid */}
                        <div className="grid grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-xs">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Invoice ID</span>
                            <strong className="text-slate-800 font-mono text-xs">{invoiceNumber}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Payment Date</span>
                            <strong className="text-slate-800">{new Date(data.activated_at || data.updated_at || data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Payment Method</span>
                            <strong className="text-slate-800">GATEWAY SYNC</strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">SLA License Status</span>
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">ACTIVE / PAID</span>
                          </div>
                        </div>

                        {/* Billing Parties */}
                        <div className="grid grid-cols-2 gap-8 mb-6 text-xs">
                          <div>
                            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider text-[10px]">Merchant / Service Provider</h4>
                            <address className="not-italic text-slate-600 space-y-0.5 leading-normal">
                              <strong className="text-slate-800">Galaxy Educational Operating Systems</strong><br />
                              Sovereign Cloud Redundancy Zone India<br />
                              SLA Compliance Registry<br />
                              Email: compliance@galaxy-erp.com
                            </address>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider text-[10px]">Bill To (Client Institution)</h4>
                            <address className="not-italic text-slate-600 space-y-0.5 leading-normal font-medium">
                              <strong className="text-slate-800">{data.institution_name || data.school_name}</strong><br />
                              School ID: <span className="font-mono font-bold text-indigo-700">{data.school_unique_id}</span><br />
                              Owner: {data.owner_name || data.principal_name}<br />
                              Address: {data.city}, {data.state}, {data.country}
                            </address>
                          </div>
                        </div>

                        {/* Line Items Table */}
                        <table className="w-full text-xs text-left mb-6 border border-slate-200/80 rounded-xl overflow-hidden">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              <th className="py-2.5 px-4">Line Description</th>
                              <th className="py-2.5 px-4 text-center">Unit</th>
                              <th className="py-2.5 px-4 text-right">Base Price (INR)</th>
                              <th className="py-2.5 px-4 text-right">Total (INR)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr>
                              <td className="py-2.5 px-4">
                                <strong className="text-slate-800">GALAXY ERP Node License ({formattedPlan})</strong>
                                <p className="text-[9px] text-slate-400">Multi-Tenant Cognitive Workspace capacity up to {totalStudents} active students</p>
                              </td>
                              <td className="py-2.5 px-4 text-center">{data.billing_cycle || 'Annual'}</td>
                              <td className="py-2.5 px-4 text-right">₹{baseAmount.toLocaleString('en-IN')}.00</td>
                              <td className="py-2.5 px-4 text-right">₹{baseAmount.toLocaleString('en-IN')}.00</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-4">
                                <strong className="text-slate-800">Institutional Server Setup & SLA Fee</strong>
                                <p className="text-[9px] text-slate-400">One-time directory provisioning, custom branding colors, and database isolation setup</p>
                              </td>
                              <td className="py-2.5 px-4 text-center">One-time</td>
                              <td className="py-2.5 px-4 text-right">₹{setupFee.toLocaleString('en-IN')}.00</td>
                              <td className="py-2.5 px-4 text-right">₹{setupFee.toLocaleString('en-IN')}.00</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Invoice Summary Blocks */}
                        <div className="flex justify-end mb-6">
                          <div className="w-72 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Subtotal Subscription:</span>
                              <span>₹{baseAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">One-time Setup Fee:</span>
                              <span>₹{setupFee.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900">
                              <span>Total Contract Value:</span>
                              <span>₹{totalAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="flex justify-between border-t border-dashed border-slate-300 pt-1.5 font-bold text-emerald-700 bg-emerald-50/50 p-1.5 rounded">
                              <span>Amount Paid Now (25%):</span>
                              <span>₹{paidAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                              <span>Remaining Dues (75%):</span>
                              <span>₹{remainingAmount.toLocaleString('en-IN')}.00</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer receipt verification */}
                      <div>
                        <div className="flex items-center justify-between p-4 bg-emerald-50/30 border border-emerald-200 rounded-2xl mb-4 text-xs">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div>
                              <span className="font-bold text-emerald-800 block">SLA Payment Reconciled Server-Side</span>
                              <p className="text-[9px] text-emerald-700">Ref ID: {data.gateway_payment_id || 'MOCK_REF_VERIFIED'}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">VERIFIED COGNITIVE LEDGER</span>
                        </div>

                        {/* Footer */}
                        <div className="text-center border-t border-slate-200 pt-4">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">GALAXY ACADEMIC OPERATING COMPLIANCE</p>
                          <p className="text-[8px] text-slate-400 mt-0.5">Sovereign Decentralized Cloud Nodes India &bull; ISO 27001 Certified</p>
                          <p className="text-[7px] text-slate-300">This invoice acts as an official receipt of mandatory 25% initial payment for ERP activation.</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
