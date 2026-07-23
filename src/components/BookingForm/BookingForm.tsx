import { useRef, useState, type FormEvent } from 'react';
import { Icon } from '../../icons/Icon';
import { BackButton } from '../common/BackButton';
import { formatFullDate } from '../../data/calendar';
import { HONEYPOT_FIELD_NAME, MAX_PHONE_LENGTH, MAX_TEXT_LENGTH, PRICE_PER_HOUR } from '../../data/constants';
import { sanitizePhone, sanitizeText } from '../../utils/sanitize';
import { isValidName, isValidPhone } from '../../utils/validation';
import type { BookingFormValues, DurationHours } from '../../types/booking';
import './BookingForm.css';

interface BookingFormProps {
  date: Date;
  time: string;
  durationHours: DurationHours;
  onBack: () => void;
  onSubmit: (values: BookingFormValues) => Promise<void>;
}

interface FieldErrors {
  firstName: boolean;
  lastName: boolean;
  phone: boolean;
}

export function BookingForm({ date, time, durationHours, onBack, onSubmit }: BookingFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ firstName: false, lastName: false, phone: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const totalPrice = durationHours * PRICE_PER_HOUR;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    if (honeypotRef.current?.value) return;

    const cleanFirstName = sanitizeText(firstName, MAX_TEXT_LENGTH);
    const cleanLastName = sanitizeText(lastName, MAX_TEXT_LENGTH);
    const cleanPhone = sanitizePhone(phone, MAX_PHONE_LENGTH);

    const nextErrors: FieldErrors = {
      firstName: !isValidName(cleanFirstName),
      lastName: !isValidName(cleanLastName),
      phone: !isValidPhone(cleanPhone),
    };
    setErrors(nextErrors);
    if (nextErrors.firstName || nextErrors.lastName || nextErrors.phone) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ firstName: cleanFirstName, lastName: cleanLastName, phone: cleanPhone });
    } catch {
      setSubmitError('Non è stato possibile completare la prenotazione. Riprova.');
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view booking-form" aria-labelledby="booking-form-title">
      <div className="view-header">
        <BackButton onClick={onBack} />
        <h2 className="view-title" id="booking-form-title">I tuoi dati</h2>
      </div>

      <div className="booking-form-scroll">
        <div className="card booking-summary">
          <span className="section-label">Prenotazione per</span>
          <span className="booking-summary-value">{formatFullDate(date)} - {time} - {durationHours}h</span>
          <span className="booking-summary-price">Totale: {totalPrice} €</span>
        </div>

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
            <div className={`field${errors.firstName ? ' field--invalid' : ''}`}>
              <label htmlFor="firstName">Nome</label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                maxLength={MAX_TEXT_LENGTH}
                required
                aria-invalid={errors.firstName}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: false }));
                }}
              />
            </div>
            <div className={`field${errors.lastName ? ' field--invalid' : ''}`}>
              <label htmlFor="lastName">Cognome</label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                maxLength={MAX_TEXT_LENGTH}
                required
                aria-invalid={errors.lastName}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: false }));
                }}
              />
            </div>
          </div>

          <div className={`field${errors.phone ? ' field--invalid' : ''}`}>
            <label htmlFor="phone">Telefono</label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              maxLength={MAX_PHONE_LENGTH}
              required
              aria-invalid={errors.phone}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
              }}
            />
          </div>

          {submitError && <p className="form-error" role="alert">{submitError}</p>}

          <button className="icon-cta cta-primary" type="submit" disabled={isSubmitting}>
            {!isSubmitting && <Icon name="check" size={16} className="icon-primary" />}
            {isSubmitting ? 'Invio in corso…' : 'Invia prenotazione'}
          </button>
        </form>
      </div>
    </section>
  );
}