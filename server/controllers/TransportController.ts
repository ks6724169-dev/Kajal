import { Request, Response, NextFunction } from 'express';
import { transportService } from '../services/TransportService.js';
import { gpsEngine } from '../services/GPSEngine.js';
import { routeOptimizationEngine } from '../services/RouteOptimizationEngine.js';
import { vehicleAnalyticsEngine } from '../services/VehicleAnalyticsEngine.js';
import { fleetEngine } from '../services/FleetEngine.js';
import { sendSuccess } from '../core/response.js';
import { ValidationError } from '../errors/AppError.js';
import { UnitOfWork } from '../database/unitOfWork.js';
import { VehicleRepository, DriverRepository, RouteRepository } from '../repositories/TransportRepository.js';
import {
  RegisterVehicleSchema,
  RegisterDriverSchema,
  RegisterRouteSchema,
  AssignStudentTransportSchema,
  StartTripSchema,
  EndTripSchema,
  EmergencyAlertSchema,
  UpdateLiveLocationSchema
} from '../validators/TransportValidator.js';

export class TransportController {
  
  private getTenantId(req: Request): string {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      throw new ValidationError('Tenant ID (x-tenant-id) is required in headers');
    }
    return tenantId;
  }

  public async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(VehicleRepository);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const result = await repo.findMany(undefined, limit, offset);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async registerVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RegisterVehicleSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const result = await transportService.registerVehicle(tenantId, parsed.data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(VehicleRepository);
      const result = await repo.update(req.params.id, req.body, req.body.version);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(VehicleRepository);
      await repo.softDelete(req.params.id);
      sendSuccess(res, { success: true });
    } catch (error) {
      next(error);
    }
  }

  public async getDrivers(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(DriverRepository);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const result = await repo.findMany(undefined, limit, offset);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async registerDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RegisterDriverSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const data: any = { ...parsed.data };
      if (data.dateOfBirth) {
         data.dateOfBirth = new Date(data.dateOfBirth);
      }
      const result = await transportService.registerDriver(tenantId, data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const uow = new UnitOfWork(tenantId);
      const repo = uow.getRepository(RouteRepository);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const result = await repo.findMany(undefined, limit, offset);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async registerRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = RegisterRouteSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { stops, ...data } = parsed.data;
      const result = await transportService.registerRoute(tenantId, data, stops || []);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async assignStudentTransport(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = AssignStudentTransportSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const result = await transportService.assignStudentTransport(tenantId, parsed.data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async startTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = StartTripSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const data: any = { ...parsed.data };
      data.tripDate = new Date(data.tripDate);
      const result = await transportService.startTrip(tenantId, data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async endTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = EndTripSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const { tripId, endOdometer } = parsed.data;
      const result = await transportService.endTrip(tenantId, tripId, endOdometer);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async updateLiveLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = UpdateLiveLocationSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const result = await gpsEngine.updateLiveLocation(tenantId, parsed.data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async raiseEmergencyAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const parsed = EmergencyAlertSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }
      const result = await transportService.raiseEmergencyAlert(tenantId, parsed.data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getRouteOptimization(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const routeId = req.params.routeId;
      const result = await routeOptimizationEngine.optimizeRoute(tenantId, routeId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getVehicleAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const vehicleId = req.params.vehicleId;
      const result = await vehicleAnalyticsEngine.getVehicleAnalytics(tenantId, vehicleId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async getFleetHealthScore(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = this.getTenantId(req);
      const result = await fleetEngine.getFleetHealthScore(tenantId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const transportController = new TransportController();
