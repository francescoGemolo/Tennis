import { useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CallIcon, Calendar03Icon, Clock01Icon, CoinsEuroIcon, Delete02Icon, TennisBallIcon } from '@hugeicons/core-free-icons';
import { BackButton } from '../components/BackButton';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PasswordField } from '../components/PasswordField';
import { TennisBallLoader } from '../components/TennisBallLoader';
import { useAuth } from '../auth/AuthContext';
import { firebaseErrorCode } from '../services/auth';
import { formatShortDate, toDateKey } from '../calendar';
import { bookingPrice, formatPrice } from '../pricing';
import type { Account as AccountData, AccountBooking } from '../types';

interface AccountProps {
  account: AccountData;
  bookingsLoading: boolean;
  bookingsError: boolean;
  onBack: () => void;
  onBook: () => void;
  onLogout: () => void;
  onCancelBooking: (booking: AccountBooking) => Promise<void>;
}

export function Account({ account, bookingsLoading, bookingsError, onBack, onBook, onLogout, onCancelBooking }: AccountProps) {
  const { firstName, lastName, phone, memberSince, bookings } = account;
  const {
    authUser,
    deleteAccount,
    reauthenticateWithPassword,
    reauthenticateWithGooglePopup,
    getAuthProviderId,
    isReauthRecent,
  } = useAuth();

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [cancelTarget, setCancelTarget] = useState<AccountBooking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const todayKey = toDateKey(new Date());

  function closeCancelDialog() {
    if (isCancelling) return;
    setCancelTarget(null);
    setCancelError(null);
  }

  async function handleConfirmCancel() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      await onCancelBooking(cancelTarget);
      setCancelTarget(null);
    } catch {
      setCancelError('Non è stato possibile annullare la prenotazione. Riprova.');
    } finally {
      setIsCancelling(false);
    }
  }

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
        await reauthenticateWithGooglePopup();
      } catch {
        setDeleteError('Non è stato possibile verificare la tua identità con Google. Riprova.');
        setIsDeleting(false);
        return;
      }
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      const code = firebaseErrorCode(error);
      setDeleteError(
        code === 'auth/requires-recent-login'
          ? 'Sessione scaduta. Esegui di nuovo l\'accesso e riprova subito dopo.'
          : 'Non è stato possibile eliminare l\'account. Riprova.',
      );
      setIsDeleting(false);
    }
  }

  return (
    <section className="view" aria-labelledby="account-title">
      <div className="view-header">
        <div className="view-header-row">
          <BackButton onClick={ onBack } />
          <button type="button" className="btn-ghost" onClick={ () => setLogoutConfirmOpen(true) }>Esci</button>
        </div>
        <h2 className="view-title" id="account-title">Area personale</h2>
      </div>

      <div className="view-scroll">
        <div className="card flex items-center gap-3 p-4 shrink-0">
          <span
            className="flex items-center justify-center w-12 h-12 shrink-0 border-hairline rounded-full bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] text-accent font-mono text-md font-medium"
            aria-hidden="true"
          >
            { initials }
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-semibold text-neutral-50 overflow-hidden text-ellipsis whitespace-nowrap">{ firstName } <span className="text-accent">{ lastName }</span></span>
            <span className="section-label">Membro dal { memberSince }</span>
          </div>
        </div>

        <div className="card flex items-center gap-3 py-3 px-4 shrink-0">
          <span className="info-icon w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]">
            <HugeiconsIcon icon={ CallIcon } size={ 16 } strokeWidth={ 1.5 } />
          </span>
          <span className="section-label flex-1">Telefono</span>
          <span className="font-mono text-sm text-neutral-50 whitespace-nowrap">{ phone }</span>
        </div>

        <ul className="card flex flex-col py-1 px-4 shrink-0">
          { stats.map((stat, index) => (
            <li
              className={ `flex items-center gap-3 py-3${index > 0 ? ' border-t border-t-[#323b4750]' : ''}` }
              key={ stat.label }
            >
              <span className="info-icon w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]">
                <HugeiconsIcon icon={ stat.icon } size={ 16 } strokeWidth={ 1.5 } />
              </span>
              <span className="section-label flex-1 max-[359px]:text-[0.625rem] max-[359px]:tracking-normal">{ stat.label }</span>
              <span className="font-mono text-sm font-semibold text-neutral-50 whitespace-nowrap max-[359px]:text-xs">{ stat.value }</span>
            </li>
          )) }
        </ul>

        <span className="section-label mt-2">Le tue prenotazioni</span>

        { bookingsError ? (
          <p className="form-error" role="alert">Impossibile caricare le prenotazioni. Riprova più tardi.</p>
        ) : bookingsLoading ? (
          <div className="loading-state">
            <TennisBallLoader size="sm" />
            <span className="section-label">Caricamento…</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-neutral-500 max-[359px]:text-xs">Ancora nessuna prenotazione qui, prenota ora.</p>
            <button className="icon-cta cta-primary self-stretch" type="button" onClick={ onBook }>
              <HugeiconsIcon icon={ TennisBallIcon } size={ 16 } strokeWidth={ 1.5 } className="icon-primary" />
              Prenota
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            { bookings.map((booking) => (
              <li className="card flex items-center justify-between gap-3 py-3 px-4 max-[359px]:p-3" key={ booking.id }>
                <span className="text-sm font-semibold text-neutral-50 whitespace-nowrap capitalize">{ formatShortDate(booking.date) }</span>
                <span className="font-mono text-sm text-neutral-50 whitespace-nowrap">{ booking.time } - { booking.durationHours }h</span>
                <span className="font-mono text-sm text-accent whitespace-nowrap">{ formatPrice(bookingPrice(booking.durationHours)) }</span>
                { booking.date >= todayKey && (
                  <button
                    type="button"
                    className="flex items-center justify-center shrink-0 p-0 border-0 bg-transparent text-neutral-500 cursor-pointer hover:text-danger"
                    aria-label="Annulla prenotazione"
                    onClick={ () => setCancelTarget(booking) }
                  >
                    <HugeiconsIcon icon={ Delete02Icon } size={ 16 } strokeWidth={ 1.5 } />
                  </button>
                ) }
              </li>
            )) }
          </ul>
        ) }

        <button type="button" className="btn-ghost btn-ghost-danger self-center mt-2" onClick={ openConfirm }>
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

      { cancelTarget && (
        <ConfirmDialog
          title="Annulla prenotazione"
          message={ `Vuoi annullare la prenotazione del ${formatShortDate(cancelTarget.date)} alle ${cancelTarget.time}? L'orario tornerà disponibile.` }
          confirmLabel="Annulla prenotazione"
          danger
          isSubmitting={ isCancelling }
          error={ cancelError }
          onConfirm={ handleConfirmCancel }
          onCancel={ closeCancelDialog }
        />
      ) }

      { logoutConfirmOpen && (
        <ConfirmDialog
          title="Esci dall'account"
          message="Vuoi uscire dal tuo account?"
          confirmLabel="Esci"
          onConfirm={ () => {
            setLogoutConfirmOpen(false);
            onLogout();
          } }
          onCancel={ () => setLogoutConfirmOpen(false) }
        />
      ) }
    </section>
  );
}