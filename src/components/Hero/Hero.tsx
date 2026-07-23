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
        <span className="eyebrow">Prenotazione rapida</span>
        <h1 id="welcome-title">Tennis Salandra</h1>
        <p>Prenota il campo online e scendi in gioco.</p>
      </div>
      <nav className="hero-cta" aria-label="Azioni principali">
        <button className="icon-cta cta-primary" type="button" onClick={onBook}>
          <Icon name="calendar" className="icon-primary" />
          Prenota ora
        </button>
        <button className="icon-cta cta-secondary" type="button" onClick={onContact}>
          <Icon name="phone" className="icon-secondary" />
          Contatti
        </button>
      </nav>
    </section>
  );
}