import { useState } from 'react';
import { Hero } from './components/Hero/Hero';
import { BookingCalendar } from './components/BookingCalendar/BookingCalendar';
import { DateTimePicker } from './components/DateTimePicker/DateTimePicker';
import { BookingForm } from './components/BookingForm/BookingForm';
import { Contacts } from './components/Contacts/Contacts';
import type { BookingFormValues, ContactFormValues, ViewId } from './types/booking';
import './App.css';

function App() {
  const [view, setView] = useState<ViewId>('welcome');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setView('datetime');
  }

  function handleSelectTime(time: string) {
    setSelectedTime(time);
    setView('bookingForm');
  }

  function handleBookingFormSubmit(values: BookingFormValues) {
    // Raccolta dati temporanea, in attesa dell'integrazione con Firebase
    console.log('Nuova prenotazione (temporanea)', {
      date: selectedDate,
      time: selectedTime,
      ...values,
    });
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
    </main>
  );
}

export default App;