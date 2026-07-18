import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  HostelAllocationRepository, 
  HostelRoomRepository, 
  HostelBedRepository,
  HostelTransferRepository
} from '../repositories/HostelRepository.js';
import { aiGateway } from '../ai/AIGateway.js';
import { dbManager } from '../database/dbClient.js';

export class HostelAllocationEngine {
  public async allocateRoom(tenantId: string, studentId: string, bedId: string, startDate: Date, endDate?: Date): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const allocationRepo = uow.getRepository(HostelAllocationRepository);
      const bedRepo = uow.getRepository(HostelBedRepository);

      const bed = await bedRepo.findOne(bedId);
      if (!bed) throw new Error('Bed not found');
      if (bed.isOccupied) throw new Error('Bed is already occupied');

      await bedRepo.update(bedId, { isOccupied: true }, bed.version);

      const allocation = await allocationRepo.insert({
        studentId,
        bedId,
        startDate,
        endDate,
        status: 'ACTIVE'
      });

      await uow.commit();
      return allocation;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async transferRoom(tenantId: string, allocationId: string, toBedId: string, transferDate: Date, reason?: string): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const allocationRepo = uow.getRepository(HostelAllocationRepository);
      const bedRepo = uow.getRepository(HostelBedRepository);
      const transferRepo = uow.getRepository(HostelTransferRepository);

      const allocation = await allocationRepo.findOne(allocationId);
      if (!allocation) throw new Error('Allocation not found');

      const toBed = await bedRepo.findOne(toBedId);
      if (!toBed || toBed.isOccupied) throw new Error('Target bed is not available');

      const fromBed = await bedRepo.findOne(allocation.bedId);
      if (fromBed) {
         await bedRepo.update(fromBed.id!, { isOccupied: false }, fromBed.version);
      }

      await bedRepo.update(toBedId, { isOccupied: true }, toBed.version);
      await allocationRepo.update(allocationId, { bedId: toBedId }, allocation.version);

      const transfer = await transferRepo.insert({
         allocationId,
         fromBedId: allocation.bedId,
         toBedId,
         transferDate,
         reason,
         status: 'ACTIVE'
      });

      await uow.commit();
      return transfer;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async suggestSmartAllocation(tenantId: string, criteria: any): Promise<any> {
      // Fetch some vacant beds
      const vacantRes = await dbManager.query(
          `SELECT hb.id as bed_id, hb.bed_number, hr.room_number, hr.room_type 
           FROM hostel_bed hb 
           JOIN hostel_room hr ON hb.room_id = hr.id 
           WHERE hb.tenant_id = $1 AND hb.is_occupied = false AND hb.status = 'ACTIVE' LIMIT 10`, 
          [tenantId]
      );
      const vacantBeds = vacantRes.rows;
      if (vacantBeds.length === 0) return { suggestion: 'No vacant beds available' };

      const prompt = `Based on student criteria: ${JSON.stringify(criteria)}, suggest the best room from these available options: ${JSON.stringify(vacantBeds)}. Provide a brief reasoning.`;
      const aiResponse = await aiGateway.chat(tenantId, [{ role: 'user', content: prompt }]);

      return {
          availableBeds: vacantBeds,
          aiRecommendation: aiResponse.text
      };
  }
}

export const hostelAllocationEngine = new HostelAllocationEngine();
