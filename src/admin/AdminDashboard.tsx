import { useEffect, useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, Download04Icon } from '@hugeicons/core-free-icons';
import { cancelBooking, fetchAllBookings } from '../services/bookings';
import { signOutAdmin } from '../services/auth';
import type { AdminBooking } from '../types';
import './Admin.css';

export function AdminDashboard() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAllBookings();
      setBookings(result);
    } catch {
      setError('Impossibile caricare le prenotazioni.');
    } finally {
      setIsLoading(false);
    }
  }

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
    const header = ['Data', 'Ora', 'Durata (h)', 'Nome', 'Cognome', 'Telefono', 'Creata il'];
    const rows = filtered.map((b) => [b.date, b.time, String(b.durationHours), b.firstName, b.lastName, b.phone, b.createdAt]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prenotazioni_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="view admin-dashboard" aria-labelledby="admin-dashboard-title">
      <div className="admin-dashboard-header">
        <h2 className="view-title" id="admin-dashboard-title">Prenotazioni</h2>
        <button type="button" className="btn-ghost" onClick={signOutAdmin}>Esci</button>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          className="admin-input"
          placeholder="Cerca cliente o telefono"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="admin-icon-btn"
          aria-label="Esporta CSV"
          onClick={handleExportCsv}
          disabled={filtered.length === 0}
        >
          <HugeiconsIcon icon={Download04Icon} size={20} strokeWidth={1.5} />
        </button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      {isLoading ? (
        <p className="section-label">Caricamento…</p>
      ) : filtered.length === 0 ? (
        <p className="section-label">Nessuna prenotazione trovata.</p>
      ) : (
        <>
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
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.durationHours}h</td>
                    <td>{b.firstName} {b.lastName}</td>
                    <td>{b.phone}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-delete-btn"
                        disabled={deletingId === b.id}
                        aria-label={`Elimina prenotazione di ${b.firstName} ${b.lastName}`}
                        onClick={() => handleCancel(b)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={18} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="admin-cards">
            {filtered.map((b) => (
              <li className="admin-card" key={b.id}>
                <div className="admin-card-header">
                  <span className="admin-card-name">{b.firstName} {b.lastName}</span>
                  <button
                    type="button"
                    className="admin-delete-btn"
                    disabled={deletingId === b.id}
                    aria-label={`Elimina prenotazione di ${b.firstName} ${b.lastName}`}
                    onClick={() => handleCancel(b)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={20} strokeWidth={1.5} />
                  </button>
                </div>
                <dl className="admin-card-body">
                  <div className="admin-card-row">
                    <dt>Data</dt>
                    <dd>{b.date}</dd>
                  </div>
                  <div className="admin-card-row">
                    <dt>Ora</dt>
                    <dd>{b.time}</dd>
                  </div>
                  <div className="admin-card-row">
                    <dt>Durata</dt>
                    <dd>{b.durationHours}h</dd>
                  </div>
                  <div className="admin-card-row">
                    <dt>Telefono</dt>
                    <dd>{b.phone}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}