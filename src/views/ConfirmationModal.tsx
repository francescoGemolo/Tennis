import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import './ConfirmationModal.css';

const AUTO_DISMISS_MS = 4000;

interface ConfirmationModalProps {
  title: string;
  details: ReactNode;
  onClose: () => void;
}

export function ConfirmationModal({ title, details, onClose }: ConfirmationModalProps) {
  const [closing, setClosing] = useState(false);

  const dismiss = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    setClosing(true);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [dismiss]);

  return (
    <div
      className="confirmation-banner-wrapper"
      role="status"
      aria-live="polite"
      aria-labelledby="confirmation-title"
    >
      <div
        className={ `confirmation-banner${closing ? ' confirmation-banner--closing' : ''}` }
        onAnimationEnd={ () => closing && onClose() }
      >
        <div className="confirmation-content">
          <span className="confirmation-icon" aria-hidden="true">
            <HugeiconsIcon icon={ Tick02Icon } size={ 18 } strokeWidth={ 1.5 } />
          </span>

          <div className="confirmation-text">
            <h2 className="confirmation-title" id="confirmation-title">{ title }</h2>
            <p className="confirmation-details">{ details }</p>
          </div>
        </div>

        <button className="confirmation-done-btn" type="button" onClick={ dismiss }>
          Fatto
        </button>
      </div>
    </div>
  );
}