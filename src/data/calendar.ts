import { CLOSING_MINUTES, OPENING_MINUTES, SLOT_DURATION_MINUTES } from './constants';
import type { AvailabilityRecord, CalendarCell, DayStatus, DurationHours, TimeSlot } from '../types/booking';

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
  const lastStart = CLOSING_MINUTES - SLOT_DURATION_MINUTES;
  for (let minutes = OPENING_MINUTES; minutes <= lastStart; minutes += SLOT_DURATION_MINUTES) {
    const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    times.push(`${hh}:${mm}`);
  }
  return times;
}

function timeToMinutes(time: string): number {
  const [hh, mm] = time.split(':').map(Number);
  return hh * 60 + mm;
}

function minutesToTime(minutes: number): string {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function getOccupiedTimes(booking: AvailabilityRecord): string[] {
  const start = timeToMinutes(booking.time);
  const times: string[] = [];
  for (let i = 0; i < booking.durationHours; i++) {
    times.push(minutesToTime(start + i * SLOT_DURATION_MINUTES));
  }
  return times;
}

export function getDayStatus(date: Date, bookings: AvailabilityRecord[]): DayStatus {
  const dateKey = toDateKey(date);
  const occupiedTimes = new Set(
    bookings.filter((b) => b.date === dateKey).flatMap((b) => getOccupiedTimes(b)),
  );
  if (occupiedTimes.size === 0) return 'free';

  const totalSlots = getSlotTimes().length;
  return occupiedTimes.size >= totalSlots ? 'busy' : 'partial';
}

export function getMonthMatrix(year: number, month: number, bookings: AvailabilityRecord[]): CalendarCell[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;

  const cells: CalendarCell[] = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const day = i - offset + 1;
    if (day < 1 || day > daysInMonth) {
      cells.push({ date: null, day: null, status: 'free', isPast: false });
    } else {
      const date = new Date(year, month, day);
      cells.push({ date, day, status: getDayStatus(date, bookings), isPast: isBeforeToday(date) });
    }
  }
  return cells;
}

export function getTimeSlots(date: Date, bookings: AvailabilityRecord[], durationHours: DurationHours): TimeSlot[] {
  const dateKey = toDateKey(date);
  const occupiedTimes = new Set(
    bookings.filter((b) => b.date === dateKey).flatMap((b) => getOccupiedTimes(b)),
  );

  return getSlotTimes().map((time) => {
    const start = timeToMinutes(time);
    const fitsBeforeClosing = start + durationHours * SLOT_DURATION_MINUTES <= CLOSING_MINUTES;
    const requiredTimes = Array.from({ length: durationHours }, (_, i) => minutesToTime(start + i * SLOT_DURATION_MINUTES));
    const overlapsExisting = requiredTimes.some((t) => occupiedTimes.has(t));
    return { time, taken: !fitsBeforeClosing || overlapsExisting };
  });
}

export function formatMonthTitle(year: number, month: number): string {
  return `${MONTH_LABELS[month]} ${year}`;
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}