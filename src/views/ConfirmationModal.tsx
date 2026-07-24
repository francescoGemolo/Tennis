import { useEffect, useState, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  details: ReactNode;
  onClose: () => void;
}

export function ConfirmationModal({ open, title, details, onClose }: ConfirmationModalProps) {
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
        className={`confirmation-banner${closing ? ' confirmation-banner--closing' : ''}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="confirmation-content">
          <span className="confirmation-icon" aria-hidden="true">
            <HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={1.5} />
          </span>

          <div className="confirmation-text">
            <h2 className="confirmation-title" id="confirmation-title">
              {title}
            </h2>
            <p className="confirmation-details">{details}</p>
          </div>
        </div>

        <button className="confirmation-done-btn" type="button" onClick={handleDoneClick}>
          Fatto
        </button>
      </div>
    </div>
  );
}