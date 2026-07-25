import { useRef, useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon, CallIcon, Mail01Icon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { isValidName, sanitizeText } from '../validation';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, HONEYPOT_FIELD_NAME, MAX_MESSAGE_LENGTH, MAX_TEXT_LENGTH } from '../config';
import type { ContactFormValues } from '../types';
import './Contacts.css';

interface ContactsProps {
  onBack: () => void;
  onSubmit: (values: ContactFormValues) => Promise<void>;
}

interface FieldErrors {
  name: boolean;
  message: boolean;
}

export function Contacts({ onBack, onSubmit }: ContactsProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ name: false, message: false });
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
      name: !isValidName(cleanName),
      message: cleanMessage.length < 2,
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
        <div className="card contact-list">
          <div className="contact-item">
            <span className="contact-icon"><HugeiconsIcon icon={ CallIcon } size={ 18 } strokeWidth={ 1.5 } /></span>
            <address>
              <span className="section-label">Telefono</span>
              <a className="contact-value" href={ `tel:${CONTACT_PHONE_HREF}` }>{ CONTACT_PHONE_DISPLAY }</a>
            </address>
          </div>
          <div className="contact-item">
            <span className="contact-icon"><HugeiconsIcon icon={ Mail01Icon } size={ 18 } strokeWidth={ 1.5 } /></span>
            <address>
              <span className="section-label">Email</span>
              <a className="contact-value" href={ `mailto:${CONTACT_EMAIL}` }>{ CONTACT_EMAIL }</a>
            </address>
          </div>
        </div>

        <form className="card field-group" aria-label="Scrivici un messaggio" onSubmit={ handleSubmit }>
          <input
            ref={ honeypotRef }
            type="text"
            name={ HONEYPOT_FIELD_NAME }
            className="honeypot-field"
            tabIndex={ -1 }
            autoComplete="off"
            aria-hidden="true"
          />
          <div className={ `field${errors.name ? ' field--invalid' : ''}` }>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={ MAX_TEXT_LENGTH }
              required
              aria-invalid={ errors.name }
              value={ name }
              onChange={ (e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
              } }
            />
          </div>
          <div className={ `field${errors.message ? ' field--invalid' : ''}` }>
            <label htmlFor="message">Messaggio</label>
            <textarea
              id="message"
              name="message"
              rows={ 3 }
              maxLength={ MAX_MESSAGE_LENGTH }
              required
              aria-invalid={ errors.message }
              value={ message }
              onChange={ (e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: false }));
              } }
            />
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