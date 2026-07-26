import { useState, type FormEvent } from 'react';
import { signIn } from '../services/auth';
import { emailError, passwordError } from '../validation';
import './Admin.css';

interface FieldErrors {
  email: string | null;
  password: string | null;
}

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ email: null, password: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    } catch {
      setSubmitError('Credenziali non valide.');
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view admin-login" aria-labelledby="admin-login-title">
      <h2 className="view-title" id="admin-login-title">Accesso gestione</h2>

      <form className="card field-group" noValidate onSubmit={ handleSubmit }>
        <div className={ `field${errors.email ? ' field--invalid' : ''}` }>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
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
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
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
        { submitError && <p className="form-error" role="alert">{ submitError }</p> }
        <button className="icon-cta cta-primary" type="submit" disabled={ isSubmitting }>
          { isSubmitting ? 'Accesso in corso…' : 'Accedi' }
        </button>
      </form>
    </section>
  );
}