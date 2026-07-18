import { describe, it, expect, beforeAll } from 'vitest';
import { inventoryService } from '../services/InventoryService.js';
import { procurementEngine } from '../services/ProcurementEngine.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { dbManager } from '../database/dbClient.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('EAIPSMP - Phase 03.2N', () => {
  let assetId: string;
  let itemId: string;
  let vendorId: string;
  let purchaseRequestId: string;
  let purchaseOrderId: string;
  let employeeId = uuidv4();

  beforeAll(async () => {
    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '015_inventory_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);
  });

  it('1. should register a new asset', async () => {
    const data = {
      assetName: 'Dell XPS 15',
      assetCode: 'AST-LPT-001',
      purchaseDate: '2025-01-01',
      purchaseCost: 1500
    };
    const asset = await inventoryService.registerAsset(tenantId, data);
    expect(asset).toBeDefined();
    expect(asset.assetCode).toBe('AST-LPT-001');
    assetId = asset.id;
  });

  it('2. should assign asset to an employee', async () => {
    const data = {
      assetId,
      assignedTo: employeeId,
      assignedDate: '2025-01-10',
      conditionOnAssignment: 'New'
    };
    const assignment = await inventoryService.assignAsset(tenantId, data);
    expect(assignment).toBeDefined();
    expect(assignment.assignedTo).toBe(employeeId);
  });

  it('3. should register inventory item', async () => {
    const data = {
      itemName: 'A4 Printer Paper',
      itemCode: 'INV-PAP-001',
      uom: 'Box',
      reorderLevel: 10,
      unitPrice: 25.50
    };
    const item = await inventoryService.registerInventoryItem(tenantId, data);
    expect(item).toBeDefined();
    expect(item.itemCode).toBe('INV-PAP-001');
    itemId = item.id;
  });

  it('4. should register vendor', async () => {
    const data = {
      vendorName: 'Office Supplies Co.',
      taxNumber: 'TAX123456'
    };
    const vendor = await inventoryService.registerVendor(tenantId, data);
    expect(vendor).toBeDefined();
    expect(vendor.vendorName).toBe('Office Supplies Co.');
    vendorId = vendor.id;
  });

  it('5. should create purchase request', async () => {
    const data = {
      requestDate: '2025-02-01',
      department: 'Admin',
      totalEstimatedAmount: 255.00
    };
    const req = await procurementEngine.createPurchaseRequest(tenantId, employeeId, data);
    expect(req).toBeDefined();
    expect(req.approvalStatus).toBe('PENDING');
    purchaseRequestId = req.id;
  });

  it('6. should create purchase order', async () => {
    const data = {
      vendorId,
      purchaseRequestId,
      orderDate: '2025-02-05',
      totalAmount: 255.00
    };
    const po = await procurementEngine.createPurchaseOrder(tenantId, data);
    expect(po).toBeDefined();
    expect(parseFloat(po.totalAmount)).toBe(255);
    purchaseOrderId = po.id;
  });

  it('7. should process goods receipt', async () => {
    const data = {
      purchaseOrderId,
      receiptDate: '2025-02-10',
      deliveryNoteNumber: 'DN-9988'
    };
    const gr = await procurementEngine.receiveGoods(tenantId, employeeId, data);
    expect(gr).toBeDefined();
    expect(gr.purchaseOrderId).toBe(purchaseOrderId);
  });

  it('8. should record stock movement', async () => {
    const data = {
      itemId,
      quantity: 10,
      movementType: 'IN'
    };
    const move = await inventoryService.moveStock(tenantId, data);
    expect(move).toBeDefined();
    expect(move.movementType).toBe('IN');
  });
});
