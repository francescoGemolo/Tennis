import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuth } from '../../services/auth';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import './Admin.css';

export function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => subscribeToAuth(setUser), []);

  if (user === undefined) return null;

  return (
    <main className="admin-app">
      { user ? <AdminDashboard /> : <AdminLogin /> }
    </main>
  );
}