import { HugeiconsIcon } from '@hugeicons/react';
import { TennisBallIcon } from '@hugeicons/core-free-icons';

type TennisBallLoaderSize = 'sm' | 'md' | 'lg';

const ICON_SIZE_PX: Record<TennisBallLoaderSize, number> = {
  sm: 20,
  md: 28,
  lg: 40,
};

interface TennisBallLoaderProps {
  size?: TennisBallLoaderSize;
}

export function TennisBallLoader({ size = 'md' }: TennisBallLoaderProps) {
  return (
    <span
      className="inline-flex items-center justify-center text-accent animate-[spin_900ms_linear_infinite] drop-shadow-[0_4px_8px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]"
      aria-hidden="true"
    >
      <HugeiconsIcon icon={ TennisBallIcon } size={ ICON_SIZE_PX[size] } strokeWidth={ 1.25 } />
    </span>
  );
}