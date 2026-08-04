import { useEffect, useMemo, useState } from 'react';
import { BackButton } from '../components/BackButton';
import { formatFullDate, getTimeSlots, toDateKey } from '../calendar';
import { fetchBookingsForDate } from '../services/bookings';
import type { AvailabilityRecord, DurationHours } from '../types';
import './DateTimePicker.css';

const DURATION_BTN_BASE = 'flex-1 border-0 rounded-full py-2 px-3 bg-transparent text-neutral-300 [font:inherit] text-sm cursor-pointer [transition:background-color_var(--transition-fast),color_var(--transition-fast)]';
const DURATION_BTN_ACTIVE = 'bg-accent-strong text-neutral-50';

const SLOT_BASE = 'time-slot w-full border-hairline rounded-md py-3 px-2 bg-neutral-800 text-neutral-50 font-mono text-sm cursor-pointer [transition:background-color_var(--transition-fast),border-color_var(--transition-fast)]';
const SLOT_SELECTED = 'bg-accent-strong border-accent-strong text-neutral-50';
const SLOT_TAKEN = 'bg-transparent text-neutral-600 cursor-not-allowed border-neutral-800';

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
    <section className="view" aria-labelledby="datetime-heading">
      <div className="view-header">
        <BackButton onClick={ onBack } />
        <div className="view-header-row">
          <h2 className="view-title" id="datetime-heading">Orari disponibili</h2>
          <div className="flex items-center gap-2 text-neutral-300 font-mono text-xs whitespace-nowrap overflow-hidden text-ellipsis before:content-[''] before:w-[0.4rem] before:h-[0.4rem] before:shrink-0 before:rounded-full before:bg-accent">
            <span>{ formatFullDate(date) }</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 border-hairline rounded-full bg-neutral-900 shrink-0" role="group" aria-label="Durata prenotazione">
        <button
          type="button"
          className={ `${DURATION_BTN_BASE}${duration === 1 ? ` ${DURATION_BTN_ACTIVE}` : ''}` }
          aria-pressed={ duration === 1 }
          onClick={ () => handleDurationChange(1) }
        >
          1 Ora
        </button>
        <button
          type="button"
          className={ `${DURATION_BTN_BASE}${duration === 2 ? ` ${DURATION_BTN_ACTIVE}` : ''}` }
          aria-pressed={ duration === 2 }
          onClick={ () => handleDurationChange(2) }
        >
          2 Ore
        </button>
      </div>

      <ul
        className="flex-1 min-h-0 overflow-y-auto [-webkit-overflow-scrolling:touch] grid grid-cols-3 md:grid-cols-4 gap-2 content-start pb-1 animate-[fade-in-up_280ms_ease-out_60ms_both]"
        role="list"
        aria-busy={ isLoading }
      >
        { slots.map((slot) => (
          <li key={ slot.time }>
            <button
              className={ `${SLOT_BASE}${slot.taken ? ` ${SLOT_TAKEN}` : ''}${selected === slot.time ? ` ${SLOT_SELECTED}` : ''}` }
              type="button"
              disabled={ slot.taken }
              aria-pressed={ selected === slot.time }
              onClick={ () => setSelected(slot.time) }
            >
              { slot.time }
            </button>
          </li>
        )) }
      </ul>

      <button
        className="icon-cta cta-primary w-full shrink-0"
        type="button"
        disabled={ !selected }
        onClick={ () => selected && onConfirm(selected, duration) }
      >
        Continua
      </button>
    </section>
  );
}