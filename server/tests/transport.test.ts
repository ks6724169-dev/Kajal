import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js';
import { transportService } from '../services/TransportService.js';
import { gpsEngine } from '../services/GPSEngine.js';
import { routeOptimizationEngine } from '../services/RouteOptimizationEngine.js';
import { fleetEngine } from '../services/FleetEngine.js';
import { UnitOfWork } from '../database/unitOfWork.js';

const tenantId = '123e4567-e89b-12d3-a456-426614174999';

describe('Enterprise Transport, Fleet, GPS & Student Mobility Platform', () => {
  let vehicleId = '';
  let driverId = '';
  let routeId = '';
  let tripId = '';

  beforeAll(async () => {
    const tenantRes = await dbManager.query('SELECT id FROM tenant_registry WHERE id = $1', [tenantId]);
    if (tenantRes.rows.length === 0) {
      await dbManager.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, domain_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, 'ETENANT1', 'AI Test Tenant', 'ai-tenant.com', 'active', 'enterprise']);
    }

    await dbManager.query(`SET app.current_tenant = '\${tenantId}'`);

    const migrationPath = path.join(process.cwd(), 'server', 'database', 'migrations', '012_transport_platform.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await dbManager.query(sql);
  });

  it('1. should register a new vehicle', async () => {
    const vehicle = await transportService.registerVehicle(tenantId, {
      vehicleNumber: `MH12AB\${Math.floor(Math.random() * 1000)}`,
      capacity: 50,
      make: 'Tata',
      model: 'Starbus'
    });
    expect(vehicle.id).toBeDefined();
    vehicleId = vehicle.id;
  });

  it('2. should register a driver', async () => {
    const driver = await transportService.registerDriver(tenantId, {
      firstName: 'John',
      lastName: 'Doe',
      contactNumber: '9876543210'
    });
    expect(driver.id).toBeDefined();
    driverId = driver.id;
  });

  it('3. should register a route with stops', async () => {
    const route = await transportService.registerRoute(tenantId, {
      routeName: 'Morning Route A',
      startPoint: 'Station',
      endPoint: 'School'
    }, [
      { stopName: 'Stop 1', stopOrder: 1 },
      { stopName: 'Stop 2', stopOrder: 2 }
    ]);
    expect(route.id).toBeDefined();
    routeId = route.id;
  });

  it('4. should start a trip', async () => {
    const trip = await transportService.startTrip(tenantId, {
      vehicleId,
      routeId,
      driverId,
      tripDate: new Date(),
      tripType: 'PICKUP'
    });
    expect(trip.id).toBeDefined();
    tripId = trip.id;
  });

  it('5. should update live location', async () => {
    const loc = await gpsEngine.updateLiveLocation(tenantId, {
      vehicleId,
      latitude: 18.5204,
      longitude: 73.8567,
      speed: 45.5
    });
    expect(loc.id).toBeDefined();
  });

  it('6. should raise emergency alert', async () => {
    const alert = await transportService.raiseEmergencyAlert(tenantId, {
      tripId,
      vehicleId,
      alertType: 'BREAKDOWN'
    });
    expect(alert.id).toBeDefined();
  });

  it('7. should end a trip', async () => {
    const result = await transportService.endTrip(tenantId, tripId, 150);
    expect(result.success).toBe(true);
  });

  it('8. should analyze fleet health', async () => {
    const health = await fleetEngine.getFleetHealthScore(tenantId);
    expect(health.fleetHealthScore).toBeDefined();
  });

  it('9. should optimize route using AI', async () => {
    const optimization = await routeOptimizationEngine.optimizeRoute(tenantId, routeId);
    expect(optimization.aiOptimization).toBeDefined();
  });
});
