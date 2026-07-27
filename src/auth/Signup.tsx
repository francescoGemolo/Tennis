import { useEffect, useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon } from '@hugeicons/core-free-icons';
import { GoogleButton } from './GoogleButton';
import { useAuth } from './AuthContext';
import { PasswordField } from '../components/PasswordField';
import { confirmPasswordError, emailError, newPasswordError } from '../validation';
import './Auth.css';

interface FieldErrors {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
}

interface SignupProps {
  onSwitchToLogin: () => void;
}

export function Signup({ onSwitchToLogin }: SignupProps) {
  const { signUp, signInWithGoogle, googleRedirectError, clearGoogleRedirectError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ email: null, password: null, confirmPassword: null });
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
      password: newPasswordError(password),
      confirmPassword: confirmPasswordError(password, confirmPassword),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password || nextErrors.confirmPassword) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await signUp(email, password);
    } catch (error) {
      const code = error instanceof Error ? (error as { code?: string }).code : undefined;
      if (import.meta.env.DEV) console.error('Registrazione fallita:', code, error);
      if (code === 'auth/email-already-in-use') {
        setSubmitError('Questo indirizzo email è già registrato.');
      } else if (code === 'auth/network-request-failed') {
        setSubmitError('Controlla la connessione a internet.');
      } else {
        setSubmitError('Registrazione non riuscita. Riprova.');
      }
      setIsSubmitting(false);
    }
  }

  async function handleGoogleClick() {
    if (isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Redirect Google fallito:', error);
      setSubmitError('Accesso con Google non riuscito.');
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view auth-view" aria-labelledby="signup-title">
      <div className="auth-content">
        <div className="card auth-card">
          <h2 className="view-title" id="signup-title">Crea account</h2>

          <form className="field-group" noValidate onSubmit={ handleSubmit }>
            <div className={ `field${errors.email ? ' field--invalid' : ''}` }>
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
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
              id="signup-password"
              label="Password"
              autoComplete="new-password"
              value={ password }
              error={ errors.password }
              onChange={ (value) => {
                setPassword(value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              } }
            />

            <PasswordField
              id="signup-confirm-password"
              label="Conferma password"
              autoComplete="new-password"
              value={ confirmPassword }
              error={ errors.confirmPassword }
              onChange={ (value) => {
                setConfirmPassword(value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              } }
            />

            { submitError && <p className="form-error" role="alert">{ submitError }</p> }

            <button className="icon-cta cta-primary" type="submit" disabled={ isSubmitting }>
              <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
              { isSubmitting ? 'Registrazione in corso…' : 'Registrati' }
            </button>
          </form>

          <span className="auth-divider">Oppure</span>

          <GoogleButton label="Continua con Google" onClick={ handleGoogleClick } />

          <p className="auth-switch">
            Hai già un account?
            <button type="button" onClick={ onSwitchToLogin }>Accedi</button>
          </p>
        </div>
      </div>
    </section>
  );
}