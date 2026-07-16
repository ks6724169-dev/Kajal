import { EventEmitter } from 'events';

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  public emitEvent(eventName: string, payload: any) {
    this.emit(eventName, payload);
  }
}

export const eventBus = new EventBus();
