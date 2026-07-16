import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/sessions/active
router.get('/active', requireAuth, async (req, res) => {
  const authReq = req as any;
  const userId = authReq.user.id;
  // MOCK DB QUERY: SELECT * FROM public.user_sessions WHERE user_id = $1 AND is_active = true
  res.json({ sessions: [] });
});

// POST /api/sessions/:sessionId/revoke
router.post('/:sessionId/revoke', requireAuth, async (req, res) => {
  const sessionId = req.params.sessionId;
  // MOCK DB QUERY: UPDATE public.user_sessions SET is_active = false, revoked_at = NOW() WHERE id = $1
  res.json({ status: 'ok', message: 'Session revoked' });
});

// GET /api/sessions/devices
router.get('/devices', requireAuth, async (req, res) => {
  const authReq = req as any;
  const userId = authReq.user.id;
  // MOCK DB QUERY: SELECT * FROM public.trusted_devices WHERE user_id = $1
  res.json({ devices: [] });
});

export default router;
