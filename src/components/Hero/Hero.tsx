import { Icon } from '../../icons/Icon';
import './Hero.css';

interface HeroProps {
  onBook: () => void;
  onContact: () => void;
}

export function Hero({ onBook, onContact }: HeroProps) {
  return (
    <section className="view hero" aria-labelledby="welcome-title">
      <div className="hero-content">
        <span className="eyebrow">Tennis Salandra</span>
        <h1 id="welcome-title">Chi ha messo i tavoli qui?</h1>
        <p>Ciao Pippo, sono stato io, Nicola Ciocia.</p>
      </div>
      <nav className="hero-cta" aria-label="Azioni principali">
        <button className="icon-cta cta-primary" type="button" onClick={onBook}>
          <Icon name="calendar" className="icon-primary" />
          Prenota
        </button>
        <button className="icon-cta cta-secondary" type="button" onClick={onContact}>
          <Icon name="phone" className="icon-secondary" />
          Contatti
        </button>
      </nav>
    </section>
  );
}