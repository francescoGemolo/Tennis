import { useMemo, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { BackButton } from '../common/BackButton';
import { formatFullDate, getTimeSlots } from '../../data/calendar';
import { getStoredBookings } from '../../utils/storage';
import './DateTimePicker.css';

interface DateTimePickerProps {
  date: Date;
  onBack: () => void;
  onConfirm: (time: string) => void;
}

export function DateTimePicker({ date, onBack, onConfirm }: DateTimePickerProps) {
  const bookings = useMemo(() => getStoredBookings(), []);
  const slots = useMemo(() => getTimeSlots(date, bookings), [date, bookings]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="view datetime" aria-labelledby="datetime-heading">
      <div className="datetime-topbar">
        <BackButton onClick={onBack} />
        <div className="datetime-date-pill">
          <Icon name="calendar" size={16} />
          <span>{formatFullDate(date)}</span>
        </div>
      </div>

      <h2 className="view-title" id="datetime-heading">Orari disponibili</h2>

      <ul className="time-slots" role="list">
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
        onClick={() => selected && onConfirm(selected)}
      >
        Continua
      </button>
    </section>
  );
}