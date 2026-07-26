import { useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon } from '@hugeicons/core-free-icons';
import { GoogleButton } from './GoogleButton';
import { confirmPasswordError, emailError, newPasswordError } from '../validation';
import './Auth.css';

interface FieldErrors {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
}

interface SignupProps {
  onSignupSuccess: () => void;
  onGoogleSignIn: () => void;
  onSwitchToLogin: () => void;
}

export function Signup({ onSignupSuccess, onGoogleSignIn, onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ email: null, password: null, confirmPassword: null });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FieldErrors = {
      email: emailError(email),
      password: newPasswordError(password),
      confirmPassword: confirmPasswordError(password, confirmPassword),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password || nextErrors.confirmPassword) return;

    onSignupSuccess();
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

            <div className={ `field${errors.password ? ' field--invalid' : ''}` }>
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                required
                aria-invalid={ !!errors.password }
                value={ password }
                onChange={ (e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                } }
              />
              { errors.password && <span className="field-error">{ errors.password }</span> }
            </div>

            <div className={ `field${errors.confirmPassword ? ' field--invalid' : ''}` }>
              <label htmlFor="signup-confirm-password">Conferma password</label>
              <input
                id="signup-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                aria-invalid={ !!errors.confirmPassword }
                value={ confirmPassword }
                onChange={ (e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                } }
              />
              { errors.confirmPassword && <span className="field-error">{ errors.confirmPassword }</span> }
            </div>

            <button className="icon-cta cta-primary" type="submit">
              <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
              Registrati
            </button>
          </form>

          <span className="auth-divider">Oppure</span>

          <GoogleButton label="Continua con Google" onClick={ onGoogleSignIn } />

          <p className="auth-switch">
            Hai già un account?
            <button type="button" onClick={ onSwitchToLogin }>Accedi</button>
          </p>
        </div>
      </div>
    </section>
  );
}