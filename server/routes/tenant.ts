import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/tenants/register - Public endpoint for School Registration
router.post('/register', async (req, res) => {
  try {
    const { 
      schoolName, schoolType, board, address, state, city, 
      email, mobile, principalName, ownerName, subscriptionPlan 
    } = req.body;

    // Validate request
    if (!schoolName || !email || !mobile || !ownerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Auto-generate IDs and configurations
    const tenantId = uuidv4();
    const ownerId = `OWN-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Generate School Code (e.g. GLX-NY-000001)
    const statePrefix = state ? state.substring(0, 2).toUpperCase() : 'XX';
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const schoolCode = `GLX-${statePrefix}-${randomCode}`;

    const newTenant = {
      tenant_id: tenantId,
      school_code: schoolCode,
      school_name: schoolName,
      owner_id: ownerId,
      school_type: schoolType || 'K-12',
      board: board || 'State Board',
      status: 'pending_verification',
      subscription_tier: subscriptionPlan || 'starter',
      created_at: new Date().toISOString()
    };

    // MOCK DB QUERY: INSERT INTO public.tenant_registry
    // MOCK DB QUERY: INSERT INTO public.universal_user (for owner)
    // Send Welcome Email / SMS (mock)

    res.status(201).json({
      status: 'success',
      message: 'School registration successful. Welcome credentials sent to email.',
      tenant: {
        tenantId,
        schoolCode,
        ownerId
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tenants/resolve/:schoolCode - Resolve tenant by school code
router.get('/resolve/:schoolCode', async (req, res) => {
  try {
    const { schoolCode } = req.params;
    
    // MOCK DB QUERY: SELECT * FROM public.tenant_registry WHERE school_code = $1
    // Simulate lookup
    if (!schoolCode || schoolCode.length < 3) {
      return res.status(404).json({ error: 'Invalid school code' });
    }

    const tenant = {
      tenantId: uuidv4(),
      schoolCode: schoolCode.toUpperCase(),
      name: 'Galaxy International School',
      logo: 'https://via.placeholder.com/150',
      themeColor: '#4f46e5',
      type: 'K-12',
      city: 'Metropolis',
      state: 'NY',
      academicYear: '2023-2024'
    };

    res.json({ tenant });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tenants - Super Admin only
router.get('/', requireAuth, requireRole(['super_admin']), async (req, res) => {
  // MOCK DB QUERY: SELECT * FROM public.tenant_registry
  res.json({ tenants: [] });
});

// POST /api/tenants - Create new tenant (Super Admin only)
router.post('/', requireAuth, requireRole(['super_admin']), async (req, res) => {
  const { tenant_name, tenant_code, subscription_tier } = req.body;
  // MOCK DB QUERY: INSERT INTO public.tenant_registry ...
  res.status(201).json({ status: 'ok', message: 'Tenant created (mock)', tenant_code });
});

// GET /api/tenants/:id/organizations - Get organizations for a tenant
router.get('/:id/organizations', requireAuth, async (req, res) => {
  const tenantId = req.params.id;
  // MOCK DB QUERY: SELECT * FROM public.organization_registry WHERE tenant_id = $1
  res.json({ organizations: [] });
});

// POST /api/tenants/:id/organizations - Create organization
router.post('/:id/organizations', requireAuth, requireRole(['super_admin', 'school_owner']), async (req, res) => {
  // MOCK DB QUERY: INSERT INTO public.organization_registry ...
  res.status(201).json({ status: 'ok', message: 'Organization created (mock)' });
});

// GET /api/tenants/:id/campuses - Get campuses for a tenant
router.get('/:id/campuses', requireAuth, async (req, res) => {
  const tenantId = req.params.id;
  // MOCK DB QUERY: SELECT * FROM public.campus_registry WHERE tenant_id = $1
  res.json({ campuses: [] });
});

// POST /api/tenants/:id/campuses - Create campus
router.post('/:id/campuses', requireAuth, requireRole(['super_admin', 'school_owner', 'principal']), async (req, res) => {
  // MOCK DB QUERY: INSERT INTO public.campus_registry ...
  res.status(201).json({ status: 'ok', message: 'Campus created (mock)' });
});

export default router;
