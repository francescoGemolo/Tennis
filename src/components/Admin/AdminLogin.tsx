import { useState, type FormEvent } from 'react';
import { signIn } from '../../services/auth';
import './Admin.css';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch {
      setError('Credenziali non valide.');
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view admin-login" aria-labelledby="admin-login-title">
      <h2 className="view-title" id="admin-login-title">Accesso gestione</h2>

      <form className="card field-group" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="icon-cta cta-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Accesso in corso…' : 'Accedi'}
        </button>
      </form>
    </section>
  );
}