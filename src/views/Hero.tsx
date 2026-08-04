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
    <section className="view items-center text-center" aria-labelledby="welcome-title">
      <div className="view-utilities">
        <InstallGuide />
        <button type="button" className="btn-round ml-auto" aria-label="Area personale" onClick={ onAccount }>
          <HugeiconsIcon icon={ UserIcon } size={ 18 } strokeWidth={ 1.5 } />
        </button>
      </div>

      <div className="hero-main flex-1 min-h-0 flex flex-col items-center justify-center">
        <div className="hero-content flex flex-col items-center">
          <h1 id="welcome-title" className="text-[clamp(1.5rem,8vw,2.25rem)] tracking-[-0.01em] whitespace-nowrap">
            { heroTitleLead ? `${heroTitleLead} ` : '' }<span className="text-accent">{ heroTitleAccent }</span>
          </h1>
          <p>{ HERO_SUBTITLE }</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-3 shrink-0" aria-label="Azioni principali">
          <button className="icon-cta cta-primary flex-1 min-w-[8rem]" type="button" onClick={ onBook }>
            <HugeiconsIcon icon={ TennisBallIcon } size={ 18 } strokeWidth={ 1.5 } className="icon-primary" />
            Prenota
          </button>
          <button className="icon-cta cta-secondary flex-1 min-w-[8rem]" type="button" onClick={ onContact }>
            <HugeiconsIcon icon={ Message01Icon } size={ 16 } strokeWidth={ 1.5 } className="icon-secondary" />
            Contatti
          </button>
        </nav>
      </div>

      <span
        className="site-signature absolute left-1/2 -translate-x-1/2 bottom-[calc(var(--safe-bottom)+0.25rem)] text-[0.55rem] tracking-[0.02em] text-neutral-500 opacity-55 pointer-events-none select-none whitespace-nowrap [transition:opacity_var(--transition-normal)]"
        aria-hidden="true"
      >
        made by Gemolo
      </span>
    </section>
  );
}