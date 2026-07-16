export class SchedulerPlatform {
  public scheduleCron(name: string, cronExpression: string, handler: () => Promise<void>) {
    // Mock cron scheduler implementation
  }
}

export const schedulerManager = new SchedulerPlatform();
