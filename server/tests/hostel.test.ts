import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { hostelService } from '../services/HostelService.js';
import { hostelAllocationEngine } from '../services/HostelAllocationEngine.js';
import { messEngine } from '../services/MessEngine.js';
import { hostelAnalyticsEngine } from '../services/HostelAnalyticsEngine.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { HostelFloorRepository, HostelBlockRepository, HostelBuildingRepository, HostelBedRepository } from '../repositories/HostelRepository.js';
import { QuerySpecification } from '../repositories/QuerySpecification.js';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise Hostel, Accommodation, Mess & Residential Management Platform', () => {
  let hostelId = '';
  let roomId = '';
  let bedId1 = '';
  let bedId2 = '';
  let allocationId = '';
  let studentId = uuidv4();
  let floorId = '';

  beforeAll(async () => {
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'ETENANT1', 'AI Test Tenant', 'ai-tenant.com', 'active', 'enterprise']);
    }

    await dbManager.query(`SET app.current_tenant = '${tenantId}'`);

    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '013_hostel_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);
  });

  it('1. should register a new hostel', async () => {
    const hostel = await hostelService.registerHostel(tenantId, {
      hostelName: 'Boys Hostel A',
      hostelType: 'BOYS',
      capacity: 500
    });
    expect(hostel.id).toBeDefined();
    hostelId = hostel.id;

    // Create building, block, floor for tests
    const uow = new UnitOfWork(tenantId);
    try {
        await uow.begin();
        const bldgRepo = uow.getRepository(HostelBuildingRepository);
        const bldg = await bldgRepo.insert({ hostelId, buildingName: 'Main', status: 'ACTIVE' });
        
        const blockRepo = uow.getRepository(HostelBlockRepository);
        const block = await blockRepo.insert({ buildingId: bldg.id!, blockName: 'North Wing', status: 'ACTIVE' });
        
        const floorRepo = uow.getRepository(HostelFloorRepository);
        const floor = await floorRepo.insert({ blockId: block.id!, floorNumber: 1, status: 'ACTIVE' });
        
        floorId = floor.id!;
        await uow.commit();
    } finally {
        await uow.dispose();
    }
  });

  it('2. should register a room with beds', async () => {
    const room = await hostelService.registerRoom(tenantId, {
      floorId,
      roomNumber: '101',
      roomType: 'DOUBLE',
      capacity: 2
    });
    expect(room.id).toBeDefined();
    roomId = room.id;

    // Get beds
    const uow = new UnitOfWork(tenantId);
    const bedRepo = uow.getRepository(HostelBedRepository);
    const spec = new QuerySpecification();
    spec.and('room_id', roomId);
    spec.and('status', 'ACTIVE');
    const beds = await bedRepo.findMany(spec);
    expect(beds.length).toBeGreaterThanOrEqual(2);
    bedId1 = beds[0].id!;
    bedId2 = beds[1].id!;
    await uow.dispose();
  });

  it('3. should allocate a bed to a student', async () => {
    const allocation = await hostelAllocationEngine.allocateRoom(tenantId, studentId, bedId1, new Date());
    expect(allocation.id).toBeDefined();
    allocationId = allocation.id;
  });

  it('4. should fail to allocate an occupied bed', async () => {
    await expect(hostelAllocationEngine.allocateRoom(tenantId, uuidv4(), bedId1, new Date())).rejects.toThrow('Bed is already occupied');
  });

  it('5. should transfer room allocation', async () => {
    const transfer = await hostelAllocationEngine.transferRoom(tenantId, allocationId, bedId2, new Date(), 'Requested change');
    expect(transfer.id).toBeDefined();
  });

  it('6. should register a visitor with gate pass', async () => {
    const { visitor, pass } = await hostelService.registerVisitor(tenantId, {
      visitorName: 'Jane Doe',
      contactNumber: '1234567890'
    }, {
      studentId,
      visitDate: new Date(),
      purpose: 'Meet'
    });
    expect(visitor.id).toBeDefined();
    expect(pass.id).toBeDefined();
  });

  it('7. should record meal attendance', async () => {
    const attendance = await messEngine.recordMealAttendance(tenantId, {
      studentId,
      mealDate: new Date(),
      mealType: 'LUNCH',
      consumed: true
    });
    expect(attendance.id).toBeDefined();
  });

  it('8. should get occupancy forecast using AI', async () => {
    const forecast = await hostelAnalyticsEngine.getOccupancyForecast(tenantId);
    expect(forecast.report.totalBeds).toBeGreaterThanOrEqual(2);
    expect(forecast.report.occupiedBeds).toBeGreaterThanOrEqual(1);
    expect(forecast.forecast).toBeDefined();
  });

  it('9. should suggest smart allocation using AI', async () => {
    const suggestion = await hostelAllocationEngine.suggestSmartAllocation(tenantId, { preference: 'Quiet room' });
    expect(suggestion.availableBeds).toBeDefined();
    expect(suggestion.aiRecommendation).toBeDefined();
  });
});
