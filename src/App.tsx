import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthGate } from './auth/AuthGate';
import { AuthLoading } from './auth/AuthLoading';
import { AuthError } from './auth/AuthError';
import { ProfileSetup } from './auth/ProfileSetup';
import { Welcome } from './auth/Welcome';
import { useAuth } from './auth/AuthContext';
import { Hero } from './views/Hero';
import { BookingCalendar } from './views/BookingCalendar';
import { DateTimePicker } from './views/DateTimePicker';
import { BookingForm } from './views/BookingForm';
import { ConfirmationModal } from './views/ConfirmationModal';
import { Contacts } from './views/Contacts';
import { Account } from './views/Account';
import { GuestAccount } from './views/GuestAccount';
import { cancelBooking, createBooking, createMessage, fetchMyBookings } from './services/bookings';
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
  const [showWelcome, setShowWelcome] = useState(false);
  const prevStatusRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;
    if (prevStatus === 'needsProfile' && status === 'ready') {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

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

  let content: ReactNode;
  let contentKey: string;

  if (status === 'loading') {
    content = <AuthLoading />;
    contentKey = 'loading';
  } else if (status === 'signedOut') {
    content = <AuthGate />;
    contentKey = 'signedOut';
  } else if (status === 'error') {
    content = <AuthError />;
    contentKey = 'error';
  } else if (status === 'needsProfile') {
    content = <ProfileSetup />;
    contentKey = 'needsProfile';
  } else if (showWelcome && !isGuest && profile) {
    content = <Welcome name={ profile.firstName } />;
    contentKey = 'welcomeScreen';
  } else {
    const uid = authUser!.uid;
    const userProfile = profile!;

    const handleSelectDate = (date: Date) => {
      setSelectedDate(date);
      setView('datetime');
    };

    const handleSelectTime = (time: string, durationHours: DurationHours) => {
      setSelectedTime(time);
      setSelectedDuration(durationHours);
      setView('bookingForm');
    };

    const handleBookingFormSubmit = async (values: BookingFormValues) => {
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
            { formatShortDate(dateKey) } · <span className="font-mono">{ selectedTime }</span> · <span className="font-mono">{ selectedDuration }h</span>
          </>
        ),
      });
      setView('welcome');
    };

    const handleContactSubmit = async (values: ContactFormValues) => {
      await createMessage(values);
      setConfirmation({
        title: 'Messaggio inviato',
        details: 'Ti risponderemo presto.',
      });
      setView('welcome');
    };

    const handleLogout = () => {
      void signOutUser();
    };

    const handleCancelBooking = async (booking: AccountBooking) => {
      await cancelBooking(booking);
      setAccountBookings((prev) => prev.filter((b) => b.id !== booking.id));
      setConfirmation({
        title: 'Prenotazione annullata',
        details: (
          <>
            { formatShortDate(booking.date) } · <span className="font-mono">{ booking.time }</span>
          </>
        ),
      });
    };

    content = (
      <main className="app max-w-[480px] md:max-w-[560px] mx-auto h-full">
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
            onCancelBooking={ handleCancelBooking }
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
    contentKey = 'app';
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={ contentKey }
        initial={ { opacity: 0 } }
        animate={ { opacity: 1 } }
        exit={ { opacity: 0 } }
        transition={ { duration: 0.2, ease: 'easeOut' } }
      >
        { content }
      </motion.div>
    </AnimatePresence>
  );
}

export default App;