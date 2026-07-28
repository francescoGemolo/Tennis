import { firebaseErrorCode } from '../services/auth';

interface UseGoogleSignInOptions {
  signInWithGoogle: () => Promise<unknown>;
  setSubmitError: (error: string | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isSubmitting: boolean;
}

export function useGoogleSignIn({ signInWithGoogle, setSubmitError, setIsSubmitting, isSubmitting }: UseGoogleSignInOptions) {
  return async function handleGoogleClick() {
    if (isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const code = firebaseErrorCode(error);
      if (import.meta.env.DEV) console.error('Accesso Google fallito:', code, error);
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      } else if (code === 'auth/popup-blocked') {
        setSubmitError('Il browser ha bloccato il popup. Consenti i popup per questo sito e riprova.');
      } else if (code === 'auth/account-exists-with-different-credential') {
        setSubmitError('Questo indirizzo email è già registrato con un altro metodo di accesso.');
      } else {
        setSubmitError('Accesso con Google non riuscito.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
}