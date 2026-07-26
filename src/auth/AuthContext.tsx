import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '../services/firebase';
import {
  consumePendingAccountDeletion,
  deleteAccount,
  getAuthProviderId,
  getGoogleRedirectResult,
  isReauthRecent,
  reauthenticateWithGoogleRedirect,
  reauthenticateWithPassword,
  sendReset,
  signIn,
  signInAsGuest,
  signInWithGoogle,
  signOutUser,
  signUp,
  subscribeToAuth,
} from '../services/auth';
import { USERS_COLLECTION } from '../services/users';
import type { UserProfile } from '../types';

type AuthStatus = 'loading' | 'signedOut' | 'needsProfile' | 'ready' | 'error';

function googleRedirectErrorMessage(error: unknown): string {
  const code = error instanceof Error ? (error as { code?: string }).code : undefined;
  if (code === 'auth/account-exists-with-different-credential') {
    return 'Questo indirizzo email è già registrato con un altro metodo di accesso.';
  }
  return 'Accesso con Google non riuscito.';
}

interface AuthContextValue {
  authUser: User | null | undefined;
  profile: UserProfile | null | undefined;
  status: AuthStatus;
  isGuest: boolean;
  signIn: typeof signIn;
  signUp: typeof signUp;
  signInWithGoogle: typeof signInWithGoogle;
  signInAsGuest: typeof signInAsGuest;
  signOutUser: typeof signOutUser;
  sendReset: typeof sendReset;
  deleteAccount: typeof deleteAccount;
  reauthenticateWithPassword: typeof reauthenticateWithPassword;
  reauthenticateWithGoogleRedirect: typeof reauthenticateWithGoogleRedirect;
  getAuthProviderId: typeof getAuthProviderId;
  isReauthRecent: typeof isReauthRecent;
  googleRedirectError: string | null;
  clearGoogleRedirectError: () => void;
  retry: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);
  const [profileError, setProfileError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [googleRedirectError, setGoogleRedirectError] = useState<string | null>(null);
  const redirectHandled = useRef(false);

  useEffect(() => subscribeToAuth(setAuthUser), []);

  // Runs once at boot to pick up the result of a signInWithRedirect/
  // reauthenticateWithRedirect Google round-trip (the page just reloaded).
  useEffect(() => {
    if (redirectHandled.current) return;
    redirectHandled.current = true;

    getGoogleRedirectResult()
      .then((result) => {
        if (result && consumePendingAccountDeletion()) {
          void deleteAccount().catch(() => {
            setGoogleRedirectError('Non è stato possibile eliminare l\'account. Riprova.');
          });
        }
      })
      .catch((error) => setGoogleRedirectError(googleRedirectErrorMessage(error)));
  }, []);

  useEffect(() => {
    setProfile(undefined);
    setProfileError(false);
    if (!authUser) return;

    if (authUser.isAnonymous) {
      setProfile(null);
      return;
    }

    return onSnapshot(
      doc(db, USERS_COLLECTION, authUser.uid),
      (snapshot) => setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null),
      () => setProfileError(true),
    );
  }, [authUser, retryToken]);

  const isGuest = authUser?.isAnonymous ?? false;

  const status: AuthStatus =
    authUser === undefined ? 'loading' :
      authUser === null ? 'signedOut' :
        profileError ? 'error' :
          profile === undefined ? 'loading' :
            isGuest ? 'ready' :
              profile === null ? 'needsProfile' :
                'ready';

  const value: AuthContextValue = {
    authUser,
    profile,
    status,
    isGuest,
    signIn,
    signUp,
    signInWithGoogle,
    signInAsGuest,
    signOutUser,
    sendReset,
    deleteAccount,
    reauthenticateWithPassword,
    reauthenticateWithGoogleRedirect,
    getAuthProviderId,
    isReauthRecent,
    googleRedirectError,
    clearGoogleRedirectError: () => setGoogleRedirectError(null),
    retry: () => setRetryToken((token) => token + 1),
  };

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}