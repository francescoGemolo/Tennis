import { useCallback, useEffect, useState, type ReactNode } from 'react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  isSubmitting?: boolean;
  error?: string | null;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Annulla',
  danger = false,
  isSubmitting = false,
  error,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [closing, setClosing] = useState(false);

  const handleCancel = useCallback(() => {
    if (isSubmitting) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCancel();
      return;
    }
    setClosing(true);
  }, [isSubmitting, onCancel]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') handleCancel();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCancel]);

  return (
    <div
      className={ `confirm-overlay${closing ? ' confirm-overlay--closing' : ''}` }
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={ handleCancel }
      onAnimationEnd={ () => closing && onCancel() }
    >
      <div className={ `confirm-panel${closing ? ' confirm-panel--closing' : ''}` } onClick={ (e) => e.stopPropagation() }>
        <h2 className="confirm-title" id="confirm-dialog-title">{ title }</h2>
        <div className="confirm-message">{ message }</div>

        { children }

        { error && <p className="form-error" role="alert">{ error }</p> }

        <div className="confirm-actions">
          <button type="button" className="btn-ghost" onClick={ handleCancel } disabled={ isSubmitting }>
            { cancelLabel }
          </button>
          <button
            type="button"
            className={ `icon-cta ${danger ? 'cta-danger' : 'cta-primary'}` }
            onClick={ onConfirm }
            disabled={ isSubmitting }
          >
            { isSubmitting ? 'Attendere…' : confirmLabel }
          </button>
        </div>
      </div>
    </div>
  );
}