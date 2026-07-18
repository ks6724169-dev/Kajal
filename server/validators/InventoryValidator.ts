import { z } from 'zod';

export const AssetSchema = z.object({
  categoryId: z.string().uuid().optional(),
  assetName: z.string().min(1),
  assetCode: z.string().min(1),
  purchaseDate: z.string().date().optional(),
  purchaseCost: z.number().nonnegative().optional(),
  currentValue: z.number().nonnegative().optional(),
  barcode: z.string().optional(),
  serialNumber: z.string().optional()
});

export const AssetAssignmentSchema = z.object({
  assetId: z.string().uuid(),
  assignedTo: z.string().uuid(),
  assignedDate: z.string().date(),
  conditionOnAssignment: z.string().optional()
});

export const InventoryItemSchema = z.object({
  categoryId: z.string().uuid().optional(),
  itemName: z.string().min(1),
  itemCode: z.string().min(1),
  uom: z.string().optional(),
  reorderLevel: z.number().int().nonnegative().optional(),
  unitPrice: z.number().nonnegative().optional()
});

export const VendorSchema = z.object({
  vendorName: z.string().min(1),
  registrationNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  address: z.string().optional(),
  categoryId: z.string().uuid().optional()
});

export const PurchaseRequestSchema = z.object({
  requestDate: z.string().date(),
  requiredDate: z.string().date().optional(),
  department: z.string().optional(),
  totalEstimatedAmount: z.number().nonnegative().optional(),
  approvalStatus: z.string().optional()
});

export const PurchaseOrderSchema = z.object({
  vendorId: z.string().uuid(),
  purchaseRequestId: z.string().uuid().optional(),
  orderDate: z.string().date(),
  expectedDeliveryDate: z.string().date().optional(),
  totalAmount: z.number().nonnegative(),
  paymentTerms: z.string().optional()
});

export const StockMovementSchema = z.object({
  itemId: z.string().uuid(),
  fromStoreId: z.string().uuid().optional(),
  toStoreId: z.string().uuid().optional(),
  quantity: z.number().positive(),
  movementType: z.string().min(1)
});

export const WarrantySchema = z.object({
  assetId: z.string().uuid(),
  providerName: z.string().optional(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  terms: z.string().optional()
});
