import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { BackButton } from '../common/BackButton';
import { WEEKDAY_LABELS, formatMonthTitle, getMonthMatrix, toDateKey } from '../../data/calendar';
import { fetchBookingsForMonth } from '../../services/bookings';
import type { AvailabilityRecord, CalendarCell } from '../../types/booking';
import './BookingCalendar.css';

interface BookingCalendarProps {
  onBack: () => void;
  onSelectDate: (date: Date) => void;
}

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
    <section className="view booking" aria-labelledby="booking-title">
      <BackButton onClick={ onBack } />

      <nav className="month-switcher" aria-label="Cambia mese">
        <button
          className="month-nav-btn"
          type="button"
          aria-label="Mese precedente"
          disabled={ isAtEarliestMonth }
          onClick={ () => goToMonth(-1) }
        >
          <Icon name="arrowLeft" size={ 18 } />
        </button>
        <h2 id="booking-title" className="view-title month-switcher-title">{ formatMonthTitle(year, month) }</h2>
        <button className="month-nav-btn" type="button" aria-label="Mese successivo" onClick={ () => goToMonth(1) }>
          <Icon name="arrowRight" size={ 18 } />
        </button>
      </nav>

      <ul className="calendar-legend" aria-label="Legenda disponibilità">
        <li><span className="legend-dot legend-dot--free" aria-hidden="true" />Libero</li>
        <li><span className="legend-dot legend-dot--partial" aria-hidden="true" />Parziale</li>
        <li><span className="legend-dot legend-dot--busy" aria-hidden="true" />Occupato</li>
      </ul>

      <div className="card calendar">
        <ul className="calendar-weekdays" aria-hidden="true">
          { WEEKDAY_LABELS.map((label) => (
            <li key={ label }>{ label }</li>
          )) }
        </ul>
        <ol className="calendar-days" aria-busy={ isLoading }>
          { cells.map((cell, index) => {
            if (!cell.date) {
              return (
                <li key={ index }>
                  <button className="calendar-day calendar-day--empty" disabled tabIndex={ -1 } />
                </li>
              );
            }
            const isSelectable = (cell.status === 'free' || cell.status === 'partial') && !cell.isPast;
            const statusClass = cell.isPast ? 'past' : cell.status;
            return (
              <li key={ index }>
                <button
                  className={ `calendar-day calendar-day--${statusClass}` }
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