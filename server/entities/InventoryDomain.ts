import { BaseEntity } from './BaseEntity.js';

export interface AssetCategory extends BaseEntity {
  categoryName: string;
  description?: string;
}

export interface Asset extends BaseEntity {
  categoryId?: string;
  assetName: string;
  assetCode: string;
  purchaseDate?: Date;
  purchaseCost?: number;
  currentValue?: number;
  barcode?: string;
  serialNumber?: string;
}

export interface AssetLocation extends BaseEntity {
  locationName: string;
  description?: string;
}

export interface AssetAssignment extends BaseEntity {
  assetId: string;
  assignedTo?: string;
  assignedDate: Date;
  returnDate?: Date;
  conditionOnAssignment?: string;
  conditionOnReturn?: string;
}

export interface AssetMaintenance extends BaseEntity {
  assetId: string;
  maintenanceDate: Date;
  maintenanceType?: string;
  cost?: number;
  description?: string;
  performedBy?: string;
  nextDueDate?: Date;
}

export interface AssetDepreciation extends BaseEntity {
  assetId: string;
  depreciationDate: Date;
  depreciationValue?: number;
  bookValue?: number;
}

export interface InventoryCategory extends BaseEntity {
  categoryName: string;
  description?: string;
}

export interface InventoryItem extends BaseEntity {
  categoryId?: string;
  itemName: string;
  itemCode: string;
  uom?: string;
  reorderLevel?: number;
  unitPrice?: number;
}

export interface Warehouse extends BaseEntity {
  warehouseName: string;
  location?: string;
}

export interface Store extends BaseEntity {
  storeName: string;
  warehouseId?: string;
}

export interface Stock extends BaseEntity {
  itemId: string;
  storeId: string;
  quantity: number;
}

export interface StockMovement extends BaseEntity {
  itemId: string;
  fromStoreId?: string;
  toStoreId?: string;
  quantity: number;
  movementType: string;
  movementDate?: Date;
  referenceId?: string;
}

export interface VendorCategory extends BaseEntity {
  categoryName: string;
}

export interface Vendor extends BaseEntity {
  vendorName: string;
  registrationNumber?: string;
  taxNumber?: string;
  address?: string;
  categoryId?: string;
}

export interface VendorContact extends BaseEntity {
  vendorId: string;
  contactName: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

export interface PurchaseRequest extends BaseEntity {
  requestedBy: string;
  requestDate: Date;
  requiredDate?: Date;
  department?: string;
  totalEstimatedAmount?: number;
  approvalStatus?: string;
}

export interface PurchaseOrder extends BaseEntity {
  vendorId: string;
  purchaseRequestId?: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  totalAmount: number;
  paymentTerms?: string;
  approvalStatus?: string;
}

export interface PurchaseOrderItem extends BaseEntity {
  purchaseOrderId: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface GoodsReceipt extends BaseEntity {
  purchaseOrderId: string;
  receiptDate: Date;
  receivedBy: string;
  deliveryNoteNumber?: string;
}

export interface Quotation extends BaseEntity {
  vendorId: string;
  purchaseRequestId?: string;
  quotationDate: Date;
  validUntil?: Date;
  totalAmount: number;
  documentUrl?: string;
}

export interface PurchaseInvoice extends BaseEntity {
  purchaseOrderId?: string;
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  totalAmount: number;
  paymentStatus?: string;
}

export interface InventoryAudit extends BaseEntity {
  storeId: string;
  auditDate: Date;
  auditedBy: string;
  remarks?: string;
}

export interface InventoryTransfer extends BaseEntity {
  fromStoreId: string;
  toStoreId: string;
  transferDate: Date;
  requestedBy?: string;
  approvedBy?: string;
  transferStatus?: string;
}

export interface InventoryAdjustment extends BaseEntity {
  itemId: string;
  storeId: string;
  adjustmentDate: Date;
  adjustedQuantity: number;
  reason?: string;
  approvedBy?: string;
}

export interface Warranty extends BaseEntity {
  assetId: string;
  providerName?: string;
  startDate: Date;
  endDate: Date;
  terms?: string;
  documentUrl?: string;
}

export interface AMCContract extends BaseEntity {
  assetId: string;
  vendorId: string;
  startDate: Date;
  endDate: Date;
  cost?: number;
  documentUrl?: string;
}

export interface ScrapAsset extends BaseEntity {
  assetId: string;
  scrapDate: Date;
  reason?: string;
  scrapValue?: number;
  approvedBy?: string;
}
