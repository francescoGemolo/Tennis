import { useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon } from '@hugeicons/core-free-icons';
import { GoogleButton } from './GoogleButton';
import { emailError, passwordError } from '../validation';
import './Auth.css';

interface FieldErrors {
  email: string | null;
  password: string | null;
}

interface LoginProps {
  onLoginSuccess: () => void;
  onGoogleSignIn: () => void;
  onForgotPassword: () => void;
  onSwitchToSignup: () => void;
}

export function Login({ onLoginSuccess, onGoogleSignIn, onForgotPassword, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ email: null, password: null });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FieldErrors = {
      email: emailError(email),
      password: passwordError(password),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    onLoginSuccess();
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

            <div className={ `field${errors.password ? ' field--invalid' : ''}` }>
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
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

            <button type="button" className="auth-forgot-link" onClick={ onForgotPassword }>
              Password dimenticata?
            </button>

            <button className="icon-cta cta-primary" type="submit">
              <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
              Accedi
            </button>
          </form>

          <span className="auth-divider">Oppure</span>

          <GoogleButton label="Continua con Google" onClick={ onGoogleSignIn } />

          <p className="auth-switch">
            Non hai un account?
            <button type="button" onClick={ onSwitchToSignup }>Registrati</button>
          </p>
        </div>
      </div>
    </section>
  );
}