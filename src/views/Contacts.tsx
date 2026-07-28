import { useRef, useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon, CallIcon, Location01Icon, Mail01Icon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { HoneypotField } from '../components/HoneypotField';
import { messageError, nameError, sanitizeText } from '../validation';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, COURT_LOCATION, MAX_MESSAGE_LENGTH, MAX_TEXT_LENGTH } from '../config';
import type { ContactFormValues } from '../types';
import './Contacts.css';

interface ContactsProps {
  onBack: () => void;
  onSubmit: (values: ContactFormValues) => Promise<void>;
}

interface FieldErrors {
  name: string | null;
  message: string | null;
}

export function Contacts({ onBack, onSubmit }: ContactsProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ name: null, message: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    if (honeypotRef.current?.value) return;

    const cleanName = sanitizeText(name, MAX_TEXT_LENGTH);
    const cleanMessage = sanitizeText(message, MAX_MESSAGE_LENGTH);

    const nextErrors: FieldErrors = {
      name: nameError(cleanName, MAX_TEXT_LENGTH),
      message: messageError(cleanMessage, MAX_MESSAGE_LENGTH),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.message) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ name: cleanName, message: cleanMessage });
    } catch {
      setSubmitError('Non è stato possibile inviare il messaggio. Riprova.');
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view contacts" aria-labelledby="contacts-title">
      <div className="view-header">
        <BackButton onClick={ onBack } />
        <h2 id="contacts-title" className="view-title">Contatti</h2>
      </div>

      <div className="view-scroll">
        <address className="card info-list contacts-list">
          <div className="info-row">
            <span className="info-icon"><HugeiconsIcon icon={ Location01Icon } size={ 18 } strokeWidth={ 1.5 } /></span>
            <span className="section-label">Dove</span>
            <span className="contact-value">{ COURT_LOCATION }</span>
          </div>
          <div className="info-row">
            <span className="info-icon"><HugeiconsIcon icon={ CallIcon } size={ 18 } strokeWidth={ 1.5 } /></span>
            <span className="section-label">Telefono</span>
            <span className="contact-value">{ CONTACT_PHONE_DISPLAY }</span>
          </div>
          <div className="info-row">
            <span className="info-icon"><HugeiconsIcon icon={ Mail01Icon } size={ 18 } strokeWidth={ 1.5 } /></span>
            <span className="section-label">Email</span>
            <span className="contact-value">{ CONTACT_EMAIL }</span>
          </div>
        </address>

        <form className="card field-group" aria-label="Scrivici un messaggio" noValidate onSubmit={ handleSubmit }>
          <HoneypotField ref={ honeypotRef } />
          <div className={ `field${errors.name ? ' field--invalid' : ''}` }>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={ MAX_TEXT_LENGTH }
              required
              aria-invalid={ !!errors.name }
              value={ name }
              onChange={ (e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              } }
            />
            { errors.name && <span className="field-error">{ errors.name }</span> }
          </div>
          <div className={ `field${errors.message ? ' field--invalid' : ''}` }>
            <label htmlFor="message">Messaggio</label>
            <textarea
              id="message"
              name="message"
              rows={ 3 }
              maxLength={ MAX_MESSAGE_LENGTH }
              required
              aria-invalid={ !!errors.message }
              value={ message }
              onChange={ (e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: null }));
              } }
            />
            { errors.message && <span className="field-error">{ errors.message }</span> }
          </div>
          { submitError && <p className="form-error" role="alert">{ submitError }</p> }
          <button className="icon-cta cta-primary" type="submit" disabled={ isSubmitting }>
            { !isSubmitting && <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" /> }
            { isSubmitting ? 'Invio in corso…' : 'Invia' }
          </button>
        </form>
      </div>
    </section>
  );
}