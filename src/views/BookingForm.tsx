import { useRef, useState, type FormEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowBigRightDashIcon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { HoneypotField } from '../components/HoneypotField';
import { formatFullDate } from '../calendar';
import { bookingPrice, formatPrice } from '../pricing';
import { SlotUnavailableError } from '../services/bookings';
import { MAX_PHONE_LENGTH, MAX_TEXT_LENGTH } from '../config';
import { nameError, phoneError, sanitizePhone, sanitizeText } from '../validation';
import type { BookingFormValues, DurationHours } from '../types';

interface BookingFormProps {
  date: Date;
  time: string;
  durationHours: DurationHours;
  onBack: () => void;
  onSubmit: (values: BookingFormValues) => Promise<void>;
}

interface FieldErrors {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

export function BookingForm({ date, time, durationHours, onBack, onSubmit }: BookingFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ firstName: null, lastName: null, phone: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const totalPrice = bookingPrice(durationHours);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    if (honeypotRef.current?.value) return;

    const cleanFirstName = sanitizeText(firstName, MAX_TEXT_LENGTH);
    const cleanLastName = sanitizeText(lastName, MAX_TEXT_LENGTH);
    const cleanPhone = sanitizePhone(phone, MAX_PHONE_LENGTH);

    const nextErrors: FieldErrors = {
      firstName: nameError(cleanFirstName, MAX_TEXT_LENGTH),
      lastName: nameError(cleanLastName, MAX_TEXT_LENGTH),
      phone: phoneError(cleanPhone, MAX_PHONE_LENGTH),
    };
    setErrors(nextErrors);
    if (nextErrors.firstName || nextErrors.lastName || nextErrors.phone) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ firstName: cleanFirstName, lastName: cleanLastName, phone: cleanPhone });
    } catch (error) {
      setSubmitError(
        error instanceof SlotUnavailableError
          ? error.message
          : 'Non è stato possibile completare la prenotazione. Riprova.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view" aria-labelledby="booking-form-title">
      <div className="view-header">
        <BackButton onClick={ onBack } />
        <h2 className="view-title" id="booking-form-title">I tuoi dati</h2>
      </div>

      <div className="view-scroll">
        <div className="card flex flex-col gap-1 p-4 shrink-0">
          <span className="section-label">Prenotazione per</span>
          <span className="font-mono text-sm text-neutral-50">{ formatFullDate(date) } - { time } - { durationHours }h</span>
          <span className="font-mono text-sm font-semibold text-accent">Totale: { formatPrice(totalPrice) } a persona</span>
        </div>

        <form className="card field-group gap-5" noValidate onSubmit={ handleSubmit }>
          <HoneypotField ref={ honeypotRef } />

          <div className="field-row">
            <div className={ `field${errors.firstName ? ' field--invalid' : ''}` }>
              <label htmlFor="firstName">Nome</label>
              <input
                id="firstName"
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
              />
              { errors.firstName && <span className="field-error">{ errors.firstName }</span> }
            </div>
            <div className={ `field${errors.lastName ? ' field--invalid' : ''}` }>
              <label htmlFor="lastName">Cognome</label>
              <input
                id="lastName"
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
              />
              { errors.lastName && <span className="field-error">{ errors.lastName }</span> }
            </div>
          </div>

          <div className={ `field${errors.phone ? ' field--invalid' : ''}` }>
            <label htmlFor="phone">Telefono</label>
            <input
              id="phone"
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
            { !isSubmitting && <HugeiconsIcon icon={ ArrowBigRightDashIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" /> }
            { isSubmitting ? 'Invio in corso…' : 'Conferma prenotazione' }
          </button>
        </form>
      </div>
    </section>
  );
}