import { useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CallIcon, Calendar03Icon, Clock01Icon, CoinsEuroIcon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { formatShortDate } from '../calendar';
import { bookingPrice, formatPrice } from '../pricing';
import type { Account as AccountData } from '../types';
import './Account.css';

interface AccountProps {
  account: AccountData;
  onBack: () => void;
}

export function Account({ account, onBack }: AccountProps) {
  const { firstName, lastName, phone, memberSince, bookings } = account;

  const stats = useMemo(() => {
    const hours = bookings.reduce((total, booking) => total + booking.durationHours, 0);
    const spent = bookings.reduce((total, booking) => total + bookingPrice(booking.durationHours), 0);
    return [
      { icon: Calendar03Icon, label: 'Prenotazioni', value: String(bookings.length) },
      { icon: Clock01Icon, label: 'Ore', value: `${hours}h` },
      { icon: CoinsEuroIcon, label: 'Spesa', value: formatPrice(spent) },
    ];
  }, [bookings]);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <section className="view account" aria-labelledby="account-title">
      <div className="view-header">
        <BackButton onClick={ onBack } />
        <h2 className="view-title" id="account-title">Area personale</h2>
      </div>

      <div className="view-scroll">
        <div className="card account-profile">
          <span className="account-avatar" aria-hidden="true">{ initials }</span>
          <div className="account-identity">
            <span className="account-name">{ firstName } { lastName }</span>
            <span className="section-label">Membro dal { memberSince }</span>
          </div>
        </div>

        <div className="card account-contact">
          <span className="account-contact-icon">
            <HugeiconsIcon icon={ CallIcon } size={ 16 } strokeWidth={ 1.5 } />
          </span>
          <span className="section-label">Telefono</span>
          <span className="account-mono">{ phone }</span>
        </div>

        <ul className="account-stats">
          { stats.map((stat) => (
            <li className="card account-stat" key={ stat.label }>
              <span className="account-stat-icon">
                <HugeiconsIcon icon={ stat.icon } size={ 16 } strokeWidth={ 1.5 } />
              </span>
              <span className="section-label account-stat-label">{ stat.label }</span>
              <span className="account-stat-value">{ stat.value }</span>
            </li>
          )) }
        </ul>

        <span className="section-label account-section-title">Le tue prenotazioni</span>

        { bookings.length === 0 ? (
          <p className="account-empty">Non hai ancora prenotazioni.</p>
        ) : (
          <ul className="account-bookings">
            { bookings.map((booking) => (
              <li className="card account-booking" key={ booking.id }>
                <span className="account-booking-date">{ formatShortDate(booking.date) }</span>
                <span className="account-mono">{ booking.time } · { booking.durationHours }h</span>
                <span className="account-booking-price">{ formatPrice(bookingPrice(booking.durationHours)) }</span>
              </li>
            )) }
          </ul>
        ) }
      </div>
    </section>
  );
}