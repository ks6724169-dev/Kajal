export class PlanningEngine {
  constructor(private tenantId: string) {}

  async createPlan(goal: string): Promise<string[]> {
    // Stub: decompose goal into steps
    return ["Step 1", "Step 2", "Step 3"];
  }
}
