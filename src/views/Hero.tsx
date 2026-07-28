import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon, TennisBallIcon, UserIcon } from '@hugeicons/core-free-icons';
import { InstallGuide } from '../components/InstallGuide';
import { HERO_SUBTITLE, HERO_TITLE } from '../config';
import './Hero.css';

interface HeroProps {
  onBook: () => void;
  onContact: () => void;
  onAccount: () => void;
}

export function Hero({ onBook, onContact, onAccount }: HeroProps) {
  const heroTitleWords = HERO_TITLE.split(' ');
  const heroTitleAccent = heroTitleWords.pop();
  const heroTitleLead = heroTitleWords.join(' ');

  return (
    <section className="view hero" aria-labelledby="welcome-title">
      <div className="view-utilities">
        <InstallGuide />
        <button type="button" className="btn-round" aria-label="Area personale" onClick={ onAccount }>
          <HugeiconsIcon icon={ UserIcon } size={ 18 } strokeWidth={ 1.5 } />
        </button>
      </div>

      <div className="hero-main">
        <div className="hero-content">
          <h1 id="welcome-title">{ heroTitleLead ? `${heroTitleLead} ` : '' }<span className="text-accent">{ heroTitleAccent }</span></h1>
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
      </div>

      <span className="site-signature" aria-hidden="true">made by Gemolo</span>
    </section>
  );
}