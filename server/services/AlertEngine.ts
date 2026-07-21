export class AlertEngine {
  constructor(private tenantId: string) {}

  async triggerAlert(name: string, severity: string, message: string): Promise<void> {
    // Stub: create alert and send notifications
  }
}
