import { useEffect, useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { WEEKDAY_LABELS, formatMonthTitle, getMonthMatrix, toDateKey } from '../calendar';
import { fetchBookingsForMonth } from '../services/bookings';
import type { AvailabilityRecord, CalendarCell } from '../types';

interface BookingCalendarProps {
  onBack: () => void;
  onSelectDate: (date: Date) => void;
}

const DAY_BASE = 'w-full h-full flex items-center justify-center border-0 rounded-sm font-mono text-md cursor-pointer [transition:background-color_var(--transition-fast)]';

const DAY_STATUS_CLASSES: Record<string, string> = {
  empty: 'cursor-default invisible bg-transparent text-neutral-50',
  free: 'bg-success-subtle text-success hover:bg-success-muted',
  busy: 'bg-danger-subtle text-danger cursor-not-allowed',
  past: 'bg-transparent text-neutral-700 cursor-not-allowed',
  partial: 'bg-partial-subtle text-partial hover:bg-partial-muted',
};

export function BookingCalendar({ onBack, onSelectDate }: BookingCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookings, setBookings] = useState<AvailabilityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const monthStartKey = toDateKey(new Date(year, month, 1));
    const monthEndKey = toDateKey(new Date(year, month + 1, 0));
    fetchBookingsForMonth(monthStartKey, monthEndKey)
      .then((result) => {
        if (!cancelled) setBookings(result);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const cells = useMemo(() => getMonthMatrix(year, month, bookings), [year, month, bookings]);
  const isAtEarliestMonth = year === today.getFullYear() && month === today.getMonth();

  function goToMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function handleCellClick(cell: CalendarCell) {
    if (!cell.date || cell.isPast) return;
    if (cell.status !== 'free' && cell.status !== 'partial') return;
    onSelectDate(cell.date);
  }

  return (
    <section className="view" aria-labelledby="booking-title">
      <div className="view-header">
        <BackButton onClick={ onBack } />

        <nav className="view-header-row" aria-label="Cambia mese">
          <button
            className="flex items-center justify-center w-[var(--size-icon-lg)] h-[var(--size-icon-lg)] shrink-0 border-hairline rounded-md bg-neutral-900 text-neutral-50 cursor-pointer [transition:background-color_var(--transition-fast)] hover:bg-neutral-800 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
            type="button"
            aria-label="Mese precedente"
            disabled={ isAtEarliestMonth }
            onClick={ () => goToMonth(-1) }
          >
            <HugeiconsIcon icon={ ArrowLeft01Icon } size={ 18 } strokeWidth={ 1.5 } />
          </button>
          <h2 id="booking-title" className="view-title flex-1 text-center">{ formatMonthTitle(year, month) }</h2>
          <button
            className="flex items-center justify-center w-[var(--size-icon-lg)] h-[var(--size-icon-lg)] shrink-0 border-hairline rounded-md bg-neutral-900 text-neutral-50 cursor-pointer [transition:background-color_var(--transition-fast)] hover:bg-neutral-800 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
            type="button"
            aria-label="Mese successivo"
            onClick={ () => goToMonth(1) }
          >
            <HugeiconsIcon icon={ ArrowRight01Icon } size={ 18 } strokeWidth={ 1.5 } />
          </button>
        </nav>
      </div>

      <ul className="flex flex-wrap gap-4 shrink-0 font-mono text-xs text-neutral-300" aria-label="Legenda disponibilità">
        <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0 bg-success" aria-hidden="true" />Libero</li>
        <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0 bg-partial" aria-hidden="true" />Parziale</li>
        <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0 bg-danger" aria-hidden="true" />Occupato</li>
      </ul>

      <div className="card flex-1 min-h-0 flex flex-col p-4 animate-[fade-in-up_280ms_ease-out_60ms_both]">
        <ul className="grid grid-cols-7 font-mono text-sm text-neutral-500 text-center mb-3" aria-hidden="true">
          { WEEKDAY_LABELS.map((label) => (
            <li key={ label }>{ label }</li>
          )) }
        </ul>
        <ol className="flex-1 min-h-0 grid grid-cols-7 grid-rows-6 gap-2" aria-busy={ isLoading }>
          { cells.map((cell, index) => {
            if (!cell.date) {
              return (
                <li key={ index }>
                  <button className={ `${DAY_BASE} ${DAY_STATUS_CLASSES.empty}` } disabled tabIndex={ -1 } />
                </li>
              );
            }
            const isSelectable = (cell.status === 'free' || cell.status === 'partial') && !cell.isPast;
            const statusClass = cell.isPast ? 'past' : cell.status;
            return (
              <li key={ index }>
                <button
                  className={ `${DAY_BASE} ${DAY_STATUS_CLASSES[statusClass]}` }
                  type="button"
                  disabled={ !isSelectable }
                  onClick={ () => handleCellClick(cell) }
                >
                  <time dateTime={ cell.date.toISOString().slice(0, 10) }>{ cell.day }</time>
                </button>
              </li>
            );
          }) }
        </ol>
      </div>
    </section>
  );
}