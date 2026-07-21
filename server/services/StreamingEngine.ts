export class StreamingEngine {
  constructor(private tenantId: string) {}
  async pushEvent(streamId: string, eventType: string, payload: any) {
    return { event_id: "evt_" + Math.random().toString(36).substring(7) };
  }
}
