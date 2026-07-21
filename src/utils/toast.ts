export interface ToastPayload {
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const toast = {
  success: (message: string) => {
    window.dispatchEvent(new CustomEvent('galaxy-toast', { detail: { text: message, type: 'success' } }));
  },
  error: (message: string) => {
    window.dispatchEvent(new CustomEvent('galaxy-toast', { detail: { text: message, type: 'error' } }));
  },
  info: (message: string) => {
    window.dispatchEvent(new CustomEvent('galaxy-toast', { detail: { text: message, type: 'info' } }));
  },
  warning: (message: string) => {
    window.dispatchEvent(new CustomEvent('galaxy-toast', { detail: { text: message, type: 'warning' } }));
  }
};
