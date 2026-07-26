import { useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon, MailSend01Icon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { emailError } from '../validation';
import './Auth.css';

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextError = emailError(email);
    setError(nextError);
    if (nextError) return;

    setSent(true);
  }

  return (
    <section className="view auth-view" aria-labelledby="forgot-title">
      <div className="view-header">
        <BackButton onClick={ onBack } />
      </div>

      <div className="auth-content">
        <div className="card auth-card">
          <h2 className="view-title" id="forgot-title">Recupera password</h2>

          { sent ? (
            <div className="auth-sent">
              <span className="auth-sent-icon" aria-hidden="true">
                <HugeiconsIcon icon={ MailSend01Icon } size={ 20 } strokeWidth={ 1.5 } />
              </span>
              <p className="auth-sent-desc">Controlla la casella di <strong>{ email }</strong> e segui le istruzioni per reimpostare la password.</p>
              <button className="icon-cta cta-primary" type="button" onClick={ onBack }>Torna al login</button>
            </div>
          ) : (
            <form className="field-group" noValidate onSubmit={ handleSubmit }>
              <div className={ `field${error ? ' field--invalid' : ''}` }>
                <label htmlFor="forgot-email">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="username"
                  required
                  aria-invalid={ !!error }
                  value={ email }
                  onChange={ (e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  } }
                />
                { error && <span className="field-error">{ error }</span> }
              </div>

              <button className="icon-cta cta-primary" type="submit">
                <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
                Invia link di recupero
              </button>
            </form>
          ) }
        </div>
      </div>
    </section>
  );
}