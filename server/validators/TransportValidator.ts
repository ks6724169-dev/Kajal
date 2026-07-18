import { z } from 'zod';

export const RegisterVehicleSchema = z.object({
  vehicleNumber: z.string().min(1),
  vehicleType: z.string().optional(),
  capacity: z.number().positive(),
  make: z.string().optional(),
  model: z.string().optional(),
  yearOfManufacture: z.number().int().positive().optional(),
  chassisNumber: z.string().optional(),
  engineNumber: z.string().optional()
});

export const RegisterDriverSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  contactNumber: z.string().min(1),
  alternateNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().date().optional()
});

export const RegisterRouteSchema = z.object({
  routeName: z.string().min(1),
  startPoint: z.string().min(1),
  endPoint: z.string().min(1),
  estimatedDurationMins: z.number().positive().optional(),
  estimatedDistanceKm: z.number().positive().optional(),
  stops: z.array(z.object({
    stopName: z.string().min(1),
    stopOrder: z.number().int().nonnegative(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    estimatedArrivalTime: z.string().optional()
  })).optional()
});

export const AssignStudentTransportSchema = z.object({
  studentId: z.string().uuid(),
  routeId: z.string().uuid(),
  pickupStopId: z.string().uuid(),
  dropStopId: z.string().uuid()
});

export const StartTripSchema = z.object({
  vehicleId: z.string().uuid(),
  routeId: z.string().uuid(),
  driverId: z.string().uuid().optional(),
  conductorId: z.string().uuid().optional(),
  tripDate: z.string().date(),
  tripType: z.string().optional(),
  startOdometer: z.number().nonnegative().optional()
});

export const EndTripSchema = z.object({
  tripId: z.string().uuid(),
  endOdometer: z.number().nonnegative().optional()
});

export const EmergencyAlertSchema = z.object({
  tripId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  alertType: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional()
});

export const UpdateLiveLocationSchema = z.object({
  vehicleId: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  speed: z.number().nonnegative().optional()
});
