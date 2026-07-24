import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

interface BackButtonProps {
  label?: string;
  onClick: () => void;
}

export function BackButton({ label = 'Indietro', onClick }: BackButtonProps) {
  return (
    <button className="btn-ghost" type="button" onClick={ onClick }>
      <HugeiconsIcon icon={ ArrowLeft01Icon } size={ 18 } strokeWidth={ 1.5 } />
      { label }
    </button>
  );
}