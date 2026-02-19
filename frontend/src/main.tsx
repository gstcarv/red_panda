import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { env } from '@/config/env/index.ts'; // Validate environment variables at startup
import App from './App.tsx';

async function enableMocking() {
  // Only enable MSW if explicitly enabled via env variable
  if (!env.VITE_ENABLE_MSW) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
