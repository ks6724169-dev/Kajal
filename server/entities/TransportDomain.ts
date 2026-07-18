import { BaseEntity } from './BaseEntity.js';

export interface Vehicle extends BaseEntity {
  vehicleNumber: string;
  vehicleType?: string;
  capacity: number;
  make?: string;
  model?: string;
  yearOfManufacture?: number;
  chassisNumber?: string;
  engineNumber?: string;
  gpsDeviceId?: string;
}

export interface Driver extends BaseEntity {
  firstName: string;
  lastName?: string;
  contactNumber: string;
  alternateNumber?: string;
  address?: string;
  dateOfBirth?: Date;
}

export interface Conductor extends BaseEntity {
  firstName: string;
  lastName?: string;
  contactNumber: string;
  address?: string;
}

export interface Route extends BaseEntity {
  routeName: string;
  startPoint: string;
  endPoint: string;
  estimatedDurationMins?: number;
  estimatedDistanceKm?: number;
}

export interface RouteStop extends BaseEntity {
  routeId: string;
  stopName: string;
  stopOrder: number;
  latitude?: number;
  longitude?: number;
  estimatedArrivalTime?: string;
}

export interface StudentTransport extends BaseEntity {
  studentId: string;
  routeId?: string;
  pickupStopId?: string;
  dropStopId?: string;
  transportFee?: number;
  feeCycle?: string;
}

export interface SeatAllocation extends BaseEntity {
  studentTransportId: string;
  vehicleId: string;
  seatNumber?: string;
}

export interface GPSDevice extends BaseEntity {
  deviceImei: string;
  simNumber?: string;
  provider?: string;
}

export interface LiveLocation extends BaseEntity {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: Date;
}

export interface Trip extends BaseEntity {
  vehicleId: string;
  routeId: string;
  driverId?: string;
  conductorId?: string;
  tripDate: Date;
  tripType?: string;
  startTime?: Date;
  endTime?: Date;
  startOdometer?: number;
  endOdometer?: number;
}

export interface TransportAttendance extends BaseEntity {
  studentId: string;
  tripId: string;
  stopId?: string;
  boardingType?: string;
  timestamp?: Date;
  method?: string;
}

export interface EmergencyAlert extends BaseEntity {
  tripId?: string;
  vehicleId?: string;
  alertType: string;
  latitude?: number;
  longitude?: number;
  timestamp?: Date;
  description?: string;
  resolved?: boolean;
}

export interface VehicleMaintenance extends BaseEntity {
  vehicleId: string;
  maintenanceDate: Date;
  maintenanceType?: string;
  cost?: number;
  vendor?: string;
  description?: string;
  nextDueDate?: Date;
}

export interface FuelLog extends BaseEntity {
  vehicleId: string;
  fillDate: Date;
  quantityLiters: number;
  cost: number;
  odometerReading?: number;
  receiptNumber?: string;
}
