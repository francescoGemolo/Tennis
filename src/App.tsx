import { useEffect, useState, type ReactNode } from 'react';
import { AuthGate } from './auth/AuthGate';
import { AuthLoading } from './auth/AuthLoading';
import { AuthError } from './auth/AuthError';
import { ProfileSetup } from './auth/ProfileSetup';
import { useAuth } from './auth/AuthContext';
import { Hero } from './views/Hero';
import { BookingCalendar } from './views/BookingCalendar';
import { DateTimePicker } from './views/DateTimePicker';
import { BookingForm } from './views/BookingForm';
import { ConfirmationModal } from './views/ConfirmationModal';
import { Contacts } from './views/Contacts';
import { Account } from './views/Account';
import { GuestAccount } from './views/GuestAccount';
import { createBooking, createMessage, fetchMyBookings } from './services/bookings';
import { formatShortDate, toDateKey } from './calendar';
import type { AccountBooking, BookingFormValues, ContactFormValues, DurationHours, ViewId } from './types';
import './App.css';

interface Confirmation {
  title: string;
  details: ReactNode;
}

function App() {
  const { status, authUser, profile, isGuest, signOutUser } = useAuth();
  const [view, setView] = useState<ViewId>('welcome');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationHours | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [accountBookings, setAccountBookings] = useState<AccountBooking[]>([]);
  const [accountBookingsLoading, setAccountBookingsLoading] = useState(false);
  const [accountBookingsError, setAccountBookingsError] = useState(false);

  useEffect(() => {
    setView('welcome');
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedDuration(null);
    setConfirmation(null);
    setAccountBookings([]);
    setAccountBookingsError(false);
  }, [authUser?.uid]);

  useEffect(() => {
    if (view !== 'account' || !authUser || isGuest) return;

    let cancelled = false;
    setAccountBookingsLoading(true);
    setAccountBookingsError(false);
    fetchMyBookings(authUser.uid)
      .then((bookings) => {
        if (!cancelled) setAccountBookings(bookings);
      })
      .catch(() => {
        if (!cancelled) setAccountBookingsError(true);
      })
      .finally(() => {
        if (!cancelled) setAccountBookingsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [view, authUser, isGuest]);

  if (status === 'loading') return <AuthLoading />;
  if (status === 'signedOut') return <AuthGate />;
  if (status === 'error') return <AuthError />;
  if (status === 'needsProfile') return <ProfileSetup />;

  const uid = authUser!.uid;
  const userProfile = profile!;

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setView('datetime');
  }

  function handleSelectTime(time: string, durationHours: DurationHours) {
    setSelectedTime(time);
    setSelectedDuration(durationHours);
    setView('bookingForm');
  }

  async function handleBookingFormSubmit(values: BookingFormValues) {
    if (!selectedDate || !selectedTime || !selectedDuration) return;

    const dateKey = toDateKey(selectedDate);
    await createBooking({
      date: dateKey,
      time: selectedTime,
      durationHours: selectedDuration,
      userId: uid,
      ...values,
    });

    setConfirmation({
      title: 'Prenotazione confermata',
      details: (
        <>
          { formatShortDate(dateKey) } · <span className="confirmation-mono">{ selectedTime }</span> · <span className="confirmation-mono">{ selectedDuration }h</span>
        </>
      ),
    });
    setView('welcome');
  }

  async function handleContactSubmit(values: ContactFormValues) {
    await createMessage(values);
    setConfirmation({
      title: 'Messaggio inviato',
      details: 'Ti risponderemo presto.',
    });
    setView('welcome');
  }

  function handleLogout() {
    void signOutUser();
  }

  return (
    <main className="app">
      { view === 'welcome' && (
        <Hero
          onBook={ () => setView('booking') }
          onContact={ () => setView('contacts') }
          onAccount={ () => setView('account') }
        />
      ) }

      { view === 'booking' && (
        <BookingCalendar onBack={ () => setView('welcome') } onSelectDate={ handleSelectDate } />
      ) }

      { view === 'datetime' && selectedDate && (
        <DateTimePicker
          date={ selectedDate }
          onBack={ () => setView('booking') }
          onConfirm={ handleSelectTime }
        />
      ) }

      { view === 'bookingForm' && selectedDate && selectedTime && selectedDuration && (
        <BookingForm
          date={ selectedDate }
          time={ selectedTime }
          durationHours={ selectedDuration }
          onBack={ () => setView('datetime') }
          onSubmit={ handleBookingFormSubmit }
        />
      ) }

      { view === 'contacts' && (
        <Contacts onBack={ () => setView('welcome') } onSubmit={ handleContactSubmit } />
      ) }

      { view === 'account' && isGuest && (
        <GuestAccount onBack={ () => setView('welcome') } />
      ) }

      { view === 'account' && !isGuest && (
        <Account
          account={ {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            phone: userProfile.phone,
            memberSince: String(new Date(userProfile.createdAt).getFullYear()),
            bookings: accountBookings,
          } }
          bookingsLoading={ accountBookingsLoading }
          bookingsError={ accountBookingsError }
          onBack={ () => setView('welcome') }
          onBook={ () => setView('booking') }
          onLogout={ handleLogout }
        />
      ) }

      { confirmation && (
        <ConfirmationModal
          title={ confirmation.title }
          details={ confirmation.details }
          onClose={ () => setConfirmation(null) }
        />
      ) }
    </main>
  );
}

export default App;