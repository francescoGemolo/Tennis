import { addDoc, collection, doc, getDocs, query, runTransaction, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { getOccupiedTimes } from '../calendar';
import type { AdminBooking, AvailabilityRecord, BookingFormValues, ContactFormValues, DurationHours } from '../types';

const AVAILABILITY_COLLECTION = 'availability';
const BOOKINGS_COLLECTION = 'bookings';
const MESSAGES_COLLECTION = 'messages';
const SLOT_LOCKS_COLLECTION = 'slotLocks';

export class SlotUnavailableError extends Error {
  constructor() {
    super('Uno degli orari selezionati è stato appena prenotato da qualcun altro. Scegli un altro orario.');
    this.name = 'SlotUnavailableError';
  }
}

export async function fetchBookingsForDate(dateKey: string): Promise<AvailabilityRecord[]> {
  const q = query(collection(db, AVAILABILITY_COLLECTION), where('date', '==', dateKey));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as AvailabilityRecord);
}

export async function fetchBookingsForMonth(monthStartKey: string, monthEndKey: string): Promise<AvailabilityRecord[]> {
  const q = query(
    collection(db, AVAILABILITY_COLLECTION),
    where('date', '>=', monthStartKey),
    where('date', '<=', monthEndKey),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as AvailabilityRecord);
}

interface CreateBookingInput extends BookingFormValues {
  date: string;
  time: string;
  durationHours: DurationHours;
}

export async function createBooking(input: CreateBookingInput): Promise<void> {
  const { date, time, durationHours, firstName, lastName, phone } = input;
  const requiredTimes = getOccupiedTimes({ date, time, durationHours });
  const lockRefs = requiredTimes.map((t) => doc(db, SLOT_LOCKS_COLLECTION, `${date}_${t}`));

  await runTransaction(db, async (transaction) => {
    const lockSnapshots = await Promise.all(lockRefs.map((ref) => transaction.get(ref)));
    if (lockSnapshots.some((snapshot) => snapshot.exists())) {
      throw new SlotUnavailableError();
    }

    const createdAt = new Date().toISOString();

    lockRefs.forEach((ref) => transaction.set(ref, { date, createdAt }));

    const availabilityRef = doc(collection(db, AVAILABILITY_COLLECTION));
    transaction.set(availabilityRef, { date, time, durationHours, createdAt });

    const bookingRef = doc(collection(db, BOOKINGS_COLLECTION));
    transaction.set(bookingRef, {
      date,
      time,
      durationHours,
      firstName,
      lastName,
      phone,
      createdAt,
      availabilityId: availabilityRef.id,
    });
  });
}

export async function createMessage(values: ContactFormValues): Promise<void> {
  await addDoc(collection(db, MESSAGES_COLLECTION), { ...values, createdAt: new Date().toISOString() });
}

export async function fetchAllBookings(): Promise<AdminBooking[]> {
  const snapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
  return snapshot.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<AdminBooking, 'id'>) }))
    .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
}

export async function cancelBooking(booking: AdminBooking): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, BOOKINGS_COLLECTION, booking.id));
  batch.delete(doc(db, AVAILABILITY_COLLECTION, booking.availabilityId));
  const occupiedTimes = getOccupiedTimes(booking);
  occupiedTimes.forEach((t) => {
    batch.delete(doc(db, SLOT_LOCKS_COLLECTION, `${booking.date}_${t}`));
  });
  await batch.commit();
}