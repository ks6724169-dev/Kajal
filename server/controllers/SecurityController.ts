import { Request, Response } from 'express';
import { AuthenticationEngine } from '../services/AuthenticationEngine.js';
import { MFAEngine } from '../services/MFAEngine.js';
import { DeviceTrustEngine } from '../services/DeviceTrustEngine.js';
import { ZeroTrustEngine } from '../services/ZeroTrustEngine.js';
import { SecurityAnalyticsEngine } from '../services/SecurityAnalyticsEngine.js';
import { z } from 'zod';
import { 
  LoginSchema, 
  MFAVerifySchema, 
  DeviceTrustSchema 
} from '../validators/SecurityValidator.js';

export class SecurityController {
  
  static async login(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string || '00000000-0000-0000-0000-000000000001';
      const validatedData = LoginSchema.parse(req.body);
      const ip = req.ip || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      const zeroTrust = new ZeroTrustEngine(tenantId);
      const riskScore = await zeroTrust.evaluateRequestRisk('pending-user-id', ip, validatedData.device_identifier || '');
      
      if (riskScore > 80) {
        return res.status(403).json({ error: 'High risk login attempt blocked' });
      }

      const engine = new AuthenticationEngine(tenantId);
      const auth = await engine.login(validatedData.identity, validatedData.password, ip, userAgent);
      
      res.status(200).json(auth);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async verifyMFA(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user?.tenant_id || '00000000-0000-0000-0000-000000000001';
      const validatedData = MFAVerifySchema.parse(req.body);
      
      const engine = new MFAEngine(tenantId);
      const isValid = await engine.verifyMFA(validatedData.user_id, validatedData.code);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid MFA Code' });
      }
      
      res.status(200).json({ status: 'MFA_VERIFIED' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async trustDevice(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = DeviceTrustSchema.parse(req.body);
      
      const engine = new DeviceTrustEngine(tenantId);
      const device = await engine.trustDevice(userId, validatedData.device_identifier, validatedData.device_name);
      
      res.status(201).json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async analyzeRisk(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = req.params.userId;
      
      const engine = new SecurityAnalyticsEngine(tenantId);
      const analysis = await engine.analyzeLoginPatterns(userId);
      
      res.status(200).json(analysis);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
