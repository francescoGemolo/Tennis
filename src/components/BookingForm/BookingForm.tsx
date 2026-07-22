import { useState, type FormEvent } from 'react';
import { BackButton } from '../common/BackButton';
import { formatFullDate } from '../../data/calendar';
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!firstName || !lastName || !phone) return;
    onSubmit({ firstName, lastName, phone, players });
  }

  return (
    <section className="view booking-form" aria-labelledby="booking-form-title">
      <BackButton onClick={onBack} />

      <div className="card booking-summary">
        <span className="booking-summary-label">Prenotazione per</span>
        <span className="booking-summary-value">{formatFullDate(date)} · {time}</span>
      </div>

      <h2 id="booking-form-title">I tuoi dati</h2>

      <form className="card field-group" onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="firstName">Nome</label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
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
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="players">Numero di persone</label>
          <input
            id="players"
            type="number"
            min={1}
            max={4}
            required
            value={players}
            onChange={(e) => setPlayers(Number(e.target.value))}
          />
        </div>

        <button className="icon-cta cta-primary" type="submit">Invia prenotazione</button>
      </form>
    </section>
  );
}