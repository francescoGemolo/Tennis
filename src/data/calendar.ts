import type { CalendarCell, DayStatus, TimeSlot } from '../types/booking';

export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export const MONTH_LABELS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

const TOTAL_CELLS = 42;

function isBeforeToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  return compare < today;
}

export function getDayStatus(date: Date): DayStatus {
  if (isBeforeToday(date)) return 'closed';
  if (date.getDay() === 1) return 'closed';
  const seed = date.getFullYear() * 373 + date.getMonth() * 31 + date.getDate();
  return seed % 5 === 3 ? 'busy' : 'free';
}

export function getMonthMatrix(year: number, month: number): CalendarCell[] {
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
      cells.push({ date, day, status: getDayStatus(date) });
    }
  }
  return cells;
}

export function getTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const seed = date.getDate();
  for (let minutes = 9 * 60; minutes <= 19 * 60 + 30; minutes += 30) {
    const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    const taken = (minutes / 30 + seed) % 7 === 0;
    slots.push({ time: `${hh}:${mm}`, taken });
  }
  return slots;
}

export function formatMonthTitle(year: number, month: number): string {
  return `${MONTH_LABELS[month]} ${year}`;
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}