import { useEffect, useState, type ReactNode } from 'react';
import { Hero } from './views/Hero';
import { BookingCalendar } from './views/BookingCalendar';
import { DateTimePicker } from './views/DateTimePicker';
import { BookingForm } from './views/BookingForm';
import { ConfirmationModal } from './views/ConfirmationModal';
import { Contacts } from './views/Contacts';
import { Admin } from './admin/Admin';
import { createBooking, createMessage } from './services/bookings';
import { formatFullDate, toDateKey } from './calendar';
import { PRICE_PER_HOUR } from './config';
import type { BookingFormValues, ContactFormValues, DurationHours, ViewId } from './types';
import './App.css';

interface Confirmation {
  title: string;
  details: ReactNode;
}

function useIsAdminRoute(): boolean {
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === '#admin');

  useEffect(() => {
    function handleHashChange() {
      setIsAdminRoute(window.location.hash === '#admin');
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return isAdminRoute;
}

function App() {
  const isAdminRoute = useIsAdminRoute();
  const [view, setView] = useState<ViewId>('welcome');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationHours | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

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

    await createBooking({
      date: toDateKey(selectedDate),
      time: selectedTime,
      durationHours: selectedDuration,
      ...values,
    });

    const totalPrice = selectedDuration * PRICE_PER_HOUR;
    setConfirmation({
      title: 'Prenotazione confermata',
      details: (
        <>
          {formatFullDate(selectedDate)} - <span className="confirmation-mono">{selectedTime}</span> - <span className="confirmation-mono">{selectedDuration}h · {totalPrice} €</span>
        </>
      ),
    });
    setView('welcome');
  }

  function handleConfirmationClose() {
    setConfirmation(null);
  }

  async function handleContactSubmit(values: ContactFormValues) {
    await createMessage(values);
    setConfirmation({
      title: 'Messaggio inviato',
      details: 'Ti risponderemo il prima possibile.',
    });
    setView('welcome');
  }

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <main className="app">
      { view === 'welcome' && (
        <Hero onBook={ () => setView('booking') } onContact={ () => setView('contacts') } />
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

      { confirmation && (
        <ConfirmationModal
          open
          title={ confirmation.title }
          details={ confirmation.details }
          onClose={ handleConfirmationClose }
        />
      ) }
    </main>
  );
}

export default App;