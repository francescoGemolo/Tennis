import { CLOSED_WEEKDAY, CLOSING_MINUTES, OPENING_MINUTES, SLOT_DURATION_MINUTES } from './constants';
import type { CalendarCell, DayStatus, TimeSlot } from '../types/booking';
import type { StoredBooking } from '../utils/storage';

export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export const MONTH_LABELS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

const TOTAL_CELLS = 42;

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isBeforeToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  return compare < today;
}

export function getSlotTimes(): string[] {
  const times: string[] = [];
  for (let minutes = OPENING_MINUTES; minutes <= CLOSING_MINUTES; minutes += SLOT_DURATION_MINUTES) {
    const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    times.push(`${hh}:${mm}`);
  }
  return times;
}

export function getDayStatus(date: Date, bookings: StoredBooking[]): DayStatus {
  if (isBeforeToday(date)) return 'closed';
  if (date.getDay() === CLOSED_WEEKDAY) return 'closed';

  const dateKey = toDateKey(date);
  const bookedCount = bookings.filter((b) => b.date === dateKey).length;
  if (bookedCount === 0) return 'free';

  const totalSlots = getSlotTimes().length;
  return bookedCount >= totalSlots ? 'busy' : 'partial';
}

export function getMonthMatrix(year: number, month: number, bookings: StoredBooking[]): CalendarCell[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;

  const cells: CalendarCell[] = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const day = i - offset + 1;
    if (day < 1 || day > daysInMonth) {
      cells.push({ date: null, day: null, status: 'closed' });
    } else {
      const date = new Date(year, month, day);
      cells.push({ date, day, status: getDayStatus(date, bookings) });
    }
  }
  return cells;
}

export function getTimeSlots(date: Date, bookings: StoredBooking[]): TimeSlot[] {
  const dateKey = toDateKey(date);
  const bookedTimes = new Set(bookings.filter((b) => b.date === dateKey).map((b) => b.time));
  return getSlotTimes().map((time) => ({ time, taken: bookedTimes.has(time) }));
}

export function formatMonthTitle(year: number, month: number): string {
  return `${MONTH_LABELS[month]} ${year}`;
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}