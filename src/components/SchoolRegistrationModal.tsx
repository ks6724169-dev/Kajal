import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User, 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  ShieldCheck, 
  School, 
  FileText, 
  IndianRupee,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Narnaul", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
  "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Noklak", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundergarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Mohali", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashanker Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Lakshadweep": ["Lakshadweep"]
};

interface SchoolRegistrationModalProps {
  onClose: () => void;
  onSuccess: (schoolData: any) => void;
}

export const SchoolRegistrationModal: React.FC<SchoolRegistrationModalProps> = ({ onClose, onSuccess }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const [formData, setFormData] = useState({
    // Page 1: School Info
    schoolName: '',
    schoolCode: '',
    boardType: 'CBSE',
    schoolType: 'Co-Educational',
    establishedYear: '2010',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    website: '',
    
    // Page 2: Admin & Principal Info
    principalName: '',
    principalEmail: '',
    principalPhone: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    totalStudents: '1200',
    totalTeachers: '65',

    // Page 3: Plan & Billing
    selectedPlan: 'Standard ERP',
    billingCycle: 'Annual',
    addons: [] as string[],

    // Page 4: Documents
    affiliationCert: null as File | null,
    principalId: null as File | null,
    panCard: null as File | null,

    // Page 5: Terms
    agreeTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white w-full h-full flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 relative flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">School & College Registration Portal</h2>
              <p className="text-xs text-indigo-200 mt-0.5">Register your institution on Galaxy ERP in 5 simple steps</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Steps Header */}
        {!isSuccess && (
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center justify-between max-w-2xl mx-auto mb-2">
              {[
                { step: 1, label: 'School Info' },
                { step: 2, label: 'Administration' },
                { step: 3, label: 'Subscription' },
                { step: 4, label: 'Documents' },
                { step: 5, label: 'Review & Submit' }
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentPage === s.step 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-100' 
                      : currentPage > s.step 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentPage > s.step ? <Check className="w-5 h-5" /> : s.step}
                  </div>
                  <span className={`text-[11px] font-medium mt-1.5 hidden sm:block ${currentPage === s.step ? 'text-indigo-900 font-bold' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Modal Body / Form Pages */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Thank You! Successfully Registered</h3>
                <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
                  Congratulations! <span className="font-semibold text-slate-800">{formData.schoolName || 'Your Institution'}</span> has been successfully registered. Please wait for a few days for your request approval. Our administrative team will verify your documents and activate your account.
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl max-w-md mx-auto text-left text-xs text-indigo-900 space-y-1">
                <p className="font-semibold">Next Steps:</p>
                <p>• Login credentials have been sent to <span className="font-semibold">{formData.adminEmail || 'admin email'}</span>.</p>
                <p>• Our onboarding specialist will contact you within 2 hours to set up biometric devices and student databases.</p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => {
                    onSuccess(formData);
                    onClose();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all"
                >
                  Proceed to ERP Dashboard
                </button>
              </div>
            </div>
          ) : (
                <div>
              {/* PAGE 1: School Information */}
              {currentPage === 1 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-5xl mx-auto my-2">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <School className="w-5 h-5 text-indigo-600" /> Page 1: School Basic Information
                    </h3>
                    <p className="text-xs text-slate-500">Provide official identity and location details of your institution.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">School / College Name *</label>
                      <input 
                        type="text" 
                        value={formData.schoolName}
                        onChange={(e) => handleInputChange('schoolName', e.target.value)}
                        placeholder="e.g. Delhi Public International School"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Affiliation / Board Code</label>
                      <input 
                        type="text" 
                        value={formData.schoolCode}
                        onChange={(e) => handleInputChange('schoolCode', e.target.value)}
                        placeholder="e.g. CBSE/2026/88921"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Board Type *</label>
                      <select 
                        value={formData.boardType}
                        onChange={(e) => handleInputChange('boardType', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                      >
                        <option value="CBSE">CBSE Board</option>
                        <option value="ICSE">ICSE / ISC Board</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">International Baccalaureate (IB)</option>
                        <option value="Cambridge">Cambridge Assessment</option>
                        <option value="University">State / Central University</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Institution Type *</label>
                      <select 
                        value={formData.schoolType}
                        onChange={(e) => handleInputChange('schoolType', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                      >
                        <option value="Co-Educational">Co-Educational School</option>
                        <option value="Boys Only">Boys Only School</option>
                        <option value="Girls Only">Girls Only School</option>
                        <option value="College">Degree College / University</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Established Year *</label>
                      <input 
                        type="number" 
                        value={formData.establishedYear}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                        placeholder="e.g. 1998"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Official Website (Optional)</label>
                      <input 
                        type="url" 
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://www.myschool.edu"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>

                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Campus Street Address *</label>
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="e.g. Sector 44, Institutional Area, Near Metro Station"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">State *</label>
                        <select 
                          value={formData.state}
                          onChange={(e) => {
                            const newState = e.target.value;
                            const districts = INDIAN_STATES_DISTRICTS[newState] || [];
                            setFormData(prev => ({
                              ...prev,
                              state: newState,
                              city: districts[0] || ''
                            }));
                          }}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                        >
                          {Object.keys(INDIAN_STATES_DISTRICTS).sort().map((stateName) => (
                            <option key={stateName} value={stateName}>{stateName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">District / City *</label>
                        <select 
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                        >
                          {(INDIAN_STATES_DISTRICTS[formData.state] || []).map((districtName) => (
                            <option key={districtName} value={districtName}>{districtName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">PIN Code *</label>
                        <input 
                          type="text" 
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="110001"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: Admin & Principal Information */}
              {currentPage === 2 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-5xl mx-auto my-2">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" /> Page 2: Administration & Principal Details
                    </h3>
                    <p className="text-xs text-slate-500">Provide contact information for the Principal and IT/ERP Administrator.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" /> Principal / Director Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Principal Name *</label>
                          <input 
                            type="text" 
                            value={formData.principalName}
                            onChange={(e) => handleInputChange('principalName', e.target.value)}
                            placeholder="Dr. Rajesh Sharma"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Principal Email *</label>
                          <input 
                            type="email" 
                            value={formData.principalEmail}
                            onChange={(e) => handleInputChange('principalEmail', e.target.value)}
                            placeholder="principal@school.edu"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Principal Mobile *</label>
                          <input 
                            type="tel" 
                            value={formData.principalPhone}
                            onChange={(e) => handleInputChange('principalPhone', e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" /> Primary ERP Administrator Account
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Admin Contact Name *</label>
                          <input 
                            type="text" 
                            value={formData.adminName}
                            onChange={(e) => handleInputChange('adminName', e.target.value)}
                            placeholder="Amit Verma (IT Head)"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Admin Email (Login ID) *</label>
                          <input 
                            type="email" 
                            value={formData.adminEmail}
                            onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                            placeholder="admin@school.edu"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">Admin Mobile Number *</label>
                          <input 
                            type="tel" 
                            value={formData.adminPhone}
                            onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                            placeholder="+91 91234 56789"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Total Student Strength *</label>
                        <input 
                          type="number" 
                          value={formData.totalStudents}
                          onChange={(e) => handleInputChange('totalStudents', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Total Teachers / Staff *</label>
                        <input 
                          type="number" 
                          value={formData.totalTeachers}
                          onChange={(e) => handleInputChange('totalTeachers', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 3: Subscription Plan Selection */}
              {currentPage === 3 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-5xl mx-auto my-2">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" /> Page 3: Subscription & Billing Plan
                    </h3>
                    <p className="text-xs text-slate-500">Choose the right Galaxy ERP tier suited for your student strength.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Starter ERP', students: 'Up to 500 Students', price: '₹24,999', period: '/year', desc: 'Essential fees, attendance & student records.' },
                      { name: 'Standard ERP', students: 'Up to 2,000 Students', price: '₹49,999', period: '/year', popular: true, desc: 'Includes AI Hub, biometric sync & parent app.' },
                      { name: 'Enterprise Cloud', students: 'Unlimited Students', price: '₹99,999', period: '/year', desc: 'Dedicated server, CCTV AI & multi-campus support.' }
                    ].map((plan, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleInputChange('selectedPlan', plan.name)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                          formData.selectedPlan === plan.name 
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                            Most Popular
                          </span>
                        )}
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{plan.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{plan.students}</p>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-indigo-950">{plan.price}</span>
                            <span className="text-xs text-slate-500">{plan.period}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{plan.desc}</p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-indigo-600">Select Plan</span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            formData.selectedPlan === plan.name ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                          }`}>
                            {formData.selectedPlan === plan.name && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 space-y-1">
                      <p className="font-semibold">Special Educational Discount Applied!</p>
                      <p>All registered schools receive 50% discount for the first year under the Digital India Education Initiative. Taxes extra as applicable.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 4: Document Uploads */}
              {currentPage === 4 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-5xl mx-auto my-2">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-indigo-600" /> Page 4: Verification Document Uploads
                    </h3>
                    <p className="text-xs text-slate-500">Upload official institutional identity documents for fast-track verification.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'School Affiliation / Board Certificate', key: 'affiliationCert' },
                      { title: 'Principal ID Proof (Aadhaar / PAN)', key: 'principalId' },
                      { title: 'Institution PAN / Trust Certificate', key: 'panCard' }
                    ].map((doc, idx) => (
                      <div key={idx} className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center bg-slate-50 transition-colors flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{doc.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 10MB</p>
                        </div>
                        <label className="cursor-pointer bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm">
                          Browse File
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleInputChange(doc.key, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                        {formData[doc.key as keyof typeof formData] && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                            <Check className="w-3.5 h-3.5" /> {(formData[doc.key as keyof typeof formData] as File).name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAGE 5: Review & Submit */}
              {currentPage === 5 && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-5xl mx-auto my-2">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" /> Page 5: Review Registration Details
                    </h3>
                    <p className="text-xs text-slate-500">Please review your submitted information before final registration.</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Institution Name</span>
                        <span className="font-bold text-slate-800">{formData.schoolName || 'Not Provided'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Board & Type</span>
                        <span className="font-bold text-slate-800">{formData.boardType} ({formData.schoolType})</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Principal Name</span>
                        <span className="font-bold text-slate-800">{formData.principalName || 'Not Provided'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Admin Email (Login)</span>
                        <span className="font-bold text-slate-800">{formData.adminEmail || 'Not Provided'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Location</span>
                        <span className="font-bold text-slate-800">{formData.city}, {formData.state} - {formData.pincode}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Selected Subscription Plan</span>
                        <span className="font-bold text-indigo-600">{formData.selectedPlan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={formData.agreeTerms}
                      onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-600 select-none">
                      I hereby declare that all information provided is accurate and authentic. I am authorized to register this institution on Galaxy ERP and agree to the <span className="text-indigo-600 underline font-semibold">Terms of Service</span> and <span className="text-indigo-600 underline font-semibold">Privacy Policy</span>. *
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isSuccess && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
            {currentPage > 1 ? (
              <button
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div></div>
            )}

            {currentPage < totalPages ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.agreeTerms || isSubmitting}
                className={`px-8 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg transition ${
                  formData.agreeTerms && !isSubmitting
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    : 'bg-slate-300 cursor-not-allowed shadow-none'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering School...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
