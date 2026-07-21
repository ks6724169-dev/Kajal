export class MLPipelineEngine {
  constructor(private tenantId: string) {}
  async startTraining(datasetId: string, modelName: string) {
    return { job_id: "train_" + Math.random().toString(36).substring(7), status: "IN_PROGRESS" };
  }
}
