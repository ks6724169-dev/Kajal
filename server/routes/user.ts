import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/users
router.get('/', requireAuth, async (req, res) => {
  const authReq = req as any;
  const tenantId = authReq.user.tenant_id;
  // MOCK DB QUERY: SELECT * FROM public.universal_user WHERE tenant_id = $1
  res.json({ users: [] });
});

// POST /api/users
router.post('/', requireAuth, requireRole(['super_admin', 'school_owner', 'principal', 'hr']), async (req, res) => {
  const { email, phone, user_type } = req.body;
  // MOCK DB QUERY: INSERT INTO public.universal_user ...
  res.status(201).json({ status: 'ok', message: 'User created (mock)' });
});

// GET /api/users/:id/roles
router.get('/:id/roles', requireAuth, async (req, res) => {
  const userId = req.params.id;
  // MOCK DB QUERY: SELECT r.* FROM public.role_registry r JOIN public.user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1
  res.json({ roles: [] });
});

// POST /api/users/:id/roles
router.post('/:id/roles', requireAuth, requireRole(['super_admin', 'school_owner']), async (req, res) => {
  const userId = req.params.id;
  const { role_id, organization_id, campus_id } = req.body;
  // MOCK DB QUERY: INSERT INTO public.user_roles ...
  res.status(201).json({ status: 'ok', message: 'Role assigned (mock)' });
});

export default router;
