import { BaseEntity } from './BaseEntity.js';

export interface Hostel extends BaseEntity {
  hostelName: string;
  hostelType?: string;
  capacity?: number;
  address?: string;
  contactNumber?: string;
}

export interface HostelBuilding extends BaseEntity {
  hostelId: string;
  buildingName: string;
  numberOfFloors?: number;
}

export interface HostelBlock extends BaseEntity {
  buildingId: string;
  blockName: string;
}

export interface HostelFloor extends BaseEntity {
  blockId: string;
  floorNumber: number;
  floorName?: string;
}

export interface HostelRoom extends BaseEntity {
  floorId: string;
  roomNumber: string;
  roomType?: string;
  capacity: number;
  baseFee?: number;
}

export interface HostelBed extends BaseEntity {
  roomId: string;
  bedNumber: string;
  isOccupied?: boolean;
}

export interface HostelAllocation extends BaseEntity {
  studentId: string;
  bedId: string;
  startDate: Date;
  endDate?: Date;
}

export interface HostelTransfer extends BaseEntity {
  allocationId: string;
  fromBedId: string;
  toBedId: string;
  transferDate: Date;
  reason?: string;
  approvedBy?: string;
}

export interface HostelLeave extends BaseEntity {
  studentId: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  approvedBy?: string;
}

export interface Visitor extends BaseEntity {
  visitorName: string;
  contactNumber: string;
  idProofType?: string;
  idProofNumber?: string;
}

export interface VisitorPass extends BaseEntity {
  visitorId: string;
  studentId: string;
  visitDate: Date;
  inTime?: Date;
  outTime?: Date;
  purpose?: string;
}

export interface GatePass extends BaseEntity {
  studentId: string;
  issueDate: Date;
  validUntil?: Date;
  reason?: string;
  approvedBy?: string;
}

export interface HostelComplaint extends BaseEntity {
  studentId: string;
  roomId?: string;
  category?: string;
  description?: string;
  raisedDate?: Date;
  resolvedDate?: Date;
  resolvedBy?: string;
}

export interface HostelMaintenance extends BaseEntity {
  roomId?: string;
  hostelId?: string;
  maintenanceType?: string;
  scheduledDate?: Date;
  completionDate?: Date;
  cost?: number;
  assignedTo?: string;
}

export interface HostelInventory extends BaseEntity {
  hostelId: string;
  itemName: string;
  quantity: number;
  category?: string;
}

export interface HostelStaff extends BaseEntity {
  hostelId: string;
  staffName: string;
  role?: string;
  contactNumber?: string;
}

export interface Warden extends BaseEntity {
  hostelId: string;
  userId: string;
  wardenName: string;
  contactNumber?: string;
}

export interface HostelFee extends BaseEntity {
  studentId: string;
  allocationId?: string;
  feeAmount: number;
  dueDate?: Date;
  isPaid?: boolean;
}

export interface Mess extends BaseEntity {
  hostelId?: string;
  messName: string;
  capacity?: number;
}

export interface MessPlan extends BaseEntity {
  messId: string;
  planName: string;
  dietType?: string;
  monthlyFee?: number;
}

export interface MealMenu extends BaseEntity {
  messPlanId: string;
  dayOfWeek: string;
  mealType: string;
  description?: string;
}

export interface MealAttendance extends BaseEntity {
  studentId: string;
  messPlanId?: string;
  mealDate: Date;
  mealType: string;
  consumed?: boolean;
}

export interface Laundry extends BaseEntity {
  hostelId?: string;
  vendorName?: string;
  pricePerKg?: number;
}

export interface LaundryTransaction extends BaseEntity {
  studentId: string;
  laundryId?: string;
  dropDate: Date;
  weightKg?: number;
  itemCount?: number;
  pickupDate?: Date;
  amount?: number;
}

export interface RoomInspection extends BaseEntity {
  roomId: string;
  inspectedBy: string;
  inspectionDate: Date;
  remarks?: string;
  rating?: number;
}

export interface ElectricityReading extends BaseEntity {
  roomId: string;
  readingDate: Date;
  units: number;
  amount?: number;
}

export interface WaterConsumption extends BaseEntity {
  hostelId: string;
  readingDate: Date;
  liters: number;
  amount?: number;
}

export interface HostelNotice extends BaseEntity {
  hostelId?: string;
  title: string;
  content: string;
  publishedDate?: Date;
}
