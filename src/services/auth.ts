import {
  browserLocalPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
  type ActionCodeSettings,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { USERS_COLLECTION } from './users';
import { cancelFutureBookingsForUser } from './bookings';

const RECENT_LOGIN_THRESHOLD_MS = 4 * 60 * 1000;

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle(): Promise<void> {
  await setPersistence(auth, browserLocalPersistence);
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signInAsGuest(): Promise<UserCredential> {
  return signInAnonymously(auth);
}

export async function sendReset(email: string): Promise<void> {
  const actionCodeSettings: ActionCodeSettings = {
    url: `${window.location.origin}${import.meta.env.BASE_URL}`,
    handleCodeInApp: true,
  };
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (error) {
    const code = error instanceof Error ? (error as { code?: string }).code : undefined;
    if (code === 'auth/invalid-continue-uri' || code === 'auth/unauthorized-continue-uri') {
      await sendPasswordResetEmail(auth, email);
      return;
    }
    throw error;
  }
}

export async function verifyResetCode(oobCode: string): Promise<string> {
  return verifyPasswordResetCode(auth, oobCode);
}

export async function confirmReset(oobCode: string, newPassword: string): Promise<void> {
  await confirmPasswordReset(auth, oobCode, newPassword);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export function getAuthProviderId(user: User): string | undefined {
  return user.providerData[0]?.providerId;
}

export function isReauthRecent(user: User): boolean {
  const lastSignIn = user.metadata.lastSignInTime;
  if (!lastSignIn) return false;
  return Date.now() - new Date(lastSignIn).getTime() < RECENT_LOGIN_THRESHOLD_MS;
}

export async function reauthenticateWithPassword(password: string): Promise<void> {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('No authenticated email/password user.');
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
}

export async function reauthenticateWithGooglePopup(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user.');
  await reauthenticateWithPopup(user, new GoogleAuthProvider());
}

export async function deleteAccount(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user.');
  await cancelFutureBookingsForUser(user.uid);
  await deleteDoc(doc(db, USERS_COLLECTION, user.uid));
  await deleteUser(user);
}