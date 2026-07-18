import { BaseRepository } from './BaseRepository.js';
import {
  Vehicle, Driver, Conductor, Route, RouteStop, StudentTransport, SeatAllocation,
  GPSDevice, LiveLocation, Trip, TransportAttendance, EmergencyAlert,
  VehicleMaintenance, FuelLog
} from '../entities/TransportDomain.js';

export class VehicleRepository extends BaseRepository<Vehicle> {
  protected tableName = 'vehicle_master';
}
export class DriverRepository extends BaseRepository<Driver> {
  protected tableName = 'driver_master';
}
export class ConductorRepository extends BaseRepository<Conductor> {
  protected tableName = 'conductor_master';
}
export class RouteRepository extends BaseRepository<Route> {
  protected tableName = 'transport_route';
}
export class RouteStopRepository extends BaseRepository<RouteStop> {
  protected tableName = 'route_stop';
}
export class StudentTransportRepository extends BaseRepository<StudentTransport> {
  protected tableName = 'student_transport';
}
export class SeatAllocationRepository extends BaseRepository<SeatAllocation> {
  protected tableName = 'seat_allocation';
}
export class GPSDeviceRepository extends BaseRepository<GPSDevice> {
  protected tableName = 'gps_device';
}
export class LiveLocationRepository extends BaseRepository<LiveLocation> {
  protected tableName = 'live_location';
}
export class TripRepository extends BaseRepository<Trip> {
  protected tableName = 'trip_master';
}
export class TransportAttendanceRepository extends BaseRepository<TransportAttendance> {
  protected tableName = 'transport_attendance';
}
export class EmergencyAlertRepository extends BaseRepository<EmergencyAlert> {
  protected tableName = 'emergency_alert';
}
export class VehicleMaintenanceRepository extends BaseRepository<VehicleMaintenance> {
  protected tableName = 'vehicle_maintenance';
}
export class FuelLogRepository extends BaseRepository<FuelLog> {
  protected tableName = 'fuel_log';
}
