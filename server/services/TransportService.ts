import { UnitOfWork } from '../database/unitOfWork.js';
import { 
  VehicleRepository,
  DriverRepository,
  RouteRepository,
  RouteStopRepository,
  StudentTransportRepository,
  SeatAllocationRepository,
  TripRepository,
  TransportAttendanceRepository,
  EmergencyAlertRepository
} from '../repositories/TransportRepository.js';
import { notificationEngine } from './NotificationEngine.js';

export class TransportService {
  
  public async registerVehicle(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(VehicleRepository);
      const vehicle = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return vehicle;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async registerDriver(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(DriverRepository);
      const driver = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return driver;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async registerRoute(tenantId: string, data: any, stops: any[]): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(RouteRepository);
      const stopRepo = uow.getRepository(RouteStopRepository);
      
      const route = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });

      if (stops && stops.length > 0) {
         for (const stop of stops) {
            await stopRepo.insert({
               routeId: route.id!,
               ...stop,
               status: 'ACTIVE'
            });
         }
      }

      await uow.commit();
      return route;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async assignStudentTransport(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(StudentTransportRepository);
      const st = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();
      return st;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async startTrip(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(TripRepository);
      const trip = await repo.insert({
        ...data,
        startTime: new Date(),
        status: 'ACTIVE'
      });
      await uow.commit();
      return trip;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async endTrip(tenantId: string, tripId: string, endOdometer?: number): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(TripRepository);
      const trip = await repo.findOne(tripId);
      if (!trip) throw new Error('Trip not found');

      await repo.update(tripId, {
        endTime: new Date(),
        endOdometer
      }, trip.version);
      
      await uow.commit();
      return { success: true };
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }

  public async raiseEmergencyAlert(tenantId: string, data: any): Promise<any> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const repo = uow.getRepository(EmergencyAlertRepository);
      const alert = await repo.insert({
        ...data,
        status: 'ACTIVE'
      });
      await uow.commit();

      try {
        await notificationEngine.sendInAppNotification(tenantId, 'ADMIN', 'Emergency Alert', `Alert: \${alert.alertType} at Trip \${alert.tripId}`);
      } catch (err) {}

      return alert;
    } catch (e) {
      await uow.rollback();
      throw e;
    } finally {
      await uow.dispose();
    }
  }
}

export const transportService = new TransportService();
