import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

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
