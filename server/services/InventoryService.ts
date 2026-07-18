import { UnitOfWork } from '../database/unitOfWork.js';
import {
  AssetRepository, AssetAssignmentRepository, InventoryItemRepository,
  StockMovementRepository, VendorRepository
} from '../repositories/InventoryRepository.js';

export class InventoryService {
  public async registerAsset(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(AssetRepository);
      const asset = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return asset;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async assignAsset(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(AssetAssignmentRepository);
      const assignment = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return assignment;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async registerInventoryItem(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(InventoryItemRepository);
      const item = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return item;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async moveStock(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(StockMovementRepository);
      const movement = await repo.insert({
        ...data,
        movementDate: new Date(),
        status: 'ACTIVE'
      });
      // Further logic to update stock balance would go here
      await uow.commit();
      return movement;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async registerVendor(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(VendorRepository);
      const vendor = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return vendor;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const inventoryService = new InventoryService();
