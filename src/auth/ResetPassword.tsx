import { useEffect, useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { PasswordField } from '../components/PasswordField';
import { confirmReset, firebaseErrorCode, verifyResetCode } from '../services/auth';
import { confirmPasswordError, newPasswordError } from '../validation';
import { PASSWORD_HINT } from '../config';

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
    <section className="view items-center" aria-labelledby="reset-title">
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="card w-full max-w-[360px] flex flex-col gap-5">
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
              <p className="text-sm text-neutral-300 [overflow-wrap:break-word]">Stai reimpostando la password per <strong>{ email }</strong>.</p>

              <PasswordField
                id="reset-password"
                label="Nuova password"
                autoComplete="new-password"
                value={ password }
                error={ errors.password }
                hint={ PASSWORD_HINT }
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
            <div className="flex flex-col gap-4 text-left">
              <span
                className="flex items-center justify-center w-[var(--size-icon-xl)] h-[var(--size-icon-xl)] shrink-0 border-hairline rounded-full bg-transparent text-accent"
                aria-hidden="true"
              >
                <HugeiconsIcon icon={ Tick02Icon } size={ 20 } strokeWidth={ 1.5 } />
              </span>
              <p className="text-sm text-neutral-300 [overflow-wrap:break-word]">Password aggiornata. Ora puoi accedere con la nuova password.</p>
              <button className="icon-cta cta-primary" type="button" onClick={ goToApp }>Torna all'app</button>
            </div>
          ) }
        </div>
      </div>
    </section>
  );
}