import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/roles
router.get('/', requireAuth, requireRole(['super_admin', 'school_owner']), async (req, res) => {
  const authReq = req as any;
  // MOCK DB QUERY: SELECT * FROM public.role_registry WHERE tenant_id = $1 OR is_system_role = true
  res.json({ roles: [] });
});

// POST /api/roles
router.post('/', requireAuth, requireRole(['super_admin']), async (req, res) => {
  const { role_code, role_name, description } = req.body;
  // MOCK DB QUERY: INSERT INTO public.role_registry ...
  res.status(201).json({ status: 'ok', message: 'Role created (mock)' });
});

// GET /api/permissions
router.get('/permissions', requireAuth, requireRole(['super_admin']), async (req, res) => {
  // MOCK DB QUERY: SELECT * FROM public.permission_registry
  res.json({ permissions: [] });
});

export default router;
