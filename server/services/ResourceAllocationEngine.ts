import { UnitOfWork } from '../database/unitOfWork.js';
import { RoomAllocation, ResourceAllocation } from '../entities/TimetableDomain.js';
import { RoomAllocationRepository, ResourceAllocationRepository } from '../repositories/TimetableRepository.js';

export interface AllocationRequest {
  resourceId: string;
  timetablePeriodId: string;
  allocatedFrom: Date;
  allocatedTo: Date;
}

export class ResourceAllocationEngine {
  /**
   * Smartly checks if a resource is available during a requested timeframe
   */
  public async checkAvailability(
    tenantId: string,
    resourceId: string,
    from: Date,
    to: Date
  ): Promise<boolean> {
    const uow = new UnitOfWork(tenantId);
    try {
      const repo = uow.getRepository(ResourceAllocationRepository);
      const existing = await repo.findMany();
      
      const overlaps = existing.filter(alloc => {
        if (alloc.resourceId !== resourceId) return false;
        const allocFrom = new Date(alloc.allocatedFrom);
        const allocTo = new Date(alloc.allocatedTo);
        return (from < allocTo && to > allocFrom);
      });

      return overlaps.length === 0;
    } catch {
      return false;
    } finally {
      await uow.dispose();
    }
  }

  /**
   * Classroom Allocation
   */
  public async allocateClassroom(tenantId: string, request: AllocationRequest): Promise<ResourceAllocation> {
    const uow = new UnitOfWork(tenantId);
    try {
      await uow.begin();
      const isAvailable = await this.checkAvailability(tenantId, request.resourceId, request.allocatedFrom, request.allocatedTo);
      if (!isAvailable) {
        throw new Error(`Resource ${request.resourceId} is not available for the requested time.`);
      }

      const repo = uow.getRepository(ResourceAllocationRepository);
      const allocation = await repo.insert({
        resourceId: request.resourceId,
        timetablePeriodId: request.timetablePeriodId,
        allocatedFrom: request.allocatedFrom,
        allocatedTo: request.allocatedTo,
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

  /**
   * Smart Lab Allocation
   */
  public async allocateSmartLab(tenantId: string, request: AllocationRequest): Promise<ResourceAllocation> {
    // Perform lab specific validation if needed
    return this.allocateClassroom(tenantId, request);
  }

  /**
   * Auditorium Allocation
   */
  public async allocateAuditorium(tenantId: string, request: AllocationRequest): Promise<ResourceAllocation> {
    return this.allocateClassroom(tenantId, request);
  }

  /**
   * Sports Ground Allocation
   */
  public async allocateSportsGround(tenantId: string, request: AllocationRequest): Promise<ResourceAllocation> {
    return this.allocateClassroom(tenantId, request);
  }

  /**
   * Library Slot Allocation
   */
  public async allocateLibrarySlot(tenantId: string, request: AllocationRequest): Promise<ResourceAllocation> {
    return this.allocateClassroom(tenantId, request);
  }

  /**
   * Computer Lab Allocation
   */
  public async allocateComputerLab(tenantId: string, request: AllocationRequest): Promise<ResourceAllocation> {
    return this.allocateClassroom(tenantId, request);
  }

  /**
   * Meeting Hall Allocation
   */
  public async allocateMeetingHall(tenantId: string, request: AllocationRequest): Promise<ResourceAllocation> {
    return this.allocateClassroom(tenantId, request);
  }

  /**
   * Resource Utilization Calculator
   * Analyzes percentage of periods the resource is occupied out of the total slots available
   */
  public async calculateUtilization(
    tenantId: string,
    resourceId: string,
    totalSlots: number
  ): Promise<{ resourceId: string; utilizedSlots: number; utilizationRate: number }> {
    const uow = new UnitOfWork(tenantId);
    try {
      const repo = uow.getRepository(ResourceAllocationRepository);
      const existing = await repo.findMany();
      const resourceAllocations = existing.filter(a => a.resourceId === resourceId);
      const utilizedSlots = resourceAllocations.length;
      const rate = totalSlots > 0 ? (utilizedSlots / totalSlots) * 100 : 0;
      return {
        resourceId,
        utilizedSlots,
        utilizationRate: parseFloat(rate.toFixed(2))
      };
    } finally {
      await uow.dispose();
    }
  }
}

export const resourceAllocationEngine = new ResourceAllocationEngine();
