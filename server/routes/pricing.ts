import express from 'express';

const router = express.Router();

const PRICING_DATA = {
  tiers: [100, 200, 500, 1000, 2000, 3000, 4000, 5000],
  plans: [
    {
      id: 'silver',
      name: 'Silver',
      badge: 'Smart School',
      suitableFor: 'Small & Medium Schools',
      prices: {
        100: 499,
        200: 899,
        500: 1999,
        1000: 3499,
        2000: 5999,
        3000: 7999,
        4000: 9999,
        5000: 11999
      },
      features: [
        'Student Management',
        'Teacher Management',
        'Parent Management',
        'Attendance',
        'Timetable',
        'Homework',
        'Fee Management',
        'Exam & Report Card',
        'Mobile App',
        'Notifications',
        'School Website',
        'Basic AI Search',
        'Cloud Backup'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      badge: '⭐ MOST POPULAR',
      suitableFor: 'Growing Schools',
      isPopular: true,
      prices: {
        100: 999,
        200: 1799,
        500: 3999,
        1000: 6999,
        2000: 11999,
        3000: 15999,
        4000: 19999,
        5000: 23999
      },
      features: [
        'Everything in Silver plus',
        'Parent Portal',
        'Teacher Portal',
        'Student Portal',
        'Online Admission',
        'Online Fee Payment',
        'WhatsApp Integration',
        'GPS Transport',
        'Library',
        'Hostel',
        'Inventory',
        'HR & Payroll',
        'AI Teacher Assistant',
        'AI Attendance Analysis',
        'AI Report Generator',
        'Custom Branding',
        'Advanced Analytics'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum',
      badge: 'Enterprise AI',
      suitableFor: 'Large Schools, Colleges & Universities',
      prices: {
        100: 1999,
        200: 3499,
        500: 7999,
        1000: 12999,
        2000: 19999,
        3000: 26999,
        4000: 32999,
        5000: 38999
      },
      features: [
        'Everything in Gold plus',
        'Galaxy AI Assistant',
        'AI Principal Assistant',
        'AI Management Dashboard',
        'AI Finance Assistant',
        'AI Student Performance Prediction',
        'AI Weak Student Detection',
        'AI Timetable Generator',
        'AI Lesson Planner',
        'AI Question Paper Generator',
        'Multi Campus',
        'Multi Branch',
        'White Label',
        'API Marketplace',
        'Enterprise Security',
        'Dedicated Cloud',
        'Disaster Recovery',
        'Dedicated Success Manager',
        'Priority Support',
        'Unlimited Fair Usage'
      ]
    }
  ],
  setupFees: [
    { range: '100–1000 Students', fee: '₹2,000–₹5,000' },
    { range: '2000–5000 Students', fee: '₹10,000–₹20,000' }
  ],
  setupIncludes: [
    'Data Migration',
    'Training',
    'Server Setup',
    'Branding',
    'Go-Live Assistance'
  ]
};

router.get('/plans', (req, res) => {
  res.json(PRICING_DATA);
});

router.post('/calculate', (req, res) => {
  const { students, billingCycle } = req.body;
  const cycle = billingCycle === 'yearly' ? 12 : 1;
  const discount = billingCycle === 'yearly' ? (10 / 12) : 1; // 2 months free is ~16.6% off, but user said "Save 2 Months" so 10/12 pay

  const result = PRICING_DATA.plans.map(plan => {
    // @ts-ignore
    const basePrice = plan.prices[students] || plan.prices[5000];
    const finalPrice = Math.round(basePrice * cycle * (billingCycle === 'yearly' ? 10/12 : 1));
    
    return {
      id: plan.id,
      monthlyPrice: basePrice,
      totalPrice: finalPrice,
      billingCycle
    };
  });

  res.json(result);
});

router.get('/compare', (req, res) => {
  const comparison = [
    { feature: 'Student Management', silver: true, gold: true, platinum: true },
    { feature: 'Attendance', silver: true, gold: true, platinum: true },
    { feature: 'AI Features', silver: false, gold: true, platinum: true },
    { feature: 'Galaxy AI', silver: false, gold: false, platinum: true },
    { feature: 'WhatsApp', silver: false, gold: true, platinum: true },
    { feature: 'Library', silver: false, gold: true, platinum: true },
    { feature: 'Hostel', silver: false, gold: true, platinum: true },
    { feature: 'Payroll', silver: false, gold: true, platinum: true },
    { feature: 'Finance', silver: true, gold: true, platinum: true },
    { feature: 'Analytics', silver: false, gold: true, platinum: true },
    { feature: 'Transport', silver: false, gold: true, platinum: true },
    { feature: 'Multi Campus', silver: false, gold: false, platinum: true },
    { feature: 'White Label', silver: false, gold: false, platinum: true },
    { feature: 'Priority Support', silver: false, gold: false, platinum: true },
    { feature: 'API Access', silver: false, gold: false, platinum: true },
    { feature: 'Dedicated Cloud', silver: false, gold: false, platinum: true },
  ];
  res.json(comparison);
});

export default router;
