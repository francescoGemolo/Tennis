import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuth } from '../services/auth';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import './Admin.css';

export function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => subscribeToAuth(setUser), []);

  useEffect(() => {
    document.body.classList.add('admin-mode');
    const manifestLink = document.querySelector('link[rel="manifest"]');
    const defaultHref = manifestLink?.getAttribute('href') ?? null;
    manifestLink?.setAttribute('href', `${import.meta.env.BASE_URL}manifest-admin.webmanifest`);
    return () => {
      document.body.classList.remove('admin-mode');
      if (manifestLink && defaultHref) manifestLink.setAttribute('href', defaultHref);
    };
  }, []);

  if (user === undefined) return null;

  return (
    <main className="admin-app">
      { user ? <AdminDashboard /> : <AdminLogin /> }
    </main>
  );
}