export class DataLakeEngine {
  constructor(private tenantId: string) {}
  async storeRawData(path: string, data: any) {
    return { object_id: "obj_" + Math.random().toString(36).substring(7), path };
  }
}
