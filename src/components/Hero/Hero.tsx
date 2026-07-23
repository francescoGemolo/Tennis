import { Icon } from '../../icons/Icon';
import { BADGE_NAME, HERO_SUBTITLE, HERO_TITLE } from '../../data/content';
import './Hero.css';

interface HeroProps {
  onBook: () => void;
  onContact: () => void;
}

export function Hero({ onBook, onContact }: HeroProps) {
  return (
    <section className="view hero" aria-labelledby="welcome-title">
      <div className="hero-content">
        <span className="eyebrow">{BADGE_NAME}</span>
        <h1 id="welcome-title">{HERO_TITLE}</h1>
        <p>{HERO_SUBTITLE}</p>
      </div>
      <nav className="hero-cta" aria-label="Azioni principali">
        <button className="icon-cta cta-primary" type="button" onClick={onBook}>
          <Icon name="calendar" size={16} className="icon-primary" />
          Prenota
        </button>
        <button className="icon-cta cta-secondary" type="button" onClick={onContact}>
          <Icon name="message" size={16} className="icon-secondary" />
          Contatti
        </button>
      </nav>
    </section>
  );
}