export class ETLEngine {
  constructor(private tenantId: string) {}
  async executeJob(pipelineId: string, stepName: string) {
    return { job_id: "etl_" + Math.random().toString(36).substring(7), status: "COMPLETED" };
  }
}
