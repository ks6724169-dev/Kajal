import { BaseRepository } from './BaseRepository.js';
import {
  Asset, AssetCategory, AssetLocation, AssetAssignment, AssetMaintenance,
  AssetDepreciation, InventoryItem, InventoryCategory, Warehouse, Store,
  Stock, StockMovement, PurchaseRequest, PurchaseOrder, PurchaseOrderItem,
  GoodsReceipt, Vendor, VendorCategory, VendorContact, Quotation, PurchaseInvoice,
  InventoryAudit, InventoryTransfer, InventoryAdjustment, ScrapAsset,
  Warranty, AMCContract
} from '../entities/InventoryDomain.js';

export class AssetRepository extends BaseRepository<Asset> { protected tableName = 'asset_master'; }
export class AssetCategoryRepository extends BaseRepository<AssetCategory> { protected tableName = 'asset_category'; }
export class AssetLocationRepository extends BaseRepository<AssetLocation> { protected tableName = 'asset_location'; }
export class AssetAssignmentRepository extends BaseRepository<AssetAssignment> { protected tableName = 'asset_assignment'; }
export class AssetMaintenanceRepository extends BaseRepository<AssetMaintenance> { protected tableName = 'asset_maintenance'; }
export class AssetDepreciationRepository extends BaseRepository<AssetDepreciation> { protected tableName = 'asset_depreciation'; }

export class InventoryItemRepository extends BaseRepository<InventoryItem> { protected tableName = 'inventory_item'; }
export class InventoryCategoryRepository extends BaseRepository<InventoryCategory> { protected tableName = 'inventory_category'; }
export class WarehouseRepository extends BaseRepository<Warehouse> { protected tableName = 'warehouse'; }
export class StoreRepository extends BaseRepository<Store> { protected tableName = 'store_master'; }
export class StockRepository extends BaseRepository<Stock> { protected tableName = 'stock'; }
export class StockMovementRepository extends BaseRepository<StockMovement> { protected tableName = 'stock_movement'; }

export class PurchaseRequestRepository extends BaseRepository<PurchaseRequest> { protected tableName = 'purchase_request'; }
export class PurchaseOrderRepository extends BaseRepository<PurchaseOrder> { protected tableName = 'purchase_order'; }
export class PurchaseOrderItemRepository extends BaseRepository<PurchaseOrderItem> { protected tableName = 'purchase_order_item'; }
export class GoodsReceiptRepository extends BaseRepository<GoodsReceipt> { protected tableName = 'goods_receipt'; }

export class VendorRepository extends BaseRepository<Vendor> { protected tableName = 'vendor_master'; }
export class VendorCategoryRepository extends BaseRepository<VendorCategory> { protected tableName = 'vendor_category'; }
export class VendorContactRepository extends BaseRepository<VendorContact> { protected tableName = 'vendor_contact'; }
export class QuotationRepository extends BaseRepository<Quotation> { protected tableName = 'quotation'; }
export class PurchaseInvoiceRepository extends BaseRepository<PurchaseInvoice> { protected tableName = 'invoice'; }

export class InventoryAuditRepository extends BaseRepository<InventoryAudit> { protected tableName = 'inventory_audit'; }
export class InventoryTransferRepository extends BaseRepository<InventoryTransfer> { protected tableName = 'inventory_transfer'; }
export class InventoryAdjustmentRepository extends BaseRepository<InventoryAdjustment> { protected tableName = 'inventory_adjustment'; }

export class WarrantyRepository extends BaseRepository<Warranty> { protected tableName = 'warranty'; }
export class AMCContractRepository extends BaseRepository<AMCContract> { protected tableName = 'amc_contract'; }
export class ScrapAssetRepository extends BaseRepository<ScrapAsset> { protected tableName = 'scrap_asset'; }
