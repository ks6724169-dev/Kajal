import { UnitOfWork } from '../database/unitOfWork.js';
import {
  PurchaseRequestRepository, PurchaseOrderRepository, GoodsReceiptRepository
} from '../repositories/InventoryRepository.js';

export class ProcurementEngine {
  public async createPurchaseRequest(tenantId: string, requestedBy: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(PurchaseRequestRepository);
      const request = await repo.insert({
        ...data,
        requestedBy,
        approvalStatus: 'PENDING',
        status: 'ACTIVE'
      });
      await uow.commit();
      return request;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async createPurchaseOrder(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(PurchaseOrderRepository);
      const order = await repo.insert({
        ...data,
        approvalStatus: 'PENDING',
        status: 'ACTIVE'
      });
      await uow.commit();
      return order;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async receiveGoods(tenantId: string, receivedBy: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(GoodsReceiptRepository);
      const receipt = await repo.insert({
        ...data,
        receivedBy,
        status: 'ACTIVE'
      });
      await uow.commit();
      return receipt;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const procurementEngine = new ProcurementEngine();
