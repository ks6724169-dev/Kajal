import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, ChevronDown, ChevronUp, Phone, Mail, 
  ArrowLeft, Key, Lock, CheckCircle2, MessageSquare, 
  Info, Shield, Users, RefreshCw, Smartphone, Search, 
  AlertTriangle, ShieldCheck, LogOut, BookOpen, AlertCircle
} from 'lucide-react';
import { GalaxyLogo } from '../../components/common/GalaxyLogo';

interface LoginHelpPageProps {
  navigate: (path: string) => void;
}

interface FAQItem {
  id: number;
  titleHi: string;
  titleEn: string;
  category: string;
  content: React.ReactNode;
}

export const LoginHelpPage: React.FC<LoginHelpPageProps> = ({ navigate }) => {
  const [lang, setLang] = useState<'en' | 'hi'>('hi');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (id: number) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', labelHi: 'सभी श्रेणियाँ', labelEn: 'All Categories' },
    { id: 'methods', labelHi: 'लॉगिन के तरीके', labelEn: 'Login Methods' },
    { id: 'otp', labelHi: 'OTP सहायता', labelEn: 'OTP Support' },
    { id: 'password', labelHi: 'पासवर्ड और रीसेट', labelEn: 'Passwords & Reset' },
    { id: 'mfa-dash', labelHi: 'MFA और डैशबोर्ड', labelEn: 'MFA & Dashboards' },
    { id: 'security', labelHi: 'सुरक्षा और सत्र', labelEn: 'Security & Sessions' },
    { id: 'errors', labelHi: 'सामान्य त्रुटियाँ', labelEn: 'Common Errors' },
    { id: 'contact', labelHi: 'संपर्क करें', labelEn: 'Contact Support' }
  ];

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'methods',
      titleHi: '1. Galaxy ERP में Login कैसे करें?',
      titleEn: '1. How to Login to Galaxy ERP?',
      content: (
        <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
          <p className="font-semibold text-slate-800">
            {lang === 'hi' 
              ? 'Galaxy ERP में login करने के दो मुख्य सुरक्षित तरीके उपलब्ध हैं:' 
              : 'There are two main secure methods to log into Galaxy ERP:'}
          </p>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li>
              <strong>{lang === 'hi' ? 'Mobile OTP Login:' : 'Mobile OTP Login:'}</strong>{' '}
              {lang === 'hi' 
                ? 'अपने registered mobile number पर OTP प्राप्त करके त्वरित लॉगिन करें।' 
                : 'Log in instantly using a verification code sent to your registered mobile number.'}
            </li>
            <li>
              <strong>{lang === 'hi' ? 'Email + Password Login:' : 'Email + Password Login:'}</strong>{' '}
              {lang === 'hi' 
                ? 'अपने आधिकारिक institutional email और password का उपयोग करके सुरक्षित लॉगिन करें।' 
                : 'Authenticate using your official institutional email address and secure password.'}
            </li>
          </ul>
          <p className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-xs font-semibold text-indigo-800">
            {lang === 'hi'
              ? '💡 सफल लॉगिन के बाद, हमारी प्रणाली आपके registered database records को resolve करके आपको आपके सही Institution (School/College) और Role के Dashboard में automatic route करती है।'
              : '💡 Upon successful verification, the system automatically resolves your profile and redirects you to the appropriate Institution and Role-specific dashboard.'}
          </p>
        </div>
      )
    },
    {
      id: 2,
      category: 'methods',
      titleHi: '2. Mobile OTP Login कैसे काम करता है?',
      titleEn: '2. How does Mobile OTP Login work?',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p className="font-semibold text-slate-800">
            {lang === 'hi' ? 'सुरक्षित OTP लॉगिन के चरण:' : 'Steps for secure OTP login:'}
          </p>
          <ol className="list-decimal pl-5 space-y-2 font-medium">
            <li>{lang === 'hi' ? 'अपना registered 10-अंकीय mobile number डालें।' : 'Enter your registered 10-digit mobile number.'}</li>
            <li>
              <span className="text-rose-600 font-bold">
                {lang === 'hi' ? '⚠️ महत्वपूर्ण:' : '⚠️ Important:'}
              </span>{' '}
              {lang === 'hi' 
                ? 'केवल वही mobile numbers OTP प्राप्त कर सकते हैं जो database में पहले से registered हों।' 
                : 'Only mobile numbers already registered in the system database can receive codes.'}
            </li>
            <li>{lang === 'hi' ? 'आप SMS OTP या WhatsApp OTP विकल्प चुन सकते हैं।' : 'Choose between SMS OTP or WhatsApp OTP delivery.'}</li>
            <li>{lang === 'hi' ? 'OTP code दर्ज करके verify करें। verification के बाद आपका account automatic resolve हो जाएगा।' : 'Enter the received verification code. Your account resolves automatically on success.'}</li>
            <li>{lang === 'hi' ? 'यदि आपका mobile number एक से अधिक schools/colleges में registered है, तो आपको सभी active institutions की list दिखाई जाएगी ताकि आप सही school select कर सकें।' : 'If your number is linked to multiple schools, a secure list of active institutions will be displayed for you to select from.'}</li>
          </ol>
        </div>
      )
    },
    {
      id: 3,
      category: 'methods',
      titleHi: '3. अगर Mobile Number कई Institutions में Registered है तो क्या करें?',
      titleEn: '3. What if my Mobile Number is Registered with Multiple Institutions?',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs sm:text-sm font-bold text-amber-900">
            {lang === 'hi' 
              ? '📢 स्पष्ट जानकारी: "आपका mobile number एक से अधिक institutions से जुड़ा हुआ है। कृपया उस School/College को चुनें जिसमें आप login करना चाहते हैं।"' 
              : '📢 Explicit Prompt: "Your mobile number is linked with multiple institutions. Please select the specific School/College you wish to log into."'}
          </p>
          <p className="font-semibold text-slate-800">
            {lang === 'hi' ? 'Galaxy ERP का सुरक्षित सूची नियम:' : 'Galaxy ERP Directory Security Rules:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-medium">
            <li>{lang === 'hi' ? 'Institution selection list में केवल real, active, और verified database records ही दिखाई देते हैं।' : 'The directory list only contains real, active, and verified enterprise records.'}</li>
            <li>{lang === 'hi' ? 'इसमें कोई भी demo, mock, suspended या inactive school/college दिखाई नहीं देगा।' : 'Any demo, mock, suspended, or inactive institutions are strictly filtered out.'}</li>
            <li>{lang === 'hi' ? 'यदि आपका सही school list में नहीं दिख रहा है, तो तुरंत अपने school coordinator या ERP admin से संपर्क करें।' : 'If your expected school is missing, contact your institution coordinator immediately.'}</li>
          </ul>
        </div>
      )
    },
    {
      id: 4,
      category: 'otp',
      titleHi: '4. SMS OTP और WhatsApp OTP में क्या अंतर है?',
      titleEn: '4. Difference between SMS OTP and WhatsApp OTP',
      content: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-black text-indigo-600 block mb-1 uppercase tracking-wider">SMS OTP Option</span>
              <p className="text-xs text-slate-600">
                {lang === 'hi' 
                  ? 'आपके registered mobile network पर traditional cell message (SMS) के ज़रिए सुरक्षित OTP भेजा जाता है। इसके लिए मोबाइल नेटवर्क सिग्नल्स होना आवश्यक है।' 
                  : 'A secure verification code is sent via traditional cell text message (SMS). Requires mobile network coverage.'}
              </p>
            </div>
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
              <span className="text-xs font-black text-emerald-600 block mb-1 uppercase tracking-wider">WhatsApp OTP Option</span>
              <p className="text-xs text-slate-600">
                {lang === 'hi' 
                  ? 'आपके registered mobile number के WhatsApp पर official Galaxy channel द्वारा direct message भेजा जाता है। इसके लिए आपके फोन में सक्रिय इंटरनेट आवश्यक है।' 
                  : 'Delivered directly to your registered WhatsApp account from the official Galaxy channel. Requires an active internet connection.'}
              </p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 italic">
            {lang === 'hi'
              ? '* नोट: आपके login screen पर केवल वही channels दिखाई देंगे जो आपके institution द्वारा production environment में वास्तव में configured और available हैं।'
              : '* Note: Only the communication channels explicitly configured in your production environment will be visible on the screen.'}
          </p>
        </div>
      )
    },
    {
      id: 5,
      category: 'otp',
      titleHi: '5. OTP नहीं आया तो क्या करें?',
      titleEn: '5. What to do if the OTP is not received?',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p className="font-semibold text-slate-800">
            {lang === 'hi' ? 'कृप्या नीचे दिए गए Troubleshooting steps का पालन करें:' : 'Please execute the following troubleshooting steps:'}
          </p>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li><strong>{lang === 'hi' ? 'Mobile number जांचें:' : 'Check mobile number:'}</strong> {lang === 'hi' ? 'सुनिश्चित करें कि आपने सही 10-digit number दर्ज किया है।' : 'Ensure that you entered the exact 10-digit number registered.'}</li>
            <li><strong>{lang === 'hi' ? 'Network signal जांचें:' : 'Check network coverage:'}</strong> {lang === 'hi' ? 'यदि SMS चुना है तो cellular signals जांचें। यदि WhatsApp चुना है तो internet connectivity जांचें।' : 'Check cell signal strength for SMS, or internet connectivity for WhatsApp.'}</li>
            <li><strong>{lang === 'hi' ? 'प्रतीक्षा करें और पुनः प्रयास करें:' : 'Wait and retry:'}</strong> {lang === 'hi' ? '60 seconds का countdown समाप्त होने तक प्रतीक्षा करें, फिर "Resend OTP" option का उपयोग करें।' : 'Wait for the 60-second cooldown timer to finish, then click the Resend OTP option.'}</li>
            <li className="text-rose-600">
              <strong>{lang === 'hi' ? 'Rate Limit चेतावनी:' : 'Rate Limit Warning:'}</strong>{' '}
              {lang === 'hi' 
                ? 'बार-बार OTP request करने से security systems द्वारा rate limit (जैसे Too Many Attempts error) लग सकती है और आपका IP/Account अस्थायी रूप से block हो सकता है।' 
                : 'Requesting OTP codes in rapid succession triggers safety rate-limiting protocols (e.g., Too Many Attempts), blocking requests temporarily.'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 6,
      category: 'methods',
      titleHi: '6. Email + Password Login कैसे करें?',
      titleEn: '6. How to use Email + Password Login?',
      content: (
        <div className="space-y-2 text-slate-600 text-sm leading-relaxed font-medium">
          <p>{lang === 'hi' ? '1. अपना registered institutional/academic email address दर्ज करें।' : '1. Enter your registered institutional or academic email address.'}</p>
          <p>{lang === 'hi' ? '2. अपना complex, strong password डालें।' : '2. Provide your compliant secure password.'}</p>
          <p>{lang === 'hi' ? '3. "Sign In to Galaxy ERP" button पर click करें।' : '3. Click the "Sign In to Galaxy ERP" trigger.'}</p>
          <p className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs font-semibold text-rose-800">
            {lang === 'hi'
              ? '❌ गलत credentials होने पर, सुरक्षा कारणों से generic और precise errors (जैसे "Invalid login credentials") दिखाई जाती हैं। कृपया caps lock और spellings की जांच करें।'
              : '❌ In case of incorrect credentials, secure and appropriate error messages (e.g. "Invalid login credentials") will be displayed. Verify your capitalization and spelling.'}
          </p>
        </div>
      )
    },
    {
      id: 7,
      category: 'password',
      titleHi: '7. Forgot Password की पूरी प्रक्रिया क्या है?',
      titleEn: '7. What is the full Forgot Password workflow?',
      content: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p className="font-semibold text-slate-800">
            {lang === 'hi' ? 'सुरक्षित पासवर्ड रीसेट प्रक्रिया:' : 'Secure Password Reset Sequence:'}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 bg-slate-50 p-4 border border-slate-200 rounded-2xl text-center text-xs font-black text-slate-700">
            <div>Forgot Password</div>
            <div className="text-indigo-600">→</div>
            <div>Registered Email</div>
            <div className="text-indigo-600">→</div>
            <div>Get Supabase Link</div>
            <div className="text-indigo-600">→</div>
            <div>Open Secure Link</div>
            <div className="text-indigo-600">→</div>
            <div>New Password</div>
            <div className="text-indigo-600">→</div>
            <div>Redirect Login</div>
          </div>
          <p className="font-medium text-xs">
            {lang === 'hi'
              ? 'Supabase auth flow के अनुसार, password request सबमिट करने पर आपको एक secure reset link ईमेल किया जाता है। उस लिंक पर क्लिक करने पर सुरक्षित recovery session बनता है और आप New Password Page पर पहुंच कर सुरक्षित रूप से नया पासवर्ड सेट कर सकते हैं।'
              : 'According to Supabase authentication flow, requesting a password reset dispatches a secure token to your email. Clicking this token verifies a temporary recovery session, enabling you to securely set a brand-new password.'}
          </p>
        </div>
      )
    },
    {
      id: 8,
      category: 'password',
      titleHi: '8. Password Reset Link काम नहीं कर रहा तो क्या करें?',
      titleEn: '8. What to do if the Password Reset Link is not working?',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed font-medium">
          <p className="text-slate-800 font-semibold">{lang === 'hi' ? 'यह समस्या मुख्य रूप से इन कारणों से होती है:' : 'This failure typically occurs due to:'}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>{lang === 'hi' ? 'Link Expired:' : 'Link Expired:'}</strong>{' '}
              {lang === 'hi' 
                ? 'सुरक्षा कारणों से Supabase reset links सीमित समय (आमतौर पर 1 घंटा) के लिए ही valid होते हैं।' 
                : 'For security reasons, Supabase reset links expire after a short timeframe (typically 1 hour).'}
            </li>
            <li>
              <strong>{lang === 'hi' ? 'Used Link:' : 'Used Link:'}</strong>{' '}
              {lang === 'hi' 
                ? 'Reset link केवल एक बार इस्तेमाल किया जा सकता है। नया password सेट करने के बाद लिंक invalid हो जाता है।' 
                : 'A reset token is single-use only. Once consumed, it is permanently deactivated.'}
            </li>
          </ul>
          <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-xs font-bold text-indigo-900">
            {lang === 'hi'
              ? '💡 समाधान: Login page पर जाकर "Forgot Password?" दोबारा click करें, नया reset link request करें, और केवल अपने ईमेल में आए बिल्कुल ताज़ा (latest) link का ही उपयोग करें।'
              : '💡 Solution: Navigate back to the "Forgot Password" form, submit a fresh request, and ensure you click only the latest reset email in your inbox.'}
          </div>
        </div>
      )
    },
    {
      id: 9,
      category: 'mfa-dash',
      titleHi: '9. MFA / Authenticator Verification कैसे काम करता है?',
      titleEn: '9. How does MFA / Authenticator Verification work?',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed font-medium">
          <p>{lang === 'hi' ? 'यदि आपके account पर multi-factor authentication (MFA/AAL2) सक्रिय है:' : 'If Multi-Factor Authentication (MFA/AAL2) is enabled on your profile:'}</p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>{lang === 'hi' ? 'पहले चरण में अपना standard primary login (Mobile OTP या Email-Password) पूरा करें।' : 'First, complete your primary login method (Mobile OTP or Email/Password).'}</li>
            <li>{lang === 'hi' ? 'इसके बाद, screen पर automatic Authenticator verification challenge दिखाई देगा।' : 'A secondary security prompt requesting your authenticator token will appear.'}</li>
            <li>{lang === 'hi' ? 'अपने registered Authenticator App (जैसे Google Authenticator, Authy) को खोलें।' : 'Open your registered Authenticator App (e.g. Google Authenticator, Microsoft Authenticator).'}</li>
            <li>{lang === 'hi' ? 'दिखाया गया 6-अंकीय OTP code दर्ज करें। सफल verification के बाद, आपको तुरंत सुरक्षित workspace access मिल जाएगा।' : 'Enter the current 6-digit passcode. Your workspace session is securely upgraded on success.'}</li>
          </ol>
        </div>
      )
    },
    {
      id: 10,
      category: 'mfa-dash',
      titleHi: '10. सफल लॉगिन के बाद सही Dashboard क्यों नहीं खुल रहा?',
      titleEn: '10. Why is the correct Dashboard not opening after login?',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed font-medium">
          <p>
            {lang === 'hi'
              ? 'लॉगिन के बाद Galaxy ERP आपकी user ID को database में search करता है और dynamic role-based dashboard load करता है:'
              : 'On authentication, Galaxy ERP performs a server-authoritative role check to mount the correct view:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-black text-center text-indigo-700">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">Owner Dashboard</div>
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">Principal Dashboard</div>
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">Teacher Dashboard</div>
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">Student Dashboard</div>
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">Parent Dashboard</div>
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">Accountant Dashboard</div>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            {lang === 'hi'
              ? '💡 समाधान: यदि आप गलत dashboard देख रहे हैं या permissions missing हैं, तो इसका कारण database में गलत role mapping हो सकता है। कृपया अपने School Coordinator से संपर्क करके अपना registered role check करवाएं।'
              : '💡 Solution: If you are routed to an incorrect view, verify your registered role configuration with your School Administrator. Permissions are determined strictly server-side.'}
          </p>
        </div>
      )
    },
    {
      id: 11,
      category: 'mfa-dash',
      titleHi: '11. Lookup में मेरा Institution (School/College) दिखाई नहीं दे रहा है?',
      titleEn: '11. Why is my Institution not appearing in the Lookup list?',
      content: (
        <div className="space-y-2 text-slate-600 text-sm leading-relaxed font-medium">
          <p className="text-rose-600 font-extrabold">
            {lang === 'hi' ? '🛡️ सुरक्षा नियम:' : '🛡️ Security Policy:'}
          </p>
          <p>
            {lang === 'hi'
              ? 'केवल Galaxy ERP platform पर registered, verified और active institutions ही search directory lookup में दिखाई देते हैं।'
              : 'Only institutions that are fully registered, verified, and active on Galaxy ERP are visible in lookups.'}
          </p>
          <p>
            {lang === 'hi'
              ? 'यदि कोई institution pending, suspended, inactive, unverified या deleted है, तो सुरक्षा कारणों से उसे list में नहीं दिखाया जाएगा।'
              : 'Any institution that is pending setup, suspended, unverified, or inactive is automatically excluded.'}
          </p>
        </div>
      )
    },
    {
      id: 12,
      category: 'security',
      titleHi: '12. Account Security (खाता सुरक्षा) के लिए महत्वपूर्ण दिशा-निर्देश',
      titleEn: '12. Essential Guidelines for Account Security',
      content: (
        <div className="space-y-2 text-slate-600 text-sm leading-relaxed font-medium">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>{lang === 'hi' ? 'OTP सुरक्षा:' : 'OTP Confidentiality:'}</strong>{' '}
              {lang === 'hi' 
                ? 'अपना OTP किसी भी परिस्थिति में किसी के साथ share न करें। Galaxy ERP team कभी भी आपसे आपका OTP नहीं मांगती।' 
                : 'Never share your verification code with anyone. Galaxy staff will never ask for your OTP.'}
            </li>
            <li>
              <strong>{lang === 'hi' ? 'मजबूत पासवर्ड:' : 'Strong Password:'}</strong>{' '}
              {lang === 'hi' 
                ? 'एक जटिल पासवर्ड रखें जिसमें uppercase letters, lowercase letters, numbers और special characters शामिल हों।' 
                : 'Use a strong password including uppercase and lowercase letters, digits, and symbols.'}
            </li>
            <li>
              <strong>{lang === 'hi' ? 'सार्वजनिक उपकरण:' : 'Public Devices:'}</strong>{' '}
              {lang === 'hi' 
                ? 'सार्वजनिक कंप्यूटरों या shared devices पर उपयोग करने के बाद session logout अवश्य करें।' 
                : 'Always click log out when accessing Galaxy ERP on shared or public workstations.'}
            </li>
            <li>
              <strong>{lang === 'hi' ? 'संदिग्ध गतिविधियाँ:' : 'Suspicious Logins:'}</strong>{' '}
              {lang === 'hi' 
                ? 'यदि आपको अपने खाते पर कोई suspicious activity दिखती है, तो तुरंत अपने ERP Administrator से संपर्क करें।' 
                : 'Report any unrecognized sign-ins immediately to your school administrator.'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 13,
      category: 'security',
      titleHi: '13. Session और Logout कैसे काम करते हैं?',
      titleEn: '13. How do Sessions and Logout work?',
      content: (
        <div className="space-y-2 text-slate-600 text-sm leading-relaxed font-medium">
          <p>
            {lang === 'hi'
              ? 'जब आप "Logout" button दबाते हैं, तो आपका current verification token तुरंत server पर revoke हो जाता है, जिससे सत्र समाप्त हो जाता है।'
              : 'Triggering "Logout" invalidates your current authorization token immediately on Supabase servers, securely ending your session.'}
          </p>
          <p>
            {lang === 'hi'
              ? 'आप अपने account security dashboard से अन्य सभी active devices के sessions को भी एक click में revoke कर सकते हैं।'
              : 'You can audit and revoke other active login sessions on other devices from your Security Settings tab.'}
          </p>
          <p className="bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-rose-800 text-xs">
            {lang === 'hi'
              ? '❌ यदि आपका account admin द्वारा suspended या deactivated किया जाता है, तो सक्रिय sessions तुरंत समाप्त हो जाएंगे और आप दुबारा login नहीं कर पाएंगे।'
              : '❌ Active sessions are immediately terminated if your profile is suspended or deactivated by your school admin.'}
          </p>
        </div>
      )
    },
    {
      id: 14,
      category: 'errors',
      titleHi: '14. आम लॉगिन त्रुटियाँ और उनके सरल समाधान (Common Login Errors & Solutions)',
      titleEn: '14. Common Login Errors & Easy Solutions',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {[
            {
              err: 'Invalid OTP',
              hi: 'दर्ज किया गया OTP गलत है। कृप्या SMS/WhatsApp पर आया 6-अंकीय कोड सही से देखकर पुनः दर्ज करें।',
              en: 'The entered OTP code is incorrect. Double-check the 6 digits received on your phone and re-enter.'
            },
            {
              err: 'OTP Expired',
              hi: 'OTP कोड की 60-second समय सीमा समाप्त हो गई है। "Resend OTP" button दबाकर नया कोड प्राप्त करें।',
              en: 'Verification code time limit has expired (60s). Click the "Resend OTP" button to receive a fresh token.'
            },
            {
              err: 'Too Many Attempts',
              hi: 'सुरक्षा कारणों से अत्यधिक requests के बाद limit लगी है। कृपया 5-10 मिनट प्रतीक्षा करें और पुनः प्रयास करें।',
              en: 'Rate-limiting triggered due to consecutive requests. Please wait 5-10 minutes before trying again.'
            },
            {
              err: 'Institution Not Found',
              hi: 'Lookup ID या School ID database में नहीं मिली। कृपया अपने school unique ID की spellings check करें।',
              en: 'The provided School ID is not in the database. Verify the exact unique ID spelling with your institution.'
            },
            {
              err: 'Account Suspended',
              hi: 'आपका account व्यवस्थापक द्वारा suspended है। बकाया शुल्क या सुरक्षा कारणों के लिए अपने स्कूल प्रशासन से संपर्क करें।',
              en: 'Access suspended by the institution administrator. Reach out to school administration to resolve.'
            },
            {
              err: 'Account Inactive',
              hi: 'आपका profile अभी active नहीं है। activate होने की प्रतीक्षा करें या ERP admin से verification status पूछें।',
              en: 'Your student/teacher profile is inactive. Wait for activation or contact the school tech cell.'
            },
            {
              err: 'Invalid Password',
              hi: 'ईमेल लॉगिन का पासवर्ड गलत है। caps-lock जांचें या "Forgot Password" पर क्लिक करके नया पासवर्ड बनाएं।',
              en: 'Incorrect password for email login. Verify caps lock status or use "Forgot Password" to reset.'
            },
            {
              err: 'Reset Link Expired',
              hi: 'ईमेल में आया password recovery link पुराना या पहले इस्तेमाल हो चुका है। नया reset link दोबारा request करें।',
              en: 'The password reset token is old or already consumed. Navigate back and request a fresh link.'
            },
            {
              err: 'MFA Required',
              hi: 'लॉगिन के बाद secondary verification के लिए आपके Authenticator App का current OTP दर्ज करना अनिवार्य है।',
              en: 'Multi-factor authentication is required. Enter the temporary passcode from your authenticator app.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-medium">
              <span className="text-xs font-black text-rose-600 uppercase tracking-wide block">⚠️ {item.err}</span>
              <p className="text-xs text-slate-600 leading-normal">
                {lang === 'hi' ? item.hi : item.en}
              </p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 15,
      category: 'contact',
      titleHi: '15. अभी भी Login नहीं हो रहा है? (Contact Help & Support)',
      titleEn: '15. Still cannot log in? Contact Technical Support',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed font-medium">
          <p>
            {lang === 'hi'
              ? 'यदि उपरोक्त सभी समाधानों के बाद भी आप लॉगिन नहीं कर पा रहे हैं, तो तुरंत नीचे दिए गए माध्यमों का उपयोग करें:'
              : 'If none of the above troubleshooting answers solve your access issue, kindly contact support via:'}
          </p>
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2">
            <p className="text-xs sm:text-sm text-indigo-900 font-extrabold">
              {lang === 'hi' 
                ? '🏫 अपने School/College के Galaxy ERP Administrator से संपर्क करें।' 
                : '🏫 Reach out to your School/College Technical Helpdesk or ERP Administrator.'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi'
                ? 'सत्र ब्लॉक होना, मोबाइल नंबर बदलना, पासवर्ड बदलना, या नया रजिस्ट्रेशन कराने जैसी सभी समस्याओं का समाधान आपके स्कूल के अधिकृत ERP एडमिनिस्ट्रेटर द्वारा ही किया जा सकता है।'
                : 'Mobile number updates, role changes, manually unlocking sessions, or updating institutional IDs are managed directly by your local school authorized ERP admin.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a 
              href="mailto:support@galaxyerp.edu" 
              className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-black text-slate-700 transition"
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>support@galaxyerp.edu</span>
            </a>
            <div className="text-xs text-slate-400 font-bold">
              {lang === 'hi' ? 'सपोर्ट रिस्पांस टाइम: < 12 घंटे' : 'Support Response Time: < 12 Hours'}
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = faq.titleHi.toLowerCase().includes(searchLower) || 
                          faq.titleEn.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="login-help-page" className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Back Button */}
        <button
          id="back-to-login-from-help"
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs rounded-full shadow-md cursor-pointer transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>{lang === 'hi' ? '← लॉगिन पर वापस जाएं' : '← Back to Login'}</span>
        </button>

        {/* Language Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 self-end sm:self-auto shadow-md">
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`px-3 py-1.5 rounded-full text-xs font-black tracking-wide transition ${
              lang === 'hi' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिंदी में देखें
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-full text-xs font-black tracking-wide transition ${
              lang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English Guide
          </button>
        </div>
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-5 md:p-8 space-y-6"
      >
        {/* Branding & Subtitle */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            {lang === 'hi' ? 'Login Help & Support' : 'Login Help & Support'}
          </h1>
          <p className="text-sm md:text-base font-bold text-slate-500">
            {lang === 'hi' 
              ? 'Galaxy ERP में सुरक्षित रूप से login करने के सभी तरीके और समस्याओं का समाधान' 
              : 'All secure login methods and troubleshooting steps for Galaxy ERP'}
          </p>
        </div>

        {/* Search Bar & Categories Navigation */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              id="help-search"
              type="text"
              placeholder={lang === 'hi' ? 'मदद के लिए खोजें (जैसे: OTP, Password, MFA)...' : 'Search help topic (e.g. OTP, Password, MFA)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer border ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'hi' ? cat.labelHi : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = expandedItems[faq.id] || false;
              return (
                <div 
                  key={faq.id} 
                  id={`faq-item-${faq.id}`}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'border-indigo-200 bg-indigo-50/10 shadow-sm shadow-indigo-500/5' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="font-extrabold text-sm md:text-base text-slate-800 tracking-tight select-none">
                      {lang === 'hi' ? faq.titleHi : faq.titleEn}
                    </span>
                    <span className="shrink-0 p-1.5 rounded-lg bg-slate-100 text-slate-500 transition">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                          {faq.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-2 border border-dashed border-slate-200 rounded-3xl">
              <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-500">
                {lang === 'hi' ? 'कोई सहायता विषय नहीं मिला।' : 'No help topic found.'}
              </p>
              <p className="text-xs font-semibold text-slate-400">
                {lang === 'hi' ? 'कृपया अन्य keywords जैसे: OTP, password या login का प्रयास करें।' : 'Please try other keywords such as OTP, password or login.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer info box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Galaxy ERP Ingress Gateway Security</span>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {lang === 'hi'
                ? 'यह सहायता पृष्ठ केवल प्रमाणीकरण और तकनीकी समस्याओं के मार्गदर्शन के लिए है। सभी लॉगिन क्रेडेंशियल सुरक्षित और एन्क्रिप्टेड प्रोटोकॉल का उपयोग करके सीधे आपके सत्यापित डेटाबेस सर्वर पर संसाधित किए जाते हैं।'
                : 'This guide is for authentication and login troubleshooting. All credentials are encrypted and processed directly on secure servers via compliant enterprise pathways.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
