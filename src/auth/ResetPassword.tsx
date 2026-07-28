import { useEffect, useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { PasswordField } from '../components/PasswordField';
import { confirmReset, firebaseErrorCode, verifyResetCode } from '../services/auth';
import { confirmPasswordError, newPasswordError } from '../validation';
import './Auth.css';

interface ResetPasswordProps {
  oobCode: string;
}

type Stage = 'verifying' | 'ready' | 'invalid' | 'success';

interface FieldErrors {
  password: string | null;
  confirmPassword: string | null;
}

export function ResetPassword({ oobCode }: ResetPasswordProps) {
  const [stage, setStage] = useState<Stage>('verifying');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ password: null, confirmPassword: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    verifyResetCode(oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStage('ready');
      })
      .catch(() => setStage('invalid'));
  }, [oobCode]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors: FieldErrors = {
      password: newPasswordError(password),
      confirmPassword: confirmPasswordError(password, confirmPassword),
    };
    setErrors(nextErrors);
    if (nextErrors.password || nextErrors.confirmPassword) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await confirmReset(oobCode, password);
      setStage('success');
    } catch (error) {
      const code = firebaseErrorCode(error);
      if (code === 'auth/expired-action-code') {
        setSubmitError('Il link è scaduto. Richiedine uno nuovo dalla schermata di accesso.');
      } else if (code === 'auth/invalid-action-code') {
        setSubmitError('Il link non è più valido. Richiedine uno nuovo dalla schermata di accesso.');
      } else {
        setSubmitError('Non è stato possibile aggiornare la password. Riprova.');
      }
      setIsSubmitting(false);
    }
  }

  function goToApp() {
    window.location.href = import.meta.env.BASE_URL;
  }

  return (
    <section className="view auth-view" aria-labelledby="reset-title">
      <div className="auth-content">
        <div className="card auth-card">
          <h2 className="view-title" id="reset-title">Reimposta password</h2>

          { stage === 'verifying' && (
            <p className="section-label">Verifica del link in corso…</p>
          ) }

          { stage === 'invalid' && (
            <>
              <p className="form-error" role="alert">
                Questo link non è valido o è scaduto. Richiedi un nuovo link di recupero dalla schermata di accesso.
              </p>
              <button className="icon-cta cta-primary" type="button" onClick={ goToApp }>Torna all'app</button>
            </>
          ) }

          { stage === 'ready' && (
            <form className="field-group" noValidate onSubmit={ handleSubmit }>
              <p className="auth-sent-desc">Stai reimpostando la password per <strong>{ email }</strong>.</p>

              <PasswordField
                id="reset-password"
                label="Nuova password"
                autoComplete="new-password"
                value={ password }
                error={ errors.password }
                hint="Min. 6 caratteri, 1 maiuscola, 1 speciale"
                onChange={ (value) => {
                  setPassword(value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                } }
              />

              <PasswordField
                id="reset-confirm-password"
                label="Conferma nuova password"
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
                { isSubmitting ? 'Salvataggio…' : 'Salva nuova password' }
              </button>
            </form>
          ) }

          { stage === 'success' && (
            <div className="auth-sent">
              <span className="auth-sent-icon" aria-hidden="true">
                <HugeiconsIcon icon={ Tick02Icon } size={ 20 } strokeWidth={ 1.5 } />
              </span>
              <p className="auth-sent-desc">Password aggiornata. Ora puoi accedere con la nuova password.</p>
              <button className="icon-cta cta-primary" type="button" onClick={ goToApp }>Torna all'app</button>
            </div>
          ) }
        </div>
      </div>
    </section>
  );
}