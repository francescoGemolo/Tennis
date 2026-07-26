import { useCallback, useEffect, useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, Download04Icon } from '@hugeicons/core-free-icons';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cancelBooking, fetchAllBookings } from '../services/bookings';
import { signOutUser } from '../services/auth';
import type { AdminBooking } from '../types';
import './Admin.css';

const COMPACT_QUERY = '(max-width: 767px)';

const CSV_HEADER = ['Data', 'Ora', 'Durata (h)', 'Nome', 'Cognome', 'Telefono', 'Creata il'];

const CARD_ROWS: { label: string; value: (booking: AdminBooking) => string }[] = [
  { label: 'Data', value: (b) => b.date },
  { label: 'Ora', value: (b) => b.time },
  { label: 'Durata', value: (b) => `${b.durationHours}h` },
  { label: 'Telefono', value: (b) => b.phone },
];

function toCsv(bookings: AdminBooking[]): string {
  const rows = bookings.map((b) => [b.date, b.time, String(b.durationHours), b.firstName, b.lastName, b.phone, b.createdAt]);
  return [CSV_HEADER, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

export function AdminDashboard() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isCompact = useMediaQuery(COMPACT_QUERY);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setBookings(await fetchAllBookings());
    } catch {
      setError('Impossibile caricare le prenotazioni.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) => {
      const name = `${b.firstName} ${b.lastName}`.toLowerCase();
      return name.includes(q) || b.phone.includes(q);
    });
  }, [bookings, search]);

  async function handleCancel(booking: AdminBooking) {
    if (!window.confirm(`Cancellare la prenotazione di ${booking.firstName} ${booking.lastName} (${booking.date} ${booking.time})?`)) return;
    setDeletingId(booking.id);
    setError(null);
    try {
      await cancelBooking(booking);
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    } catch {
      setError('Impossibile cancellare la prenotazione. Riprova.');
    } finally {
      setDeletingId(null);
    }
  }

  function handleExportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prenotazioni_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderDeleteButton(booking: AdminBooking, size: number) {
    return (
      <button
        type="button"
        className="admin-delete-btn"
        disabled={ deletingId === booking.id }
        aria-label={ `Elimina prenotazione di ${booking.firstName} ${booking.lastName}` }
        onClick={ () => handleCancel(booking) }
      >
        <HugeiconsIcon icon={ Delete02Icon } size={ size } strokeWidth={ 1.5 } />
      </button>
    );
  }

  return (
    <section className="view admin-dashboard" aria-labelledby="admin-dashboard-title">
      <div className="view-header-row">
        <h2 className="view-title" id="admin-dashboard-title">Prenotazioni</h2>
        <button type="button" className="btn-ghost" onClick={ signOutUser }>Esci</button>
      </div>

      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-input"
          aria-label="Cerca prenotazione"
          placeholder="Cerca cliente o telefono"
          value={ search }
          onChange={ (e) => setSearch(e.target.value) }
        />
        <button
          type="button"
          className="admin-icon-btn"
          aria-label="Esporta CSV"
          onClick={ handleExportCsv }
          disabled={ filtered.length === 0 }
        >
          <HugeiconsIcon icon={ Download04Icon } size={ 20 } strokeWidth={ 1.5 } />
        </button>
      </div>

      { error && <p className="form-error" role="alert">{ error }</p> }

      { isLoading && <p className="section-label">Caricamento…</p> }

      { !isLoading && filtered.length === 0 && <p className="section-label">Nessuna prenotazione trovata.</p> }

      { !isLoading && filtered.length > 0 && (
        isCompact ? (
          <ul className="admin-cards">
            { filtered.map((b) => (
              <li className="admin-card" key={ b.id }>
                <div className="admin-card-header">
                  <span className="admin-card-name">{ b.firstName } { b.lastName }</span>
                  { renderDeleteButton(b, 20) }
                </div>
                <dl className="admin-card-body">
                  { CARD_ROWS.map((row) => (
                    <div className="admin-card-row" key={ row.label }>
                      <dt>{ row.label }</dt>
                      <dd>{ row.value(b) }</dd>
                    </div>
                  )) }
                </dl>
              </li>
            )) }
          </ul>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Ora</th>
                  <th>Durata</th>
                  <th>Cliente</th>
                  <th>Telefono</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                { filtered.map((b) => (
                  <tr key={ b.id }>
                    <td>{ b.date }</td>
                    <td>{ b.time }</td>
                    <td>{ b.durationHours }h</td>
                    <td>{ b.firstName } { b.lastName }</td>
                    <td>{ b.phone }</td>
                    <td>{ renderDeleteButton(b, 18) }</td>
                  </tr>
                )) }
              </tbody>
            </table>
          </div>
        )
      ) }
    </section>
  );
}