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
    <div
      className="confirmation-banner-wrapper"
      role="status"
      aria-live="polite"
      aria-labelledby="confirmation-title"
    >
      <div className="confirmation-banner">
        <div className="confirmation-content">
          <span className="confirmation-icon" aria-hidden="true">
            <Icon name="check" size={18} />
          </span>

          <div className="confirmation-text">
            <h2 className="confirmation-title" id="confirmation-title">
              Prenotazione confermata
            </h2>
            <p className="confirmation-details">
              <span>{formatFullDate(date)}</span> - <span className="confirmation-mono">{time}</span> - <span className="confirmation-mono">{players}p</span>
            </p>
          </div>
        </div>

        <button className="confirmation-done-btn" type="button" onClick={onClose}>
          Fatto
        </button>
      </div>
    </div>
  );
}