import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    tenant_id: string;
    role: string;
    organization_id?: string;
    campus_id?: string;
    [key: string]: any;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Access denied: No role assigned' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    next();
  };
};

export const requireTenant = (req: AuthRequest, res: Response, next: NextFunction) => {
  const requestedTenant = req.headers['x-tenant-id'] || req.params.tenantId || req.body.tenant_id;
  
  if (!req.user || !req.user.tenant_id) {
    return res.status(403).json({ error: 'Access denied: No tenant context' });
  }
  
  // Super admins can bypass tenant checks or we strictly enforce it
  if (req.user.role !== 'super_admin' && req.user.tenant_id !== requestedTenant) {
     return res.status(403).json({ error: 'Access denied: Tenant isolation violation' });
  }
  
  next();
};
