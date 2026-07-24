import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { formatFullDate } from '../calendar';
import { PRICE_PER_HOUR } from '../config';
import type { DurationHours } from '../types';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  open: boolean;
  date: Date;
  time: string;
  durationHours: DurationHours;
  onClose: () => void;
}

export function ConfirmationModal({ open, date, time, durationHours, onClose }: ConfirmationModalProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        onClose();
      } else {
        setClosing(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  const totalPrice = durationHours * PRICE_PER_HOUR;

  function handleDoneClick() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onClose();
      return;
    }
    setClosing(true);
  }

  function handleAnimationEnd() {
    if (closing) onClose();
  }

  return (
    <div
      className="confirmation-banner-wrapper"
      role="status"
      aria-live="polite"
      aria-labelledby="confirmation-title"
    >
      <div
        className={ `confirmation-banner${closing ? ' confirmation-banner--closing' : ''}` }
        onAnimationEnd={ handleAnimationEnd }
      >
        <div className="confirmation-content">
          <span className="confirmation-icon" aria-hidden="true">
            <Icon name="check" size={ 18 } />
          </span>

          <div className="confirmation-text">
            <h2 className="confirmation-title" id="confirmation-title">
              Prenotazione confermata
            </h2>
            <p className="confirmation-details">
              <span>{ formatFullDate(date) }</span> - <span className="confirmation-mono">{ time }</span> - <span className="confirmation-mono">{ durationHours }h · { totalPrice } €</span>
            </p>
          </div>
        </div>

        <button className="confirmation-done-btn" type="button" onClick={ handleDoneClick }>
          Fatto
        </button>
      </div>
    </div>
  );
}