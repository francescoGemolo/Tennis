import { useEffect, useMemo, useState } from 'react';
import { cancelBooking, fetchAllBookings } from '../../services/bookings';
import { signOutAdmin } from '../../services/auth';
import type { AdminBooking } from '../../types/booking';
import './Admin.css';

export function AdminDashboard() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
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
    return bookings.filter((b) => {
      if (dateFrom && b.date < dateFrom) return false;
      if (dateTo && b.date > dateTo) return false;
      if (search) {
        const q = search.trim().toLowerCase();
        const name = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (!name.includes(q) && !b.phone.includes(q)) return false;
      }
      return true;
    });
  }, [bookings, search, dateFrom, dateTo]);

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
        <input type="date" className="admin-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" className="admin-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <button type="button" className="icon-cta cta-secondary" onClick={handleExportCsv} disabled={filtered.length === 0}>
          Esporta CSV
        </button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="admin-table-wrap">
        {isLoading ? (
          <p className="section-label">Caricamento…</p>
        ) : filtered.length === 0 ? (
          <p className="section-label">Nessuna prenotazione trovata.</p>
        ) : (
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
                      className="btn-ghost"
                      disabled={deletingId === b.id}
                      onClick={() => handleCancel(b)}
                    >
                      {deletingId === b.id ? 'Cancello…' : 'Elimina'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}