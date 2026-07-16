import { Router } from 'express';
import { v1Router } from './v1.js';
import { v2Router } from './v2.js';

export const gatewayRouter = Router();

// Versioning
gatewayRouter.use('/v1', v1Router);
gatewayRouter.use('/v2', v2Router);
