export type DayStatus = 'free' | 'partial' | 'busy' | 'closed';

export interface CalendarCell {
  date: Date | null;
  day: number | null;
  status: DayStatus;
}

export interface TimeSlot {
  time: string;
  taken: boolean;
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
  players: number;
}