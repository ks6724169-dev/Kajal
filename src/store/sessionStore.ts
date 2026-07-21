import { ActiveSession, SessionManager } from '../services/SessionManager';

export interface SessionState {
  activeSessions: ActiveSession[];
  isIdle: boolean;
  concurrentSessionDetected: boolean;
  isLoading: boolean;
}

type Listener = (state: SessionState) => void;

class SessionStore {
  private state: SessionState = {
    activeSessions: [],
    isIdle: false,
    concurrentSessionDetected: false,
    isLoading: false
  };

  private listeners = new Set<Listener>();

  getState(): SessionState {
    return this.state;
  }

  setState(newState: Partial<SessionState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async loadSessions() {
    this.setState({ isLoading: true });
    try {
      const activeSessions = await SessionManager.getActiveSessions();
      const concurrent = SessionManager.detectConcurrentSessions();
      this.setState({
        activeSessions,
        concurrentSessionDetected: concurrent,
        isLoading: false
      });
    } catch (e) {
      console.error('Failed to load active sessions', e);
      this.setState({ isLoading: false });
    }
  }

  async terminateSession(id: string) {
    const success = await SessionManager.terminateSession(id);
    if (success) {
      const remaining = this.state.activeSessions.filter((s) => s.id !== id);
      this.setState({ activeSessions: remaining });
    }
  }

  async terminateOtherSessions() {
    const success = await SessionManager.terminateOtherSessions();
    if (success) {
      const current = this.state.activeSessions.filter((s) => s.isCurrent);
      this.setState({ activeSessions: current });
    }
  }

  setConcurrentSessionDetected(detected: boolean) {
    SessionManager.flagConcurrentSession(detected);
    this.setState({ concurrentSessionDetected: detected });
  }

  setIdle(isIdle: boolean) {
    this.setState({ isIdle });
  }
}

export const sessionStore = new SessionStore();
