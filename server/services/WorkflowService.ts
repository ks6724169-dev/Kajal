export class WorkflowService {
  constructor(private tenantId: string) {}

  async escalateInstance(instanceId: string, reason: string): Promise<any> {
    // Stub for escalating workflow
    return { status: 'ESCALATED' };
  }
}
