import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { EnterpriseShell } from './core/EnterpriseShell';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnterpriseShell>
      <App />
    </EnterpriseShell>
  </StrictMode>,
);
