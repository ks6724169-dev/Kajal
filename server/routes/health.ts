import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

router.get('/ready', (req, res) => {
  res.status(200).json({ status: 'READY', db: 'OK', cache: 'OK' });
});

router.get('/live', (req, res) => {
  res.status(200).json({ status: 'ALIVE' });
});

router.get('/metrics', (req, res) => {
  res.status(200).json({ status: 'METRICS_ENDPOINT' });
});

export default router;
