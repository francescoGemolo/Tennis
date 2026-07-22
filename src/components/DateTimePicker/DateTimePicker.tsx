import { useMemo, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { BackButton } from '../common/BackButton';
import { formatFullDate, getTimeSlots } from '../../data/calendar';
import './DateTimePicker.css';

interface DateTimePickerProps {
  date: Date;
  onBack: () => void;
  onConfirm: (time: string) => void;
}

export function DateTimePicker({ date, onBack, onConfirm }: DateTimePickerProps) {
  const slots = useMemo(() => getTimeSlots(date), [date]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="view datetime" aria-labelledby="datetime-title">
      <BackButton onClick={onBack} />

      <div className="card datetime-card">
        <h2 className="datetime-title" id="datetime-title">
          <span className="datetime-title-icon"><Icon name="calendar" /></span>
          Data e Ora
        </h2>

        <div className="datetime-section">
          <span className="datetime-section-label">Data selezionata</span>
          <div className="date-field date-field--filled">
            <span className="date-field-icon"><Icon name="calendar" size={18} /></span>
            <span>{formatFullDate(date)}</span>
          </div>
        </div>

        <div className="datetime-section">
          <span className="datetime-section-label">Ora</span>
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
        </div>

        <button
          className="icon-cta cta-primary datetime-confirm"
          type="button"
          disabled={!selected}
          onClick={() => selected && onConfirm(selected)}
        >
          Continua
        </button>
      </div>
    </section>
  );
}