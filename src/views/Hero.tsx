import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon, TennisBallIcon, UserIcon } from '@hugeicons/core-free-icons';
import { InstallGuide } from '../components/InstallGuide';
import { BADGE_NAME, HERO_SUBTITLE, HERO_TITLE } from '../config';
import './Hero.css';

interface HeroProps {
  onBook: () => void;
  onContact: () => void;
  onAccount: () => void;
}

export function Hero({ onBook, onContact, onAccount }: HeroProps) {
  return (
    <section className="view hero" aria-labelledby="welcome-title">
      <div className="view-utilities">
        <button type="button" className="btn-round" aria-label="Area personale" onClick={ onAccount }>
          <HugeiconsIcon icon={ UserIcon } size={ 18 } strokeWidth={ 1.5 } />
        </button>
        <InstallGuide />
      </div>

      <div className="hero-content">
        <span className="eyebrow">{ BADGE_NAME }</span>
        <h1 id="welcome-title">{ HERO_TITLE }</h1>
        <p>{ HERO_SUBTITLE }</p>
      </div>

      <nav className="hero-cta" aria-label="Azioni principali">
        <button className="icon-cta cta-primary" type="button" onClick={ onBook }>
          <HugeiconsIcon icon={ TennisBallIcon } size={ 18 } strokeWidth={ 1.5 } className="icon-primary" />
          Prenota
        </button>
        <button className="icon-cta cta-secondary" type="button" onClick={ onContact }>
          <HugeiconsIcon icon={ Message01Icon } size={ 16 } strokeWidth={ 1.5 } className="icon-secondary" />
          Contatti
        </button>
      </nav>

      <span className="site-signature" aria-hidden="true">made by Gemolo</span>
    </section>
  );
}
