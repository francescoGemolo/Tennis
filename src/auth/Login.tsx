import { useEffect, useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon } from '@hugeicons/core-free-icons';
import { GoogleButton } from './GoogleButton';
import { useAuth } from './AuthContext';
import { PasswordField } from '../components/PasswordField';
import { emailError, passwordError } from '../validation';
import './Auth.css';

interface FieldErrors {
  email: string | null;
  password: string | null;
}

interface LoginProps {
  onForgotPassword: () => void;
  onSwitchToSignup: () => void;
}

export function Login({ onForgotPassword, onSwitchToSignup }: LoginProps) {
  const { signIn, signInWithGoogle, signInAsGuest, googleRedirectError, clearGoogleRedirectError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ email: null, password: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!googleRedirectError) return;
    setSubmitError(googleRedirectError);
    clearGoogleRedirectError();
  }, [googleRedirectError, clearGoogleRedirectError]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors: FieldErrors = {
      email: emailError(email),
      password: passwordError(password),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      const code = error instanceof Error ? (error as { code?: string }).code : undefined;
      if (import.meta.env.DEV) console.error('Login fallito:', code, error);
      if (code === 'auth/network-request-failed') {
        setSubmitError('Controlla la connessione a internet.');
      } else if (code === 'auth/too-many-requests') {
        setSubmitError('Troppi tentativi, riprova più tardi.');
      } else {
        setSubmitError('Credenziali non valide.');
      }
      setIsSubmitting(false);
    }
  }

  async function handleGoogleClick() {
    if (isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      // Navigates away to Google; on failure to even start the redirect we land back here.
      await signInWithGoogle();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Redirect Google fallito:', error);
      setSubmitError('Accesso con Google non riuscito.');
      setIsSubmitting(false);
    }
  }

  async function handleGuestClick() {
    if (isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await signInAsGuest();
    } catch {
      setSubmitError('Accesso come ospite non riuscito. Riprova.');
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view auth-view" aria-labelledby="login-title">
      <div className="auth-content">
        <div className="card auth-card">
          <h2 className="view-title" id="login-title">Accedi</h2>

          <form className="field-group" noValidate onSubmit={ handleSubmit }>
            <div className={ `field${errors.email ? ' field--invalid' : ''}` }>
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                required
                aria-invalid={ !!errors.email }
                value={ email }
                onChange={ (e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                } }
              />
              { errors.email && <span className="field-error">{ errors.email }</span> }
            </div>

            <PasswordField
              id="login-password"
              label="Password"
              autoComplete="current-password"
              value={ password }
              error={ errors.password }
              onChange={ (value) => {
                setPassword(value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              } }
            />

            <button type="button" className="auth-forgot-link" onClick={ onForgotPassword }>
              Password dimenticata?
            </button>

            { submitError && <p className="form-error" role="alert">{ submitError }</p> }

            <button className="icon-cta cta-primary" type="submit" disabled={ isSubmitting }>
              <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
              { isSubmitting ? 'Accesso in corso…' : 'Accedi' }
            </button>
          </form>

          <span className="auth-divider">Oppure</span>

          <GoogleButton label="Continua con Google" onClick={ handleGoogleClick } />

          <p className="auth-switch">
            Non hai un account?
            <button type="button" onClick={ onSwitchToSignup }>Registrati</button>
          </p>

          <button type="button" className="btn-ghost auth-guest-link" onClick={ handleGuestClick } disabled={ isSubmitting }>
            Continua come ospite
          </button>
        </div>
      </div>
    </section>
  );
}