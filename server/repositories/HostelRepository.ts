import { BaseRepository } from './BaseRepository.js';
import {
  Hostel, HostelBuilding, HostelBlock, HostelFloor, HostelRoom, HostelBed,
  HostelAllocation, HostelTransfer, HostelLeave, Visitor, VisitorPass, GatePass,
  HostelComplaint, HostelMaintenance, HostelInventory, HostelStaff, Warden, HostelFee,
  Mess, MessPlan, MealMenu, MealAttendance, Laundry, LaundryTransaction,
  RoomInspection, ElectricityReading, WaterConsumption, HostelNotice
} from '../entities/HostelDomain.js';

export class HostelRepository extends BaseRepository<Hostel> {
  protected tableName = 'hostel_master';
}
export class HostelBuildingRepository extends BaseRepository<HostelBuilding> {
  protected tableName = 'hostel_building';
}
export class HostelBlockRepository extends BaseRepository<HostelBlock> {
  protected tableName = 'hostel_block';
}
export class HostelFloorRepository extends BaseRepository<HostelFloor> {
  protected tableName = 'hostel_floor';
}
export class HostelRoomRepository extends BaseRepository<HostelRoom> {
  protected tableName = 'hostel_room';
}
export class HostelBedRepository extends BaseRepository<HostelBed> {
  protected tableName = 'hostel_bed';
}
export class HostelAllocationRepository extends BaseRepository<HostelAllocation> {
  protected tableName = 'hostel_allocation';
}
export class HostelTransferRepository extends BaseRepository<HostelTransfer> {
  protected tableName = 'hostel_transfer';
}
export class HostelLeaveRepository extends BaseRepository<HostelLeave> {
  protected tableName = 'hostel_leave';
}
export class VisitorRepository extends BaseRepository<Visitor> {
  protected tableName = 'visitor_master';
}
export class VisitorPassRepository extends BaseRepository<VisitorPass> {
  protected tableName = 'visitor_pass';
}
export class GatePassRepository extends BaseRepository<GatePass> {
  protected tableName = 'gate_pass';
}
export class HostelComplaintRepository extends BaseRepository<HostelComplaint> {
  protected tableName = 'hostel_complaint';
}
export class HostelMaintenanceRepository extends BaseRepository<HostelMaintenance> {
  protected tableName = 'hostel_maintenance';
}
export class HostelInventoryRepository extends BaseRepository<HostelInventory> {
  protected tableName = 'hostel_inventory';
}
export class HostelStaffRepository extends BaseRepository<HostelStaff> {
  protected tableName = 'hostel_staff';
}
export class WardenRepository extends BaseRepository<Warden> {
  protected tableName = 'warden_master';
}
export class HostelFeeRepository extends BaseRepository<HostelFee> {
  protected tableName = 'hostel_fee';
}
export class MessRepository extends BaseRepository<Mess> {
  protected tableName = 'mess_master';
}
export class MessPlanRepository extends BaseRepository<MessPlan> {
  protected tableName = 'mess_plan';
}
export class MealMenuRepository extends BaseRepository<MealMenu> {
  protected tableName = 'meal_menu';
}
export class MealAttendanceRepository extends BaseRepository<MealAttendance> {
  protected tableName = 'meal_attendance';
}
export class LaundryRepository extends BaseRepository<Laundry> {
  protected tableName = 'laundry_master';
}
export class LaundryTransactionRepository extends BaseRepository<LaundryTransaction> {
  protected tableName = 'laundry_transaction';
}
export class RoomInspectionRepository extends BaseRepository<RoomInspection> {
  protected tableName = 'room_inspection';
}
export class ElectricityReadingRepository extends BaseRepository<ElectricityReading> {
  protected tableName = 'electricity_reading';
}
export class WaterConsumptionRepository extends BaseRepository<WaterConsumption> {
  protected tableName = 'water_consumption';
}
export class HostelNoticeRepository extends BaseRepository<HostelNotice> {
  protected tableName = 'hostel_notice';
}
