import { useRef, useState, type FormEvent } from 'react';
import { Icon } from '../../icons/Icon';
import { BackButton } from '../common/BackButton';
import { sanitizeText } from '../../utils/sanitize';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from '../../data/content';
import { HONEYPOT_FIELD_NAME, MAX_MESSAGE_LENGTH, MAX_TEXT_LENGTH } from '../../data/constants';
import type { ContactFormValues } from '../../types/booking';
import './Contacts.css';

interface ContactsProps {
  onBack: () => void;
  onSubmit: (values: ContactFormValues) => void;
}

export function Contacts({ onBack, onSubmit }: ContactsProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    if (honeypotRef.current?.value) return;

    const cleanName = sanitizeText(name, MAX_TEXT_LENGTH);
    const cleanMessage = sanitizeText(message, MAX_MESSAGE_LENGTH);
    if (!cleanName || !cleanMessage) return;

    setIsSubmitting(true);
    onSubmit({ name: cleanName, message: cleanMessage });
  }

  return (
    <section className="view contacts" aria-labelledby="contacts-title">
      <BackButton onClick={onBack} />

      <h2 id="contacts-title" className="view-title">Contatti</h2>

      <div className="contacts-scroll">
        <div className="card contact-list">
          <div className="contact-item">
            <span className="contact-icon"><Icon name="phone" size={18} /></span>
            <address>
              <span className="contact-label">Telefono</span>
              <a className="contact-value" href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE_DISPLAY}</a>
            </address>
          </div>
          <div className="contact-item">
            <span className="contact-icon"><Icon name="mail" size={18} /></span>
            <address>
              <span className="contact-label">Email</span>
              <a className="contact-value" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </address>
          </div>
        </div>

        <form className="card field-group" aria-label="Scrivici un messaggio" onSubmit={handleSubmit}>
          <input
            ref={honeypotRef}
            type="text"
            name={HONEYPOT_FIELD_NAME}
            className="honeypot-field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={MAX_TEXT_LENGTH}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="message">Messaggio</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              maxLength={MAX_MESSAGE_LENGTH}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button className="icon-cta cta-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Invio in corso…' : 'Invia'}
          </button>
        </form>
      </div>
    </section>
  );
}