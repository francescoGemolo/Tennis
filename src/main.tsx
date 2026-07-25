import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './styles/tokens.css';
import './styles/shared.css';
import App from './App';

const { hash, pathname } = window.location;

if (hash === '#admin' || pathname.endsWith('/admin')) {
  window.location.replace(`${import.meta.env.BASE_URL}admin/`);
} else {
  registerSW({ immediate: true });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}