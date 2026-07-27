import { HugeiconsIcon } from '@hugeicons/react';
import { TennisBallIcon } from '@hugeicons/core-free-icons';
import { HERO_TITLE } from '../config';
import { isFeminineName } from '../nameGender';
import './Auth.css';

interface WelcomeProps {
  name: string;
}

export function Welcome({ name }: WelcomeProps) {
  const greeting = isFeminineName(name) ? 'Benvenuta' : 'Benvenuto';

  return (
    <section className="view auth-view" aria-label={ `${greeting}, ${name}` }>
      <div className="auth-content">
        <div className="welcome-message">
          <span className="auth-sent-icon" aria-hidden="true">
            <HugeiconsIcon icon={ TennisBallIcon } size={ 22 } strokeWidth={ 1.5 } />
          </span>
          <span className="eyebrow">{ HERO_TITLE }</span>
          <h1 className="welcome-title">{ greeting }, <span className="text-accent">{ name }</span></h1>
        </div>
      </div>
    </section>
  );
}