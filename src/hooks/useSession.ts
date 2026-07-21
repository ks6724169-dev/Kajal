import { useState, useEffect } from 'react';
import { sessionStore, SessionState } from '../store/sessionStore';

export function useSession() {
  const [state, setState] = useState<SessionState>(sessionStore.getState());

  useEffect(() => {
    const unsubscribe = sessionStore.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  const loadSessions = () => {
    sessionStore.loadSessions();
  };

  const terminateSession = (id: string) => {
    sessionStore.terminateSession(id);
  };

  const terminateOtherSessions = () => {
    sessionStore.terminateOtherSessions();
  };

  const setConcurrentSessionDetected = (detected: boolean) => {
    sessionStore.setConcurrentSessionDetected(detected);
  };

  const setIdle = (idle: boolean) => {
    sessionStore.setIdle(idle);
  };

  return {
    activeSessions: state.activeSessions,
    isIdle: state.isIdle,
    concurrentSessionDetected: state.concurrentSessionDetected,
    isLoading: state.isLoading,
    loadSessions,
    terminateSession,
    terminateOtherSessions,
    setConcurrentSessionDetected,
    setIdle
  };
}
