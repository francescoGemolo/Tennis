import { Icon } from '../../icons/Icon';
import { formatFullDate } from '../../data/calendar';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  open: boolean;
  date: Date;
  time: string;
  players: number;
  onClose: () => void;
}

export function ConfirmationModal({ open, date, time, players, onClose }: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="confirmation-overlay" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
      <div className="confirmation-modal">
        <span className="confirmation-icon">
          <Icon name="check" size={26} />
        </span>

        <h2 className="view-title" id="confirmation-title">Prenotazione confermata</h2>
        <p className="confirmation-subtitle">Ti aspettiamo in campo, a presto.</p>

        <dl className="confirmation-summary">
          <div className="confirmation-row">
            <dt>Data</dt>
            <dd>{formatFullDate(date)}</dd>
          </div>
          <div className="confirmation-row">
            <dt>Ora</dt>
            <dd>{time}</dd>
          </div>
          <div className="confirmation-row">
            <dt>Persone</dt>
            <dd>{players}</dd>
          </div>
        </dl>

        <button className="icon-cta cta-primary confirmation-done" type="button" onClick={onClose}>
          Fatto
        </button>
      </div>
    </div>
  );
}