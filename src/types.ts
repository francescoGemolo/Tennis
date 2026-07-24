export type DayStatus = 'free' | 'partial' | 'busy';

export interface CalendarCell {
  date: Date | null;
  day: number | null;
  status: DayStatus;
  isPast: boolean;
}

export interface TimeSlot {
  time: string;
  taken: boolean;
}

export type DurationHours = 1 | 2;

export interface AvailabilityRecord {
  date: string;
  time: string;
  durationHours: DurationHours;
}

export interface AdminBooking {
  id: string;
  availabilityId: string;
  date: string;
  time: string;
  durationHours: DurationHours;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

export type ViewId = 'welcome' | 'booking' | 'datetime' | 'bookingForm' | 'contacts';

export interface ContactFormValues {
  name: string;
  message: string;
}

export interface BookingFormValues {
  firstName: string;
  lastName: string;
  phone: string;
}