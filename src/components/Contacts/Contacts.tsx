import { useState, type FormEvent } from 'react';
import { Icon } from '../../icons/Icon';
import { BackButton } from '../common/BackButton';
import type { ContactFormValues } from '../../types/booking';
import './Contacts.css';

interface ContactsProps {
  onBack: () => void;
  onSubmit: (values: ContactFormValues) => void;
}

export function Contacts({ onBack, onSubmit }: ContactsProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name || !message) return;
    onSubmit({ name, message });
  }

  return (
    <section className="view contacts" aria-labelledby="contacts-title">
      <BackButton onClick={onBack} />

      <h2 id="contacts-title">Contatti</h2>

      <div className="card contact-list">
        <div className="contact-item">
          <span className="contact-icon"><Icon name="phone" size={18} /></span>
          <address>
            <span className="contact-label">Telefono</span>
            <a className="contact-value" href="tel:+390612345678">+39 06 1234 5678</a>
          </address>
        </div>
        <div className="contact-item">
          <span className="contact-icon"><Icon name="mail" size={18} /></span>
          <address>
            <span className="contact-label">Email</span>
            <a className="contact-value" href="mailto:info@circolotennis.it">mariodanzi@email.com</a>
          </address>
        </div>
      </div>

      <form className="card field-group" aria-label="Scrivici un messaggio" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
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
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button className="icon-cta cta-primary" type="submit">Invia</button>
      </form>
    </section>
  );
}