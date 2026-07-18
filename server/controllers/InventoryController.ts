import { Request, Response } from 'express';
import { inventoryService } from '../services/InventoryService.js';
import { procurementEngine } from '../services/ProcurementEngine.js';
import { inventoryAnalyticsEngine } from '../services/InventoryAnalyticsEngine.js';
import {
  AssetSchema, AssetAssignmentSchema, InventoryItemSchema, VendorSchema,
  PurchaseRequestSchema, PurchaseOrderSchema, StockMovementSchema
} from '../validators/InventoryValidator.js';

export class InventoryController {
  public async registerAsset(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = AssetSchema.parse(req.body);
      const result = await inventoryService.registerAsset(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async assignAsset(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = AssetAssignmentSchema.parse(req.body);
      const result = await inventoryService.assignAsset(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async registerInventoryItem(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = InventoryItemSchema.parse(req.body);
      const result = await inventoryService.registerInventoryItem(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async registerVendor(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = VendorSchema.parse(req.body);
      const result = await inventoryService.registerVendor(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async createPurchaseRequest(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const requestedBy = user.id;
      const data = PurchaseRequestSchema.parse(req.body);
      const result = await procurementEngine.createPurchaseRequest(tenantId, requestedBy, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async createPurchaseOrder(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = PurchaseOrderSchema.parse(req.body);
      const result = await procurementEngine.createPurchaseOrder(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async receiveGoods(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const receivedBy = user.id;
      const data = req.body; // In practice, validate GoodsReceiptSchema
      const result = await procurementEngine.receiveGoods(tenantId, receivedBy, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async moveStock(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const data = StockMovementSchema.parse(req.body);
      const result = await inventoryService.moveStock(tenantId, data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async getLowStockPrediction(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const result = await inventoryAnalyticsEngine.getLowStockPrediction(tenantId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  public async getPurchaseForecast(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const tenantId = user.tenant_id;
      const result = await inventoryAnalyticsEngine.getPurchaseForecast(tenantId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}

export const inventoryController = new InventoryController();
