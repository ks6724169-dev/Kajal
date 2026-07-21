import express from 'express';

const router = express.Router();

const STATISTICS = {
  schools: 500,
  students: 250000,
  teachers: 15000,
  attendance: 98,
  transactions: '₹50Cr+',
  countries: 5,
  satisfaction: 4.9,
  rating: 4.8
};

const OFFICES = [
  { id: 'hq', name: 'India Headquarters', location: 'Cyber City, Gurgaon, Haryana', phone: '+91 124 4567 890', email: 'hq@galaxy-erp.com', type: 'HQ' },
  { id: 'regional', name: 'Regional Office', location: 'Hitech City, Hyderabad, Telangana', phone: '+91 40 4567 890', email: 'south@galaxy-erp.com', type: 'Regional' },
  { id: 'rd', name: 'R&D Center', location: 'Electronic City, Bengaluru, Karnataka', phone: '+91 80 4567 890', email: 'lab@galaxy-erp.com', type: 'R&D' }
];

const TESTIMONIALS = [
  { id: 1, name: 'Dr. Sarah Wilson', role: 'Principal', institution: 'Greenwood International', content: 'Galaxy ERP transformed our administrative workflow. The AI insights are game-changing.', rating: 5 },
  { id: 2, name: 'Mr. Rajesh Kumar', role: 'Director', institution: 'Apex Group of Schools', content: 'The implementation support was exceptional. Highly recommended for multi-campus management.', rating: 5 }
];

const SUPPORT_OPTIONS = [
  { id: 'sales', label: 'Sales Team', desc: 'Talk to Product Expert', icon: 'UserCheck' },
  { id: 'tech', label: 'Technical Support', desc: 'Raise Ticket / Live Chat', icon: 'LifeBuoy' },
  { id: 'success', label: 'Customer Success', desc: 'Training & Migration', icon: 'Star' },
  { id: 'partner', label: 'Partnership', desc: 'Reseller Program', icon: 'Handshake' }
];

router.get('/statistics', (req, res) => res.json(STATISTICS));
router.get('/offices', (req, res) => res.json(OFFICES));
router.get('/testimonials', (req, res) => res.json(TESTIMONIALS));
router.get('/support-options', (req, res) => res.json(SUPPORT_OPTIONS));

router.post('/message', (req, res) => {
  console.log('Contact Message Received:', req.body);
  res.json({ status: 'ok', message: 'Message sent successfully' });
});

router.post('/demo-booking', (req, res) => {
  console.log('Demo Booking Received:', req.body);
  res.json({ status: 'ok', message: 'Demo booked successfully' });
});

router.post('/ticket', (req, res) => {
  console.log('Support Ticket Created:', req.body);
  res.json({ status: 'ok', ticketId: 'GXY-' + Math.floor(1000 + Math.random() * 9000) });
});

router.post('/callback', (req, res) => {
  console.log('Callback Requested:', req.body);
  res.json({ status: 'ok', message: 'We will call you back shortly' });
});

export default router;
