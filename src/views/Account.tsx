import { useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CallIcon, Calendar03Icon, Clock01Icon, CoinsEuroIcon, TennisBallIcon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PasswordField } from '../components/PasswordField';
import { useAuth } from '../auth/AuthContext';
import { formatShortDate } from '../calendar';
import { bookingPrice, formatPrice } from '../pricing';
import type { Account as AccountData } from '../types';
import './Account.css';

interface AccountProps {
  account: AccountData;
  bookingsLoading: boolean;
  bookingsError: boolean;
  onBack: () => void;
  onBook: () => void;
  onLogout: () => void;
}

export function Account({ account, bookingsLoading, bookingsError, onBack, onBook, onLogout }: AccountProps) {
  const { firstName, lastName, phone, memberSince, bookings } = account;
  const {
    authUser,
    deleteAccount,
    reauthenticateWithPassword,
    reauthenticateWithGoogleRedirect,
    getAuthProviderId,
    isReauthRecent,
  } = useAuth();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  function openConfirm() {
    setDeleteError(null);
    setNeedsPassword(false);
    setReauthPassword('');
    setConfirmOpen(true);
  }

  function closeConfirm() {
    if (isDeleting) return;
    setConfirmOpen(false);
  }

  async function handleConfirmDelete() {
    if (!authUser) return;
    setDeleteError(null);

    if (needsPassword) {
      if (!reauthPassword) {
        setDeleteError('Inserisci la password per continuare.');
        return;
      }
      setIsDeleting(true);
      try {
        await reauthenticateWithPassword(reauthPassword);
      } catch {
        setDeleteError('Password errata.');
        setIsDeleting(false);
        return;
      }
    } else if (!isReauthRecent(authUser)) {
      const providerId = getAuthProviderId(authUser);
      if (providerId === 'password') {
        setNeedsPassword(true);
        return;
      }
      setIsDeleting(true);
      try {
        // Navigates away to Google and back; deletion resumes automatically on return.
        await reauthenticateWithGoogleRedirect();
      } catch {
        setDeleteError('Non è stato possibile verificare la tua identità con Google. Riprova.');
        setIsDeleting(false);
      }
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      const code = error instanceof Error ? (error as { code?: string }).code : undefined;
      setDeleteError(
        code === 'auth/requires-recent-login'
          ? 'Sessione scaduta. Esegui di nuovo l\'accesso e riprova subito dopo.'
          : 'Non è stato possibile eliminare l\'account. Riprova.',
      );
      setIsDeleting(false);
    }
  }

  return (
    <section className="view account" aria-labelledby="account-title">
      <div className="view-header">
        <div className="view-header-row">
          <BackButton onClick={ onBack } />
          <button type="button" className="btn-ghost" onClick={ onLogout }>Esci</button>
        </div>
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

        <ul className="card account-stats">
          { stats.map((stat) => (
            <li className="account-stat" key={ stat.label }>
              <span className="account-stat-icon">
                <HugeiconsIcon icon={ stat.icon } size={ 16 } strokeWidth={ 1.5 } />
              </span>
              <span className="section-label account-stat-label">{ stat.label }</span>
              <span className="account-stat-value">{ stat.value }</span>
            </li>
          )) }
        </ul>

        <span className="section-label account-section-title">Le tue prenotazioni</span>

        { bookingsError ? (
          <p className="form-error" role="alert">Impossibile caricare le prenotazioni. Riprova più tardi.</p>
        ) : bookingsLoading ? (
          <p className="section-label">Caricamento…</p>
        ) : bookings.length === 0 ? (
          <div className="account-empty-state">
            <p className="account-empty">Ancora nessuna prenotazione qui, prenota ora.</p>
            <button className="icon-cta cta-primary" type="button" onClick={ onBook }>
              <HugeiconsIcon icon={ TennisBallIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
              Prenota
            </button>
          </div>
        ) : (
          <ul className="account-bookings">
            { bookings.map((booking) => (
              <li className="card account-booking" key={ booking.id }>
                <span className="account-booking-date">{ formatShortDate(booking.date) }</span>
                <span className="account-mono">{ booking.time } - { booking.durationHours }h</span>
                <span className="account-booking-price">{ formatPrice(bookingPrice(booking.durationHours)) }</span>
              </li>
            )) }
          </ul>
        ) }

        <button type="button" className="btn-ghost btn-ghost-danger account-delete-link" onClick={ openConfirm }>
          Elimina account
        </button>
      </div>

      { confirmOpen && (
        <ConfirmDialog
          title="Elimina account"
          message={ needsPassword
            ? 'Per motivi di sicurezza conferma la tua password per continuare.'
            : 'Il profilo e le prenotazioni future verranno eliminati definitivamente e gli orari torneranno disponibili. Le prenotazioni passate restano come storico. L\'operazione non è reversibile.'
          }
          confirmLabel={ needsPassword ? 'Conferma password' : 'Elimina account' }
          danger
          isSubmitting={ isDeleting }
          error={ deleteError }
          onConfirm={ handleConfirmDelete }
          onCancel={ closeConfirm }
        >
          { needsPassword && (
            <PasswordField
              id="delete-account-password"
              label="Password attuale"
              autoComplete="current-password"
              value={ reauthPassword }
              onChange={ setReauthPassword }
            />
          ) }
        </ConfirmDialog>
      ) }
    </section>
  );
}