import { useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { useAuth } from './AuthContext';
import { emailError } from '../validation';
import './Auth.css';

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const { sendReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextError = emailError(email);
    setError(nextError);
    if (nextError) return;

    setIsSubmitting(true);
    try {
      await sendReset(email);
      setSent(true);
    } catch {
      setError('Non è stato possibile inviare l\'email. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view items-center" aria-labelledby="forgot-title">
      <div className="view-header">
        <BackButton onClick={ onBack } />
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="card w-full max-w-[360px] flex flex-col gap-5">
          <h2 className="view-title" id="forgot-title">Recupera password</h2>

          { sent ? (
            <div className="flex flex-col gap-4 text-left">
              <p className="text-sm text-neutral-300 [overflow-wrap:break-word]">Se esiste un account associato a <strong>{ email }</strong>, riceverai a breve un'email con le istruzioni per reimpostare la password.</p>
              <p className="text-sm text-neutral-300 [overflow-wrap:break-word]">Non vedi l'email? Controlla anche nello spam o nelle promozioni.</p>
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

              <button className="icon-cta cta-primary" type="submit" disabled={ isSubmitting }>
                <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
                { isSubmitting ? 'Invio in corso…' : 'Invia link di recupero' }
              </button>
            </form>
          ) }
        </div>
      </div>
    </section>
  );
}