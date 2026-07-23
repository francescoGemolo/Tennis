import { useMemo, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { BackButton } from '../common/BackButton';
import { WEEKDAY_LABELS, formatMonthTitle, getMonthMatrix } from '../../data/calendar';
import type { CalendarCell } from '../../types/booking';
import './BookingCalendar.css';

interface BookingCalendarProps {
  onBack: () => void;
  onSelectDate: (date: Date) => void;
}

export function BookingCalendar({ onBack, onSelectDate }: BookingCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const cells = useMemo(() => getMonthMatrix(year, month), [year, month]);
  const isAtEarliestMonth = year === today.getFullYear() && month === today.getMonth();

  function goToMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  function handleCellClick(cell: CalendarCell) {
    if (!cell.date || cell.status !== 'free') return;
    onSelectDate(cell.date);
  }

  return (
    <section className="view booking" aria-labelledby="booking-title">
      <BackButton onClick={onBack} />

      <header className="booking-header">
        <h2 id="booking-title" className="view-title">{formatMonthTitle(year, month)}</h2>
      </header>

      <nav className="month-nav" aria-label="Cambia mese">
        <button
          className="month-nav-btn"
          type="button"
          aria-label="Mese precedente"
          disabled={isAtEarliestMonth}
          onClick={() => goToMonth(-1)}
        >
          <Icon name="arrowLeft" size={18} />
        </button>
        <button className="month-nav-btn" type="button" aria-label="Mese successivo" onClick={() => goToMonth(1)}>
          <Icon name="arrowRight" size={18} />
        </button>
      </nav>

      <ul className="calendar-legend" aria-label="Legenda disponibilità">
        <li><span className="legend-dot legend-dot--free" aria-hidden="true" />Libero</li>
        <li><span className="legend-dot legend-dot--busy" aria-hidden="true" />Occupato</li>
        <li><span className="legend-dot legend-dot--closed" aria-hidden="true" />Chiuso</li>
      </ul>

      <div className="card calendar">
        <ul className="calendar-weekdays" aria-hidden="true">
          {WEEKDAY_LABELS.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <ol className="calendar-days">
          {cells.map((cell, index) => {
            if (!cell.date) {
              return (
                <li key={index}>
                  <button className="calendar-day calendar-day--empty" disabled tabIndex={-1} />
                </li>
              );
            }
            const isFree = cell.status === 'free';
            return (
              <li key={index}>
                <button
                  className={`calendar-day calendar-day--${cell.status}`}
                  type="button"
                  disabled={!isFree}
                  onClick={() => handleCellClick(cell)}
                >
                  <time dateTime={cell.date.toISOString().slice(0, 10)}>{cell.day}</time>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}