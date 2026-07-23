import { useRef, useState, type FormEvent } from 'react';
import { BackButton } from '../common/BackButton';
import { formatFullDate } from '../../data/calendar';
import { HONEYPOT_FIELD_NAME, MAX_PHONE_LENGTH, MAX_PLAYERS, MAX_TEXT_LENGTH, MIN_PLAYERS } from '../../data/constants';
import { sanitizePhone, sanitizeText } from '../../utils/sanitize';
import type { BookingFormValues } from '../../types/booking';
import './BookingForm.css';

interface BookingFormProps {
  date: Date;
  time: string;
  onBack: () => void;
  onSubmit: (values: BookingFormValues) => void;
}

export function BookingForm({ date, time, onBack, onSubmit }: BookingFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [players, setPlayers] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    // Campo honeypot: invisibile agli utenti reali, se compilato è un bot.
    if (honeypotRef.current?.value) return;

    const cleanFirstName = sanitizeText(firstName, MAX_TEXT_LENGTH);
    const cleanLastName = sanitizeText(lastName, MAX_TEXT_LENGTH);
    const cleanPhone = sanitizePhone(phone, MAX_PHONE_LENGTH);
    if (!cleanFirstName || !cleanLastName || !cleanPhone) return;

    setIsSubmitting(true);
    onSubmit({ firstName: cleanFirstName, lastName: cleanLastName, phone: cleanPhone, players });
  }

  return (
    <section className="view booking-form" aria-labelledby="booking-form-title">
      <BackButton onClick={onBack} />

      <div className="booking-form-scroll">
        <div className="card booking-summary">
          <span className="booking-summary-label">Prenotazione per</span>
          <span className="booking-summary-value">{formatFullDate(date)} · {time}</span>
        </div>

        <h2 className="view-title" id="booking-form-title">I tuoi dati</h2>

        <form className="card field-group" onSubmit={handleSubmit}>
          <input
            ref={honeypotRef}
            type="text"
            name={HONEYPOT_FIELD_NAME}
            className="honeypot-field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="field-row">
            <div className="field">
              <label htmlFor="firstName">Nome</label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                maxLength={MAX_TEXT_LENGTH}
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="lastName">Cognome</label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                maxLength={MAX_TEXT_LENGTH}
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="phone">Telefono</label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              maxLength={MAX_PHONE_LENGTH}
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="field">
            <span id="players-label">Numero di persone</span>
            <div className="stepper" role="group" aria-labelledby="players-label">
              <button
                className="stepper-btn"
                type="button"
                aria-label="Diminuisci"
                disabled={players <= MIN_PLAYERS}
                onClick={() => setPlayers((p) => Math.max(MIN_PLAYERS, p - 1))}
              >
                −
              </button>
              <span className="stepper-value">{players}</span>
              <button
                className="stepper-btn"
                type="button"
                aria-label="Aumenta"
                disabled={players >= MAX_PLAYERS}
                onClick={() => setPlayers((p) => Math.min(MAX_PLAYERS, p + 1))}
              >
                +
              </button>
            </div>
          </div>

          <button className="icon-cta cta-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Invio in corso…' : 'Invia prenotazione'}
          </button>
        </form>
      </div>
    </section>
  );
}