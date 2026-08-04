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
      className="confirmation-banner-wrapper fixed bottom-[calc(var(--safe-bottom)+var(--spacing-4))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-(var(--spacing-5)*2))] max-w-[440px] pointer-events-none"
      role="status"
      aria-live="polite"
      aria-labelledby="confirmation-title"
    >
      <div
        className={ `pointer-events-auto flex items-center justify-between gap-3 py-3 px-4 rounded-lg bg-neutral-900 border-hairline shadow-lg ${
          closing
            ? 'animate-[banner-bounce-out_320ms_cubic-bezier(0.34,1.56,0.64,1)_forwards]'
            : 'animate-[banner-bounce_400ms_cubic-bezier(0.34,1.56,0.64,1)_forwards]'
        }` }
        onAnimationEnd={ () => closing && onClose() }
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="flex items-center justify-center w-[var(--size-icon-md)] h-[var(--size-icon-md)] shrink-0 border border-[color-mix(in_srgb,var(--color-success)_40%,transparent)] rounded-full bg-[color-mix(in_srgb,var(--color-success)_20%,transparent)] text-success"
            aria-hidden="true"
          >
            <HugeiconsIcon icon={ Tick02Icon } size={ 18 } strokeWidth={ 1.5 } />
          </span>

          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-sm font-semibold text-neutral-50 whitespace-nowrap overflow-hidden text-ellipsis" id="confirmation-title">{ title }</h2>
            <p className="text-xs text-neutral-300 whitespace-nowrap overflow-hidden text-ellipsis">{ details }</p>
          </div>
        </div>

        <button
          className="confirmation-done-btn shrink-0 py-2 px-4 text-xs font-semibold rounded-md border-hairline bg-neutral-800 text-neutral-50 cursor-pointer"
          type="button"
          onClick={ dismiss }
        >
          Fatto
        </button>
      </div>
    </div>
  );
}