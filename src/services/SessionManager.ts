export interface ActiveSession {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export class SessionManager {
  private static readonly SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes idle timeout
  private static lastActivityTime: number = Date.now();
  private static timeoutTimer: NodeJS.Timeout | null = null;
  private static onTimeoutCallback: (() => void) | null = null;

  static initializeIdleTimeout(onTimeout: () => void): void {
    this.onTimeoutCallback = onTimeout;
    this.resetTimer();

    // Attach user activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, () => this.handleActivity());
    });
  }

  static cleanupIdleTimeout(): void {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }
    // Remove listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    activityEvents.forEach((event) => {
      window.removeEventListener(event, () => this.handleActivity());
    });
  }

  private static handleActivity(): void {
    this.lastActivityTime = Date.now();
    this.resetTimer();
  }

  private static resetTimer(): void {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }

    this.timeoutTimer = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - this.lastActivityTime;
      if (timeSinceLastActivity >= this.SESSION_TIMEOUT_MS) {
        if (this.onTimeoutCallback) {
          this.onTimeoutCallback();
        }
      } else {
        this.resetTimer();
      }
    }, 30000); // Check every 30 seconds
  }

  // Session API operations (simulated realistic endpoints mapping to existing db/backend standards)
  static async getActiveSessions(): Promise<ActiveSession[]> {
    const defaultSessions: ActiveSession[] = [
      {
        id: 'sess-current',
        deviceName: 'MacBook Pro 16"',
        browser: 'Chrome 125.0',
        os: 'macOS Sonoma',
        ipAddress: '192.168.1.52',
        location: 'New Delhi, India',
        lastActive: 'Active now',
        isCurrent: true
      },
      {
        id: 'sess-mobile',
        deviceName: 'iPhone 15 Pro Max',
        browser: 'Safari Mobile',
        os: 'iOS 17.5',
        ipAddress: '103.45.22.18',
        location: 'Mumbai, India',
        lastActive: '10 minutes ago',
        isCurrent: false
      },
      {
        id: 'sess-tablet',
        deviceName: 'iPad Air 5',
        browser: 'Firefox Mobile',
        os: 'iPadOS 17.4',
        ipAddress: '103.45.22.19',
        location: 'Mumbai, India',
        lastActive: '2 days ago',
        isCurrent: false
      }
    ];

    try {
      const saved = localStorage.getItem('galaxy_active_sessions');
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem('galaxy_active_sessions', JSON.stringify(defaultSessions));
      return defaultSessions;
    } catch (e) {
      return defaultSessions;
    }
  }

  static async terminateSession(sessionId: string): Promise<boolean> {
    try {
      const sessions = await this.getActiveSessions();
      const updated = sessions.filter((s) => s.id !== sessionId);
      localStorage.setItem('galaxy_active_sessions', JSON.stringify(updated));
      return true;
    } catch (e) {
      return false;
    }
  }

  static async terminateOtherSessions(): Promise<boolean> {
    try {
      const sessions = await this.getActiveSessions();
      const current = sessions.filter((s) => s.isCurrent);
      localStorage.setItem('galaxy_active_sessions', JSON.stringify(current));
      return true;
    } catch (e) {
      return false;
    }
  }

  static detectConcurrentSessions(): boolean {
    // Basic verification flag
    return localStorage.getItem('galaxy_concurrent_session_detected') === 'true';
  }

  static flagConcurrentSession(detected: boolean): void {
    localStorage.setItem('galaxy_concurrent_session_detected', String(detected));
  }
}
