import express from 'express';

const router = express.Router();

const CATEGORIES = [
  { id: 'getting-started', name: 'Getting Started', icon: 'Rocket' },
  { id: 'installation', name: 'Installation', icon: 'Download' },
  { id: 'school-registration', name: 'School Registration', icon: 'School' },
  { id: 'owner-guide', name: 'School Owner Guide', icon: 'User' },
  { id: 'principal-guide', name: 'Principal Guide', icon: 'Shield' },
  { id: 'teacher-guide', name: 'Teacher Guide', icon: 'Users' },
  { id: 'student-guide', name: 'Student Guide', icon: 'GraduationCap' },
  { id: 'parent-guide', name: 'Parent Guide', icon: 'Heart' },
  { id: 'fee-management', name: 'Fee Management', icon: 'IndianRupee' },
  { id: 'attendance', name: 'Attendance', icon: 'Calendar' },
  { id: 'examination', name: 'Examination', icon: 'FileText' },
  { id: 'transport', name: 'Transport', icon: 'Truck' },
  { id: 'library', name: 'Library', icon: 'Book' },
  { id: 'hostel', name: 'Hostel', icon: 'Home' },
  { id: 'hr-payroll', name: 'HR & Payroll', icon: 'Briefcase' },
  { id: 'galaxy-ai', name: 'Galaxy AI', icon: 'BrainCircuit' },
  { id: 'api-integrations', name: 'API & Integrations', icon: 'Link' },
  { id: 'security', name: 'Security', icon: 'Lock' },
  { id: 'reports-analytics', name: 'Reports & Analytics', icon: 'BarChart' },
  { id: 'mobile-app', name: 'Mobile App', icon: 'Smartphone' },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: 'HelpCircle' },
  { id: 'release-notes', name: 'Release Notes', icon: 'Clipboard' }
];

const ARTICLES = [
  {
    id: 'how-to-register-school',
    category: 'school-registration',
    title: 'How to Register your School',
    description: 'A step-by-step guide to onboarding your institution on Galaxy ERP.',
    content: '## Overview\nRegistration is the first step towards transforming your school...',
    readingTime: '5 min',
    version: '2.4.0',
    lastUpdated: '2024-03-20'
  },
  {
    id: 'quick-start-guide',
    category: 'getting-started',
    title: 'Quick Start Guide',
    description: 'Get up and running with Galaxy ERP in less than 30 minutes.',
    content: '## Introduction\nWelcome to Galaxy ERP...',
    readingTime: '10 min',
    version: '2.4.0',
    lastUpdated: '2024-03-15'
  }
];

const VIDEOS = [
  { id: 'v1', title: 'Setup Tutorial', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60' },
  { id: 'v2', title: 'Owner Tutorial', duration: '08:20', thumbnail: 'https://images.unsplash.com/photo-1454165833767-027ffeb996be?w=800&auto=format&fit=crop&q=60' },
  { id: 'v3', title: 'Teacher Tutorial', duration: '15:10', thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60' }
];

const RELEASES = [
  { version: 'v2.4.0', date: '2024-03-20', type: 'Major', features: ['Galaxy AI Principal Assistant', 'New Attendance Dashboard'], fixes: ['Linter errors fixed', 'Optimized image loading'] },
  { version: 'v2.3.5', date: '2024-02-15', type: 'Minor', features: ['WhatsApp Integration Beta'], fixes: ['Bug fixes in payroll calculation'] }
];

const FAQ = [
  { q: 'How do I register school?', a: 'Go to the registration portal and fill in your institution details.' },
  { q: 'How do I admit students?', a: 'Navigate to Student Management > Admission and enter student details.' },
  { q: 'Is my data secure?', a: 'Yes, we use enterprise-grade encryption and dedicated cloud storage.' }
];

router.get('/categories', (req, res) => res.json(CATEGORIES));
router.get('/articles', (req, res) => res.json(ARTICLES));
router.get('/search', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase();
  const results = ARTICLES.filter(a => a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query));
  res.json(results);
});
router.get('/videos', (req, res) => res.json(VIDEOS));
router.get('/releases', (req, res) => res.json(RELEASES));
router.get('/faq', (req, res) => res.json(FAQ));
router.post('/feedback', (req, res) => res.json({ status: 'ok', message: 'Feedback received' }));

export default router;
