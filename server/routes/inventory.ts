import { Router } from 'express';
import { inventoryController } from '../controllers/InventoryController.js';
import { requireAuth, requireRole, requireTenant } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.use(requireTenant);

// Asset Management
router.post('/assets', requireRole(['Inventory Manager', 'Store Manager', 'Super Admin']), inventoryController.registerAsset);
router.post('/assets/assign', requireRole(['Inventory Manager', 'Super Admin']), inventoryController.assignAsset);

// Inventory Management
router.post('/items', requireRole(['Inventory Manager', 'Store Manager', 'Super Admin']), inventoryController.registerInventoryItem);
router.post('/stock/move', requireRole(['Store Manager', 'Inventory Manager', 'Super Admin']), inventoryController.moveStock);

// Procurement & Vendors
router.post('/vendors', requireRole(['Purchase Officer', 'Accountant', 'Super Admin']), inventoryController.registerVendor);
router.post('/purchase-requests', requireRole(['Purchase Officer', 'Principal', 'Super Admin']), inventoryController.createPurchaseRequest);
router.post('/purchase-orders', requireRole(['Purchase Officer', 'Super Admin']), inventoryController.createPurchaseOrder);
router.post('/goods-receipt', requireRole(['Store Manager', 'Inventory Manager', 'Super Admin']), inventoryController.receiveGoods);

// Analytics
router.get('/analytics/low-stock', requireRole(['Inventory Manager', 'Purchase Officer', 'Principal', 'Super Admin']), inventoryController.getLowStockPrediction);
router.get('/analytics/purchase-forecast', requireRole(['Purchase Officer', 'Accountant', 'Principal', 'School Owner', 'Super Admin']), inventoryController.getPurchaseForecast);

export default router;
