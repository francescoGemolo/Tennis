import { HugeiconsIcon } from '@hugeicons/react';
import { TennisBallIcon } from '@hugeicons/core-free-icons';
import { isFeminineName } from '../nameGender';

interface WelcomeProps {
  name: string;
}

export function Welcome({ name }: WelcomeProps) {
  const greeting = isFeminineName(name) ? 'Benvenuta' : 'Benvenuto';

  return (
    <section className="view items-center" aria-label={ `${greeting}, ${name}` }>
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="flex items-center justify-center w-[var(--size-icon-xl)] h-[var(--size-icon-xl)] shrink-0 border-hairline rounded-full bg-transparent text-accent"
            aria-hidden="true"
          >
            <HugeiconsIcon icon={ TennisBallIcon } size={ 22 } strokeWidth={ 1.5 } />
          </span>
          <h1 className="text-xl">{ greeting }, <span className="text-accent">{ name }</span></h1>
        </div>
      </div>
    </section>
  );
}