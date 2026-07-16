export interface INotificationPayload {
  to: string;
  subject?: string;
  body: string;
  templateId?: string;
  data?: Record<string, any>;
}

export abstract class BaseNotificationProvider {
  abstract send(payload: INotificationPayload): Promise<boolean>;
}

export class NotificationPlatform {
  private providers: Map<string, BaseNotificationProvider> = new Map();

  public registerProvider(type: string, provider: BaseNotificationProvider) {
    this.providers.set(type, provider);
  }

  public async notify(type: string, payload: INotificationPayload): Promise<boolean> {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`Notification provider for ${type} not found`);
    }
    return provider.send(payload);
  }
}
export const notificationPlatform = new NotificationPlatform();
