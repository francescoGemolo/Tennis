import { useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon } from '@hugeicons/core-free-icons';
import { useAuth } from './AuthContext';
import { firebaseErrorCode } from '../services/auth';
import { createUserProfile } from '../services/users';
import { MAX_PHONE_LENGTH, MAX_TEXT_LENGTH } from '../config';
import { capitalizeName, nameError, phoneError, sanitizePhone } from '../validation';
import './Auth.css';

interface FieldErrors {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

export function ProfileSetup() {
  const { authUser, signOutUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ firstName: null, lastName: null, phone: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting || !authUser) return;

    const cleanFirstName = capitalizeName(firstName);
    const cleanLastName = capitalizeName(lastName);

    const nextErrors: FieldErrors = {
      firstName: nameError(cleanFirstName, MAX_TEXT_LENGTH),
      lastName: nameError(cleanLastName, MAX_TEXT_LENGTH),
      phone: phoneError(phone, MAX_PHONE_LENGTH),
    };
    setErrors(nextErrors);
    if (nextErrors.firstName || nextErrors.lastName || nextErrors.phone) return;

    setFirstName(cleanFirstName);
    setLastName(cleanLastName);
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await createUserProfile(authUser.uid, {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        phone,
        email: authUser.email ?? '',
      });
    } catch (error) {
      const code = firebaseErrorCode(error);
      if (code === 'permission-denied') {
        setErrors((prev) => ({ ...prev, phone: 'Questo numero di telefono è già registrato.' }));
      } else {
        setSubmitError('Non è stato possibile salvare il profilo. Riprova.');
      }
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view auth-view" aria-labelledby="profile-title">
      <div className="auth-content">
        <div className="card auth-card">
          <span className="eyebrow">Benvenuto/a</span>
          <h2 className="view-title" id="profile-title">Completa il profilo</h2>

          <form className="field-group" noValidate onSubmit={ handleSubmit }>
            <div className="field-row">
              <div className={ `field${errors.firstName ? ' field--invalid' : ''}` }>
                <label htmlFor="profile-firstName">Nome</label>
                <input
                  id="profile-firstName"
                  type="text"
                  autoComplete="given-name"
                  maxLength={ MAX_TEXT_LENGTH }
                  required
                  aria-invalid={ !!errors.firstName }
                  value={ firstName }
                  onChange={ (e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: null }));
                  } }
                  onBlur={ () => setFirstName((prev) => capitalizeName(prev)) }
                />
                { errors.firstName && <span className="field-error">{ errors.firstName }</span> }
              </div>
              <div className={ `field${errors.lastName ? ' field--invalid' : ''}` }>
                <label htmlFor="profile-lastName">Cognome</label>
                <input
                  id="profile-lastName"
                  type="text"
                  autoComplete="family-name"
                  maxLength={ MAX_TEXT_LENGTH }
                  required
                  aria-invalid={ !!errors.lastName }
                  value={ lastName }
                  onChange={ (e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: null }));
                  } }
                  onBlur={ () => setLastName((prev) => capitalizeName(prev)) }
                />
                { errors.lastName && <span className="field-error">{ errors.lastName }</span> }
              </div>
            </div>

            <div className={ `field${errors.phone ? ' field--invalid' : ''}` }>
              <label htmlFor="profile-phone">Telefono</label>
              <input
                id="profile-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={ MAX_PHONE_LENGTH }
                required
                aria-invalid={ !!errors.phone }
                value={ phone }
                onChange={ (e) => {
                  setPhone(sanitizePhone(e.target.value, MAX_PHONE_LENGTH));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                } }
              />
              { errors.phone && <span className="field-error">{ errors.phone }</span> }
            </div>

            { submitError && <p className="form-error" role="alert">{ submitError }</p> }

            <button className="icon-cta cta-primary" type="submit" disabled={ isSubmitting }>
              <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
              { isSubmitting ? 'Salvataggio…' : 'Completa profilo' }
            </button>
          </form>

          <button type="button" className="btn-ghost auth-guest-link" onClick={ () => void signOutUser() } disabled={ isSubmitting }>
            Esci
          </button>
        </div>
      </div>
    </section>
  );
}