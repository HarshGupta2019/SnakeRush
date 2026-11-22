import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

const deviceHints = navigator as Navigator & { deviceMemory?: number };
const hasLimitedResources =
  (typeof deviceHints.deviceMemory === 'number' && deviceHints.deviceMemory <= 3) ||
  (deviceHints.hardwareConcurrency > 0 && deviceHints.hardwareConcurrency <= 4);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hasLimitedResources || prefersReducedMotion) {
  document.documentElement.classList.add('performance-lite');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
