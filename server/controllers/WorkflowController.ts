import { Request, Response } from 'express';
import { WorkflowEngine } from '../services/WorkflowEngine.js';
import { ApprovalEngine } from '../services/ApprovalEngine.js';
import { TaskEngine } from '../services/TaskEngine.js';
import { WorkflowService } from '../services/WorkflowService.js';
import { WorkflowAnalyticsEngine } from '../services/WorkflowAnalyticsEngine.js';
import { z } from 'zod';
import { 
  WorkflowSchema, 
  WorkflowStartSchema, 
  ApprovalSchema, 
  TaskCompletionSchema,
  DelegateSchema 
} from '../validators/WorkflowValidator.js';

export class WorkflowController {
  
  static async createWorkflow(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const validatedData = WorkflowSchema.parse(req.body);
      
      const engine = new WorkflowEngine(tenantId);
      const workflow = await engine.createWorkflow(validatedData, userId);
      
      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async publishWorkflow(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const versionId = req.params.versionId;
      const currentVersion = req.body.version;
      
      const engine = new WorkflowEngine(tenantId);
      const workflow = await engine.publishWorkflow(versionId, currentVersion, userId);
      
      res.status(200).json(workflow);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async startWorkflow(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const versionId = req.params.versionId;
      const validatedData = WorkflowStartSchema.parse(req.body);
      
      const engine = new WorkflowEngine(tenantId);
      const instance = await engine.startWorkflow(versionId, validatedData.entity_type, validatedData.entity_id, userId);
      
      res.status(201).json(instance);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async approve(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const approvalId = req.params.approvalId;
      const currentVersion = req.body.version;
      const validatedData = ApprovalSchema.parse(req.body);
      
      const engine = new ApprovalEngine(tenantId);
      const approval = await engine.approve(approvalId, currentVersion, validatedData.comments, userId);
      
      res.status(200).json(approval);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async reject(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const approvalId = req.params.approvalId;
      const currentVersion = req.body.version;
      const validatedData = ApprovalSchema.parse(req.body);
      
      const engine = new ApprovalEngine(tenantId);
      const approval = await engine.reject(approvalId, currentVersion, validatedData.comments, userId);
      
      res.status(200).json(approval);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async delegate(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const approvalId = req.params.approvalId;
      const currentVersion = req.body.version;
      const validatedData = DelegateSchema.parse(req.body);
      
      const engine = new ApprovalEngine(tenantId);
      const approval = await engine.delegate(approvalId, currentVersion, validatedData.delegate_to_id, validatedData.comments, userId);
      
      res.status(200).json(approval);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async completeTask(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const userId = (req as any).user.id;
      const taskId = req.params.taskId;
      const currentVersion = req.body.version;
      const validatedData = TaskCompletionSchema.parse(req.body);
      
      const engine = new TaskEngine(tenantId);
      const task = await engine.completeTask(taskId, currentVersion, validatedData.outcome, validatedData.comments, userId);
      
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async escalate(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      const instanceId = req.params.instanceId;
      const reason = req.body.reason;
      
      const service = new WorkflowService(tenantId);
      const result = await service.escalateInstance(instanceId, reason);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getAnalytics(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenant_id;
      
      const engine = new WorkflowAnalyticsEngine(tenantId);
      const bottlenecks = await engine.detectBottlenecks();
      
      res.status(200).json({ bottlenecks });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
