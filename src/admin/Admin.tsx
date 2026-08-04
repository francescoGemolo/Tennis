import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { signOutUser, subscribeToAuth } from '../services/auth';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import './Admin.css';

export function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => subscribeToAuth(setUser), []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(undefined);
      return;
    }
    let cancelled = false;
    getDoc(doc(db, 'admins', user.uid))
      .then((snapshot) => { if (!cancelled) setIsAdmin(snapshot.exists()); })
      .catch(() => { if (!cancelled) setIsAdmin(false); });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (user && isAdmin === false) void signOutUser();
  }, [user, isAdmin]);

  if (user === undefined) return null;
  if (user && isAdmin !== true) return null;

  return (
    <main className="max-w-[900px] mx-auto min-h-dvh flex flex-col">
      { user ? <AdminDashboard /> : <AdminLogin /> }
    </main>
  );
}