import { Router } from 'express';

export const v2Router = Router();

v2Router.get('/status', (req, res) => {
  res.json({ status: 'v2 active' });
});
