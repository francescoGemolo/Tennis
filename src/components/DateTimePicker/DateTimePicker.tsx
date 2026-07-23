import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { BackButton } from '../common/BackButton';
import { formatFullDate, getTimeSlots, toDateKey } from '../../data/calendar';
import { fetchBookingsForDate } from '../../services/bookings';
import type { AvailabilityRecord, DurationHours } from '../../types/booking';
import './DateTimePicker.css';

interface DateTimePickerProps {
  date: Date;
  onBack: () => void;
  onConfirm: (time: string, durationHours: DurationHours) => void;
}

export function DateTimePicker({ date, onBack, onConfirm }: DateTimePickerProps) {
  const [bookings, setBookings] = useState<AvailabilityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState<DurationHours>(1);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchBookingsForDate(toDateKey(date))
      .then((result) => {
        if (!cancelled) setBookings(result);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const slots = useMemo(() => getTimeSlots(date, bookings, duration), [date, bookings, duration]);

  useEffect(() => {
    if (!selected) return;
    const stillAvailable = slots.some((slot) => slot.time === selected && !slot.taken);
    if (!stillAvailable) setSelected(null);
  }, [slots, selected]);

  function handleDurationChange(next: DurationHours) {
    setDuration(next);
    setSelected(null);
  }

  return (
    <section className="view datetime" aria-labelledby="datetime-heading">
      <div className="view-header">
        <BackButton onClick={onBack} />
        <div className="datetime-topbar">
          <h2 className="view-title" id="datetime-heading">Orari disponibili</h2>
          <div className="datetime-date-pill">
            <Icon name="calendar" size={16} />
            <span>{formatFullDate(date)}</span>
          </div>
        </div>
      </div>

      <div className="duration-toggle" role="group" aria-label="Durata prenotazione">
        <button
          type="button"
          className={`duration-toggle-btn${duration === 1 ? ' duration-toggle-btn--active' : ''}`}
          aria-pressed={duration === 1}
          onClick={() => handleDurationChange(1)}
        >
          1 Ora
        </button>
        <button
          type="button"
          className={`duration-toggle-btn${duration === 2 ? ' duration-toggle-btn--active' : ''}`}
          aria-pressed={duration === 2}
          onClick={() => handleDurationChange(2)}
        >
          2 Ore
        </button>
      </div>

      <ul className="time-slots" role="list" aria-busy={isLoading}>
        {slots.map((slot) => (
          <li key={slot.time}>
            <button
              className={`time-slot${slot.taken ? ' time-slot--taken' : ''}${selected === slot.time ? ' time-slot--selected' : ''}`}
              type="button"
              disabled={slot.taken}
              aria-pressed={selected === slot.time}
              onClick={() => setSelected(slot.time)}
            >
              {slot.time}
            </button>
          </li>
        ))}
      </ul>

      <button
        className="icon-cta cta-primary datetime-confirm"
        type="button"
        disabled={!selected}
        onClick={() => selected && onConfirm(selected, duration)}
      >
        Continua
      </button>
    </section>
  );
}