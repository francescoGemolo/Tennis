import { useCallback, useEffect, useState, type ReactNode } from 'react';

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
      className={ `modal-overlay${closing ? ' modal-overlay--closing' : ''}` }
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={ handleCancel }
      onAnimationEnd={ () => closing && onCancel() }
    >
      <div
        className={ `modal-panel w-full max-w-[22rem] px-4 py-5${closing ? ' modal-panel--closing' : ''}` }
        onClick={ (e) => e.stopPropagation() }
      >
        <h2 className="text-md text-center" id="confirm-dialog-title">{ title }</h2>
        <div className="text-sm text-neutral-300 text-center">{ message }</div>

        { children }

        { error && <p className="form-error" role="alert">{ error }</p> }

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            className="btn-ghost flex-none whitespace-nowrap py-2 px-3 text-sm"
            onClick={ handleCancel }
            disabled={ isSubmitting }
          >
            { cancelLabel }
          </button>
          <button
            type="button"
            className={ `icon-cta ${danger ? 'cta-danger' : 'cta-primary'} flex-none whitespace-nowrap py-2 px-4 text-sm` }
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