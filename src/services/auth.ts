import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
  type ActionCodeSettings,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from './firebase';
import { PHONE_NUMBERS_COLLECTION, USERS_COLLECTION } from './users';
import { cancelFutureBookingsForUser } from './bookings';
import type { UserProfile } from '../types';

const RECENT_LOGIN_THRESHOLD_MS = 4 * 60 * 1000;

export function firebaseErrorCode(error: unknown): string | undefined {
  return error instanceof Error ? (error as { code?: string }).code : undefined;
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle(): Promise<void> {
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
    const code = firebaseErrorCode(error);
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

  const profileSnap = await getDoc(doc(db, USERS_COLLECTION, user.uid));
  const batch = writeBatch(db);
  batch.delete(doc(db, USERS_COLLECTION, user.uid));
  if (profileSnap.exists()) {
    const phone = (profileSnap.data() as UserProfile).phone;
    if (phone) batch.delete(doc(db, PHONE_NUMBERS_COLLECTION, phone));
  }
  await batch.commit();

  await deleteUser(user);
}