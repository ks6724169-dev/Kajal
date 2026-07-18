# Phase 03.2N: Enterprise Asset, Inventory, Procurement & Store Management Platform (EAIPSMP)

## Overview
Phase 03.2N extends the Enterprise ERP suite with a comprehensive infrastructure for managing assets, tracking inventory, running procurement workflows, and managing vendors.

## Files Created/Edited
- **Migrations:** `server/database/migrations/015_inventory_platform.sql`
- **Entities:** `server/entities/InventoryDomain.ts`
- **Repositories:** `server/repositories/InventoryRepository.ts` & updated `index.ts`
- **Validators:** `server/validators/InventoryValidator.ts`
- **Engines & Services:**
  - `server/services/InventoryService.ts`
  - `server/services/ProcurementEngine.ts`
  - `server/services/InventoryAnalyticsEngine.ts`
- **Controllers & Routes:**
  - `server/controllers/InventoryController.ts`
  - `server/routes/inventory.ts`
  - Mounted `/inventory` in `server/gateway/v1.ts`
- **Tests:** `server/tests/inventory.test.ts`

## Database Objects Created
Tables created with standard enterprise patterns (UUID, Tenant Isolation, RLS, Audit Triggers, Soft Delete):
- Asset Management: `asset_category`, `asset_master`, `asset_location`, `asset_assignment`, `asset_maintenance`, `asset_depreciation`, `warranty`, `amc_contract`, `scrap_asset`
- Inventory & Stock: `inventory_category`, `inventory_item`, `warehouse`, `store_master`, `stock`, `stock_movement`, `inventory_audit`, `inventory_transfer`, `inventory_adjustment`
- Procurement & Vendor: `vendor_category`, `vendor_master`, `vendor_contact`, `purchase_request`, `purchase_order`, `purchase_order_item`, `goods_receipt`, `quotation`, `invoice`

## APIs Added
All routes are mounted under `/api/gateway/v1/inventory` with strict RBAC:
- **POST** `/assets` (Register Asset)
- **POST** `/assets/assign` (Assign Asset)
- **POST** `/items` (Register Inventory Item)
- **POST** `/stock/move` (Move Stock)
- **POST** `/vendors` (Register Vendor)
- **POST** `/purchase-requests` (Create Purchase Request)
- **POST** `/purchase-orders` (Create Purchase Order)
- **POST** `/goods-receipt` (Process Goods Receipt)
- **GET** `/analytics/low-stock`
- **GET** `/analytics/purchase-forecast`

## Business Rules Implemented
- **Asset Assignment Lifecycle:** Assets can be tracked via condition state when assigned and returned.
- **Stock Movements:** Every stock change (IN, OUT, TRANSFER) must be explicitly recorded in `stock_movement` for auditability.
- **Procurement Workflow:** Mandates a linked flow: Purchase Request -> Purchase Order -> Goods Receipt -> Invoice.

## AI Features Implemented
- **Low Stock Prediction:** Analyzes current stock levels vs consumption to predict what items will run low in the next 30 days.
- **Purchase Forecasting:** Forecasts budget and recommends POs based on predictive burn rates.

## Security Features
- Zod validation for all incoming data payloads.
- **Row-Level Security (RLS)** enabled for all tables, completely isolating assets and stock between tenants.
- **RBAC Check:** Stricter roles required such as `Inventory Manager`, `Store Manager`, and `Purchase Officer`.

## Test Coverage Summary
- Successfully registers assets and assigns them.
- Tracks inventory items and moves stock quantities.
- Covers the full procurement cycle from vendor registration to purchase request, order, and goods receipt.
- Validated AI insight delivery.
