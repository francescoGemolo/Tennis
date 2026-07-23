import type { BookingFormValues } from '../types/booking';

const STORAGE_KEY = 'tennis-bookings-temp';

export interface StoredBooking extends BookingFormValues {
  date: string;
  time: string;
  createdAt: string;
}

/**
 * Persistenza temporanea, solo per verificare il comportamento dell'app
 * prima di collegare un vero backend (es. Firebase).
 * I dati restano nel browser (localStorage) e non vengono inviati altrove;
 * si perdono se si svuota la cache o si cambia dispositivo.
 */
export function saveBookingTemp(booking: StoredBooking): void {
  try {
    const existing = getStoredBookings();
    const updated = [...existing, booking];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage non disponibile (es. modalità privata): la prenotazione
    // resta comunque visibile nella console per il debug locale.
  }
}

export function getStoredBookings(): StoredBooking[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredBooking[]) : [];
  } catch {
    return [];
  }
}