import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { registerSW } from 'virtual:pwa-register';
import './styles/tokens.css';
import './styles/shared.css';
import { AuthProvider } from './auth/AuthContext';
import { ResetPassword } from './auth/ResetPassword';
import App from './App';

const { hash, pathname, search } = window.location;
const searchParams = new URLSearchParams(search);
const oobCode = searchParams.get('oobCode');

if (hash === '#admin' || pathname.endsWith('/admin')) {
  window.location.replace(`${import.meta.env.BASE_URL}admin/`);
} else {
  registerSW({ immediate: true });

  const root = createRoot(document.getElementById('root')!);

  if (searchParams.get('mode') === 'resetPassword' && oobCode) {
    root.render(
      <StrictMode>
        <MotionConfig reducedMotion="user">
          <ResetPassword oobCode={ oobCode } />
        </MotionConfig>
      </StrictMode>,
    );
  } else {
    root.render(
      <StrictMode>
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <App />
          </AuthProvider>
        </MotionConfig>
      </StrictMode>,
    );
  }
}