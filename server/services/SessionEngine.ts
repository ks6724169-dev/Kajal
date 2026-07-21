export class SessionEngine {
  constructor(private tenantId: string) {}

  async validateSession(sessionId: string): Promise<boolean> {
    // Stub
    return true;
  }
}
