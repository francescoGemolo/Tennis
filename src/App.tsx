import { useState, type ReactNode } from 'react';
import { Hero } from './views/Hero';
import { BookingCalendar } from './views/BookingCalendar';
import { DateTimePicker } from './views/DateTimePicker';
import { BookingForm } from './views/BookingForm';
import { ConfirmationModal } from './views/ConfirmationModal';
import { Contacts } from './views/Contacts';
import { Account } from './views/Account';
import { PLACEHOLDER_ACCOUNT } from './account';
import { createBooking, createMessage } from './services/bookings';
import { formatShortDate, toDateKey } from './calendar';
import type { BookingFormValues, ContactFormValues, DurationHours, ViewId } from './types';
import './App.css';

interface Confirmation {
  title: string;
  details: ReactNode;
}

function App() {
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

    const dateKey = toDateKey(selectedDate);
    await createBooking({
      date: dateKey,
      time: selectedTime,
      durationHours: selectedDuration,
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
      details: 'Ti risponderemo il prima possibile.',
    });
    setView('welcome');
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

      { view === 'account' && (
        <Account account={ PLACEHOLDER_ACCOUNT } onBack={ () => setView('welcome') } />
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