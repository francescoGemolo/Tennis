import { useState } from 'react';
import { Hero } from './components/Hero/Hero';
import { BookingCalendar } from './components/BookingCalendar/BookingCalendar';
import { DateTimePicker } from './components/DateTimePicker/DateTimePicker';
import { BookingForm } from './components/BookingForm/BookingForm';
import { ConfirmationModal } from './components/ConfirmationModal/ConfirmationModal';
import { Contacts } from './components/Contacts/Contacts';
import { saveBookingTemp } from './utils/storage';
import { toDateKey } from './data/calendar';
import type { BookingFormValues, ContactFormValues, ViewId } from './types/booking';
import './App.css';

interface ConfirmedBooking {
  date: Date;
  time: string;
  players: number;
}

function App() {
  const [view, setView] = useState<ViewId>('welcome');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setView('datetime');
  }

  function handleSelectTime(time: string) {
    setSelectedTime(time);
    setView('bookingForm');
  }

  function handleBookingFormSubmit(values: BookingFormValues) {
    if (!selectedDate || !selectedTime) return;

    // Persistenza temporanea in localStorage, in attesa dell'integrazione
    // con un vero backend (es. Firebase). Vedi utils/storage.ts.
    saveBookingTemp({
      date: toDateKey(selectedDate),
      time: selectedTime,
      createdAt: new Date().toISOString(),
      ...values,
    });

    setConfirmedBooking({ date: selectedDate, time: selectedTime, players: values.players });
  }

  function handleConfirmationClose() {
    setConfirmedBooking(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setView('welcome');
  }

  function handleContactSubmit(values: ContactFormValues) {
    // TODO: inviare il messaggio (values) tramite Firebase
    void values;
    setView('welcome');
  }

  return (
    <main className="app">
      {view === 'welcome' && (
        <Hero onBook={() => setView('booking')} onContact={() => setView('contacts')} />
      )}

      {view === 'booking' && (
        <BookingCalendar onBack={() => setView('welcome')} onSelectDate={handleSelectDate} />
      )}

      {view === 'datetime' && selectedDate && (
        <DateTimePicker
          date={selectedDate}
          onBack={() => setView('booking')}
          onConfirm={handleSelectTime}
        />
      )}

      {view === 'bookingForm' && selectedDate && selectedTime && (
        <BookingForm
          date={selectedDate}
          time={selectedTime}
          onBack={() => setView('datetime')}
          onSubmit={handleBookingFormSubmit}
        />
      )}

      {view === 'contacts' && (
        <Contacts onBack={() => setView('welcome')} onSubmit={handleContactSubmit} />
      )}

      {confirmedBooking && (
        <ConfirmationModal
          open
          date={confirmedBooking.date}
          time={confirmedBooking.time}
          players={confirmedBooking.players}
          onClose={handleConfirmationClose}
        />
      )}
    </main>
  );
}

export default App;