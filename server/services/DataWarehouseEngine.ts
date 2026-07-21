export class DataWarehouseEngine {
  constructor(private tenantId: string) {}
  async createSnapshot(tableId: string) {
    return { snapshot_id: "snap_" + Math.random().toString(36).substring(7) };
  }
}
